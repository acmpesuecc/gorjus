package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/anirudhRowjee/cssbatt-demux/database"
	"github.com/anirudhRowjee/cssbatt-demux/proto"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var globdb *gorm.DB

type ImageCompareRequestJSON struct {
	im1_name string `json:"im1_name"`
	im2_name string `json:"im2_name"`
}

// Can use the models User struct, []
type RegisterUserRequestJSON struct {
	Username string `form:"username"`
	Password string `form:"password"`
	Email    string `form:"email"`
}

type LoginUserRequestJSON struct {
	Username string `form:"username"`
	Password string `form:"password"`
}

func auth_token_verify(c *gin.Context) {
	current_token := c.Request.Header["Token"]
	current_user := c.Request.Header["Username"]
	user_session_record := database.Sessions{
		Name:  current_user[0],
		Token: current_token[0],
	}
	var db_res []database.Sessions
	log.Println(user_session_record)
	globdb.Where(user_session_record).Find(&db_res)
	for _, v := range db_res {
		if v.Name == current_user[0] && v.Token == current_token[0] {
			c.Next()
			return
		}
	}
	c.JSON(http.StatusBadRequest, gin.H{
		"status":  "false",
		"message": "You are not authenticated to do this!",
	})
	c.Abort()
}

func main() {

	// TODO Change this to the environment IP Address
	addr := flag.String("addr", "localhost:50051", "the address to connect to")

	comparator_grpc_conn, err := grpc.Dial(
		*addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	renderer_grpc_conn, err := grpc.Dial(
		"localhost:50052",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer comparator_grpc_conn.Close()
	log.Println("Successfully connected to GRPC")

	protoclient_compare := proto.NewComparatorClient(comparator_grpc_conn)
	protoclient_render := proto.NewRendererClient(renderer_grpc_conn)

	db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})
	globdb = db
	if err != nil {
		fmt.Println("Error", err)
		return
	}
	log.Println("Finished DB Initialization")

	// Migrations
	db.AutoMigrate(&database.RenderEvent{})
	db.AutoMigrate(&database.CompareEvent{})
	db.AutoMigrate(&database.LeaderboardRecord{})
	db.AutoMigrate(&database.User{})
	db.AutoMigrate(&database.Question{})
	db.AutoMigrate(&database.Sessions{})
	log.Println("Finished DB Automigration")

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.GET("/login", func(c *gin.Context) {
		var b LoginUserRequestJSON
		err := c.BindJSON(&b)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "false",
				"message": "Invalid request",
			})
			return
		}
		checkuserstruct := database.User{
			Name: b.Username,
		}
		var db_res []database.User
		db.Where(&checkuserstruct).Find(&db_res)

		for _, v := range db_res {
			if v.Name == b.Username && v.Password == b.Password {
				//Need to generate token and track in database
				//If already in database, dont allow login
				time_now := string(time.Now().Unix())
				live_token, err := bcrypt.GenerateFromPassword([]byte(time_now), bcrypt.DefaultCost)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{
						"status":  "error",
						"message": "Something went wrong generating time in server",
					})
					return
				}
				session_search_query := database.Sessions{
					Name: v.Name,
				}
				log.Println(session_search_query)
				var db_res2 []database.Sessions
				db.Where(&session_search_query).Find(&db_res2)
				for _, vi := range db_res2 {
					if vi.Name == v.Name {
						c.JSON(http.StatusBadRequest, gin.H{
							"status":  "false",
							"message": "User already logged in!",
						})
						return
					}
				}
				//If it reaches here means, there is no login/session tokens for user
				new_session_record := database.Sessions{
					Name:  v.Name,
					Token: string(live_token),
				}
				result := db.Create(&new_session_record)
				if result.Error != nil {
					c.JSON(http.StatusInternalServerError, gin.H{
						"status":  "error",
						"message": "Error logging in user!",
						"error":   result.Error,
					})
					return
				}
				c.JSON(http.StatusOK, gin.H{
					"status":  "true",
					"message": "logged in!",
					"token":   string(live_token),
				})
				return
			}
		}
		//User not found
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "false",
			"message": "user does not exists or wrong credentials!",
		})
	})

	r.POST("/register", func(c *gin.Context) {
		var b RegisterUserRequestJSON
		err := c.BindJSON(&b)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "false",
				"message": "Invalid request",
			})
			return
		}
		checkuserstruct := database.User{
			Name: b.Username,
		}
		var db_res []database.User
		db.Where(checkuserstruct).Find(&db_res)

		for _, v := range db_res {
			if v.Name == b.Username {
				c.JSON(http.StatusOK, gin.H{
					"status":  "false",
					"message": "User with that name already exists",
				})
				return
			}
		}

		newuser := database.User{
			Name:     b.Username,
			Email:    b.Email,
			Password: b.Password,
		}

		result := db.Create(&newuser)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "false",
				"message": "Failed to create new user",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status":  "true",
			"message": "Successfully registerd!",
		})
	})

	r.Use(auth_token_verify) //[NOTE] All endpoints below this need an active user sessions (header should have 2 fields `Username` and `Token`)

	r.GET("/logout", func(c *gin.Context) {
		//Just a normal empty request with Username and Token in header is good enough for this endpoint

		username := c.Request.Header["Username"][0]
		token := c.Request.Header["Token"][0]
		//indexing into 0 here is fine as we will catch missing header in middleware function itself

		user_session_record := database.Sessions{
			Name:  username,
			Token: token,
		}
		db.Where(&user_session_record).Delete(&user_session_record)
		c.JSON(http.StatusOK, gin.H{
			"status":  "true",
			"message": "User logged out Successfully!",
		})
	})

	r.GET("/leaderboard", func(c *gin.Context) {
		// TODO Implement Leaderboard
		c.JSON(http.StatusOK, gin.H{
			"message": "leaderboard",
		})
	})

	r.POST("/render", func(c *gin.Context) {
		args := proto.ImageRenderRequestJSON{}
		myerr := true

		args.Name, myerr = c.GetPostForm("name")
		if !myerr {
			log.Println("image name not there")
		}
		args.Html_string, myerr = c.GetPostForm("html_string")
		if !myerr {
			log.Println("html string not there")
		}
		args.Css_string, myerr = c.GetPostForm("css_string")
		if !myerr {
			log.Println("css string not there")
		}

		image, err := proto.Get_image_rendered_output(
			protoclient_render,
			args.Html_string,
			args.Css_string,
			args.Name,
		)
		if err != nil {
			log.Println("Broken")
			c.JSON(http.StatusBadRequest, gin.H{
				"message": err,
			})
		}

		c.Data(http.StatusOK, "image/png", image)
	})

	r.POST("/compare_existing", func(c *gin.Context) {
		// This also works!

		// Take in image names, make rpc call, return result
		args := proto.ImageCompareRequestJSON{}
		myerr := true

		args.Im1_name, myerr = c.GetPostForm("im1_name")
		if !myerr {
			log.Println("Im1name not there")
		}
		args.Im2_name, myerr = c.GetPostForm("im2_name")
		if !myerr {
			log.Println("Im2name not there")
		}

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   err.Error(),
				"message": "Badly Formatted Request Body",
			})
		}

		log.Println("Args Recived ", args, err)

		value, err := proto.Get_image_compare_perc(
			protoclient_compare,
			args.Im1_name,
			args.Im2_name,
		)
		if err != nil {
			log.Println("Broken")
			c.JSON(http.StatusBadRequest, gin.H{
				"message": err,
			})
		}

		c.JSON(http.StatusOK, gin.H{
			"message": value,
		})

	})

	r.POST("/deliver", func(c *gin.Context) {
		// Takes in:
		// [UserID: String, UserHTMLnCSS: String]
		// Returns:
		// [RenderedImge: Byte[]]
		// THIS WORKS!

		myerr := false
		args := proto.ImageDeliverRequestJSON{}
		args.Name, myerr = c.GetPostForm("name")
		if !myerr {
			log.Println("name not there")
		}

		image_bytes, err := proto.Get_image(protoclient_render, args.Name)
		if err != nil {
			log.Println("Broken")
			c.JSON(http.StatusBadRequest, gin.H{
				"message": err,
			})
		}

		c.Data(http.StatusOK, "image/png", image_bytes)

	})

	r.POST("/compare", func(c *gin.Context) {

		// Takes in:
		// [UserID: String, RefImage: Byte[], UserImge: Byte[]]
		// Returns:
		// [accuracy: float]
		// Make a call to the comparator service here and proxy the response
		// TODO look at taking in a reference image ID

		c.JSON(http.StatusOK, gin.H{
			"message": "compare",
		})

	})

	log.Println("Finished Route Declarations")

	http.ListenAndServe(":8080", r)
}
