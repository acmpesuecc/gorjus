use image::{self};
use image_compare::Metric;
use std::path::PathBuf;

fn matcher(img1: &str, img2: &str) -> f64 {
    let im1_path: PathBuf = PathBuf::from(img1);
    let im2_path: PathBuf = PathBuf::from(img2);

    println!(
        "Comparison Result for {} <> {}",
        im1_path.display(),
        im2_path.display(),
    );

    let image_one = match image::open(&im1_path) {
        Ok(dynamic_image) => dynamic_image.to_luma8(),
        Err(e) => panic!("Error {} loading image {}", e, im1_path.display()),
    };

    let image_two = match image::open(&im2_path) {
        Ok(dynamic_image) => dynamic_image.to_luma8(),
        Err(e) => panic!("Error {} loading image {}", e, im2_path.display()),
    };

    let result =
        match image_compare::gray_similarity_histogram(Metric::Hellinger, &image_one, &image_two) {
            // HACK
            Ok(value) => 1.0 - value,
            Err(e) => panic!("Comparison Failed -> {}", e),
        };

    println!("Comparison Result => {:?}", result);
    result
}

fn main() {
    matcher("./src/test_images/circ1.jpg", "./src/test_images/circ2.jpg");

    /*
    let image_one = image::open("ads1.jpg")
        .expect("Could not find test-image")
        .into_rgb8();
    let image_two = image::open("ads2.jpg")
        .expect("Could not find test-image")
        .into_rgb8();
    let result = image_compare::rgb_hybrid_compare(&image_one, &image_two)
        .expect("Images had different dimensions");

    println!("{:?}", result.score);
    // 1 and 2 => 85.56%
    // 1 and 3 => 81.71%
    // 1 and 4 => 79.2%
    // */

    /*
    let image_one = image::open("ads1.jpg")
        .expect("Could not find test-image")
        .into_luma8();
    let image_two = image::open("ads4.jpg")
        .expect("Could not find test-image")
        .into_luma8();
    let result =
        image_compare::gray_similarity_structure(&Algorithm::MSSIMSimple, &image_one, &image_two)
            .expect("Images had different dimensions");

    println!("{:?}", result.score);
    // 1 and 2: 87.6
    // 1 and 3: 83.31
    // 1 and 4: 82.38
    // */
    /*
        let image_one = image::open("ads1.jpg")
            .expect("Could not find test-image")
            .into_luma8();
        let image_two = image::open("ads3.jpg")
            .expect("Could not find test-image")
            .into_luma8();
        let result =
            image_compare::gray_similarity_histogram(Metric::Hellinger, &image_one, &image_two)
                .expect("Images had different dimensions");
        println!("{:?}", result);
    */
    // 1 and 2 give 11.75
    // 1 and 3 give 24.03
    // 1 and 4 give 33.09
}

#[cfg(test)]
mod tests {

    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
