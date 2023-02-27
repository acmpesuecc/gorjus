// TODO Add Tonic

use image;
use image_compare::Metric;
use std::path::PathBuf;

pub struct MatchOperation {
    im1: String,
    im2: String,
    max_delta: f64,
    expected_val: f64,
}

impl MatchOperation {
    pub fn new(im1: String, im2: String, expected_val: f64) -> MatchOperation {
        MatchOperation {
            im1,
            im2,
            max_delta: 0.0001,
            expected_val,
        }
    }

    pub fn match_images(&self) -> f64 {
        let im1_path: PathBuf = PathBuf::from(self.im1.clone().as_str());
        let im2_path: PathBuf = PathBuf::from(self.im2.clone().as_str());

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

        let result = match image_compare::gray_similarity_histogram(
            Metric::Hellinger,
            &image_one,
            &image_two,
        ) {
            // HACK
            Ok(value) => 1.0 - value,
            Err(e) => panic!("Comparison Failed -> {}", e),
        };

        println!("Comparison Result => {:?}", result);
        result
    }

    pub fn run_test(&mut self, expected_val: f64) {
        let result = self.match_images();
        let diff = expected_val - result;
        println!("Result {} Expected {} Diff {}", result, expected_val, diff);
        // HACK check range
        assert!(diff < self.max_delta);
        assert!(diff > (-1.0 * self.max_delta));
    }
}

#[cfg(test)]
mod tests {

    use crate::compare::MatchOperation;

    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }

    #[test]
    fn ads_test() {
        let tests: Vec<MatchOperation> = vec![
            // 1 and 2 give 11.75
            MatchOperation::new(
                "./src/test_images/ads1.jpg".to_string(),
                "./src/test_images/ads2.jpg".to_string(),
                1.00 - 0.1175,
            ),
            // 1 and 3 give 24.03
            MatchOperation::new(
                "./src/test_images/ads1.jpg".to_string(),
                "./src/test_images/ads3.jpg".to_string(),
                1.00 - 0.2403,
            ),
            // 1 and 4 give 33.09
            MatchOperation::new(
                "./src/test_images/ads1.jpg".to_string(),
                "./src/test_images/ads2.jpg".to_string(),
                1.00 - 0.1175,
            ),
        ];
        for mut test in tests {
            test.run_test(test.expected_val);
        }
    }
}
