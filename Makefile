# Makefile for this project
#

protobuf:
	# Steps to build all the protobuf code for this project
	# echo "Compiling Protobuf for Rust"
	# protoc ./proto/comparator.proto \
	# 	--go_out=./demux/proto/ \
	# 	--go_opt=paths=source_relative \
	# 	--go-grpc_out=./demux/proto/ \
	# 	--go-grpc_opt=paths=source_relative \
	# 	--proto_path=./proto/
	echo "Compiling Protobuf for Golang"
	protoc ./proto/comparator.proto \
		--go_out=./demux/proto/ \
		--go_opt=paths=source_relative \
		--go-grpc_out=./demux/proto/ \
		--go-grpc_opt=paths=source_relative \
		--proto_path=./proto/
	echo "Compiling Protobuf for Python"
	./imagen-heap/env/bin/python3 -m grpc_tools.protoc -I ./proto/ \
		--python_out=./imagen-heap/ \
		--pyi_out=./imagen-heap/ \
		--grpc_python_out=./imagen-heap/ \
		./proto/comparator.proto
	echo "Protobuf Compilation Done"
