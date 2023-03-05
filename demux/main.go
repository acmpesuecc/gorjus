package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/anirudhRowjee/cssbatt-demux/database"
	"github.com/anirudhRowjee/cssbatt-demux/proto"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type ImageCompareRequestJSON struct {
	im1_name string `json:"im1_name"`
	im2_name string `json:"im2_name"`
}

func get_image_compare_perc(
	client proto.ComparatorClient,
	im1_name string,
	im2_name string,
) (float32, error) {
	value := 0.0

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	resp, err := client.CompareImages(ctx, &proto.ImageCompareRequest{
		Image1Name: im1_name, Image2Name: im2_name,
	})
	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}

	log.Printf("Greeting: %f", resp.GetComparisonPercentage())
	cancel()
	value = float64(resp.GetComparisonPercentage())
	return float32(value), nil
}

func main() {

	// TODO Change this to the environment IP Address
	addr := flag.String("addr", "localhost:50051", "the address to connect to")
	conn, err := grpc.Dial(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	log.Println("Successfully connected to GRPC")

	protoclient := proto.NewComparatorClient(conn)

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
		c.JSON(http.StatusOK, gin.H{
			"message": "login",
		})
	})

	r.POST("/register", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "register",
		})
	})

	r.GET("/leaderboard", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "leaderboard",
		})
	})

	// TODO Add Routes for Questions
	// TODO Add Routes for Image Delivery

	r.POST("/compare_existing", func(c *gin.Context) {

		// Take in image names, make rpc call, return result
		args := ImageCompareRequestJSON{}
		myerr := true

		args.im1_name, myerr = c.GetPostForm("im1_name")
		if !myerr {
			log.Println("Im1name not there")
		}
		args.im2_name, myerr = c.GetPostForm("im2_name")
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

		value, err := get_image_compare_perc(protoclient, args.im1_name, args.im2_name)

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

	r.POST("/compare", func(c *gin.Context) {

		// Takes in:
		// [UserID: String, RefImage: Byte[], UserImge: Byte[]]
		// TODO look at taking in a reference image ID
		// Returns:
		// [accuracy: float]
		// Make a call to the comparator service here and proxy the response

		c.JSON(http.StatusOK, gin.H{
			"message": "compare",
		})
	})

	r.POST("/render", func(c *gin.Context) {
		// Takes in:
		// [UserID: String, UserHTMLnCSS: String]
		// Returns:
		// [RenderedImge: Byte[]]
		c.JSON(http.StatusOK, gin.H{
			"message": "render",
		})
	})

	log.Println("Finished Route Declarations")

	http.ListenAndServe(":8080", r)
}
