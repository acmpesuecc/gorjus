use tonic::{transport::Server, Request, Response, Status};

use comparator::comparator_server::{Comparator, ComparatorServer};
use comparator::{ImageCompareReply, ImageCompareRequest};

mod compare;
use compare::MatchOperation;

pub mod comparator {
    tonic::include_proto!("comparator");
}

#[derive(Debug, Default)]
pub struct MyComparator {}

#[tonic::async_trait]
impl Comparator for MyComparator {
    async fn compare_images(
        &self,
        request: Request<ImageCompareRequest>,
    ) -> Result<Response<ImageCompareReply>, Status> {
        // Actually do the comparison
        println!("Got a request! {:?}", request);

        // let operation = MatchOperation::new();

        let reply = comparator::ImageCompareReply {
            comparison_percentage: 69.69,
        };

        Ok(Response::new(reply))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;
    let comparatord = MyComparator::default();

    Server::builder()
        .add_service(ComparatorServer::new(comparatord))
        .serve(addr)
        .await?;

    Ok(())
}
