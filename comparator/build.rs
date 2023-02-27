fn main() -> Result<(), Box<dyn std::error::Error>> {
    // TODO Look at how this gets saved when dockerized
    tonic_build::compile_protos("../proto/comparator.proto")?;
    Ok(())
}
