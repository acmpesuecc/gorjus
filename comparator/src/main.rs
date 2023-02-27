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
        my_request: Request<ImageCompareRequest>,
    ) -> Result<Response<ImageCompareReply>, Status> {
        let req = my_request.into_inner();

        // Actually do the comparison
        println!("Got a request! {:?}", &req);

        let operation = MatchOperation::new(req.clone().image1name, req.image2name, 1.00 - 0.1175)
            .match_images();

        let reply = comparator::ImageCompareReply {
            comparison_percentage: operation as f32,
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
