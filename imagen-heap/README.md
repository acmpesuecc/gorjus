# Imagen-Heap

Imagen-heap is the image generation service, essentially acting as the following interface -

```
(html, css) -> [IMAGENHEAP] -> (image)
```

## Build and Run instructions (Docker)

```
$ docker build -t gorjus:imagen .
$ docker run --privileged -p 9000:80 -v test:/app gorjus-imagen:latest
```
