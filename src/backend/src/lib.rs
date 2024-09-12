#![allow(
    dead_code,
    non_upper_case_globals,
    non_snake_case,
    clippy::enum_variant_names,
    clippy::large_enum_variant
)]
mod evm_rpc;

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
