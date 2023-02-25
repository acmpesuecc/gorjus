# test
from fastapi.responses import FileResponse
from fastapi import FastAPI
from pydantic import BaseModel
from html2image import Html2Image

app = FastAPI()
hti = Html2Image()

class Item(BaseModel):
    html_str: str
    css_str: str

@app.get("/")
async def read_root():

    # This is the core method
    hti.screenshot(
            save_as='python_org.png',
            html_str = """<h1> An interesting title </h1> This page will be red""",
            css_str = "body {background: red;}",
            size=(400, 300)        
    )

    return FileResponse("python_org.png")

@app.post("/")
async def generate_image(item: Item):

    print(item.html_str, item.css_str)

    # This is the core method
    hti.screenshot(
            # TODO Generate a hash for this image that you can track
            save_as='latest.png',
            html_str = item.html_str,
            css_str = item.css_str,
            size=(400, 300)        
    )

    return FileResponse("python_org.png")
