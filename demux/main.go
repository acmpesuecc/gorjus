package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/anirudhRowjee/cssbatt-demux/database"
	"github.com/anirudhRowjee/cssbatt-demux/proto"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

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
	log.Println("Finished DB Automigration")

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.GET("/login", func(c *gin.Context) {
		// TODO Implement Login
		c.JSON(http.StatusOK, gin.H{
			"message": "login",
		})
	})

	r.POST("/register", func(c *gin.Context) {
		// TODO Implement Registration
		c.JSON(http.StatusOK, gin.H{
			"message": "register",
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
