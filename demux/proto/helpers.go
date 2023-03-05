package proto

import (
	"context"
	"log"
	"time"
)

type ImageCompareRequestJSON struct {
	Im1_name string `json:"im1_name"`
	Im2_name string `json:"im2_name"`
}

type ImageDeliverRequestJSON struct {
	Name string `json:"name"`
}

type ImageRenderRequestJSON struct {
	Name        string `json:"name"`
	Html_string string `json:"html_string"`
	Css_string  string `json:"css_string"`
}

func Get_image_compare_perc(
	client ComparatorClient,
	im1_name string,
	im2_name string,
) (float32, error) {
	value := 0.0

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	resp, err := client.CompareImages(ctx, &ImageCompareRequest{
		Image1Name: im1_name, Image2Name: im2_name,
	})
	if err != nil {
		log.Fatalf("could not compare: %v", err)
	}

	log.Printf("Comparison: %f", resp.GetComparisonPercentage())
	cancel()
	value = float64(resp.GetComparisonPercentage())
	return float32(value), nil
}

func Get_image_rendered_output(
	client RendererClient,
	html_string string,
	css_string string,
	image_name string,
) ([]byte, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	log.Println("Processing Request -> ", html_string, css_string)

	resp, err := client.RenderImage(ctx, &RenderImageRequest{
		ImageName: image_name, ImageHtml: html_string, ImageCss: css_string,
	})
	if err != nil {
		log.Printf("could not render: %v", err)
		cancel()
		return nil, err
	}
	// log.Printf("Rendered: %s", resp)

	cancel()
	return resp.Image, nil
}

func Get_image(
	client RendererClient,
	image_name string,
) ([]byte, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)

	resp, err := client.DeliverImage(ctx, &DeliverImageRequest{
		Name: image_name,
	})
	if err != nil {
		log.Printf("could not get image: %v", err)
		cancel()
		return nil, err
	}
	// log.Printf("image: %s", resp)

	cancel()
	return resp.Image, nil
}
