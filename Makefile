# Makefile for this project
#

protobuf:
	# Steps to build all the protobuf code for this project
	protoc ./proto/comparator.proto \
		--go_out=./demux/proto/ \
		--go_opt=paths=source_relative \
		--go-grpc_out=./demux/proto/ \
		--go-grpc_opt=paths=source_relative \
		--proto_path=./proto/
