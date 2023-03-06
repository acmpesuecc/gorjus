# test
from html2image import Html2Image

import grpc
import comparator_pb2
from concurrent import futures
import comparator_pb2_grpc


hti = Html2Image(custom_flags=["--no-sandbox"])
hti.output_path = "./render/rendered_images/"

class ImageRenderServer(comparator_pb2_grpc.RendererServicer):
    """
    Server Method for the Service
    """

    def RenderImage(self, request: comparator_pb2.RenderImageRequest, context):

        print("[LOG] Processing Image Generation Request", request.image_html, request.image_css)
        image_path = hti.screenshot(
                save_as= request.imageName,
                html_str = request.image_html,
                css_str = request.image_css,
                size=(400, 300)        
                )[0]

        with open(image_path, "rb") as image:
            f = image.read()
            image_content = bytearray(f)

        print("[LOG] Succesfully Processed Image Generation Request", request)
        return comparator_pb2.RenderImageReply(
                name = request.imageName,
                error = None,
                image = bytes(image_content)
                )

    def DeliverImage(self, request: comparator_pb2.DeliverImageRequest, context):

        print("[LOG] Processing Image Delivery Request", request)

        with open("./render/" + request.name, "rb") as image:
            f = image.read()
            image_content = bytearray(f)

        print("[LOG] Succesfully Processed Image Delivery Request", request)
        return comparator_pb2.DeliverImageReply(
                name = request.name,
                image = bytes(image_content),
                )


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=1))
  comparator_pb2_grpc.add_RendererServicer_to_server(
          ImageRenderServer() , server)
  server.add_insecure_port('[::]:50052')
  server.start()
  server.wait_for_termination()

if __name__ == "__main__":
    serve()
