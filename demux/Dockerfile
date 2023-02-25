# syntax=docker/dockerfile:1

FROM golang:1.16
WORKDIR /app
COPY * ./
RUN go build
RUN CGO_ENABLED=0 go build -a -installsuffix cgo -o app .

FROM alpine:latest  
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=0 /app/app ./
CMD ["./app"]
