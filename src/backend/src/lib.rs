#![allow(
    dead_code,
    non_upper_case_globals,
    non_snake_case,
    clippy::enum_variant_names,
    clippy::large_enum_variant
)]
mod evm_rpc;

use evm_rpc::{
    BlockTag, GetBlockByNumberResult, MultiGetBlockByNumberResult, RpcApi, RpcConfig, RpcServices,
};
use ic_cdk::api::call::{call_with_payment128, CallResult};

const ETH_DEFAULT_CALL_CYCLES: u128 = 30_000_000_000;

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::update]
async fn get_latest_block() -> String {
    let base_url = "https://catts-evm-proxy-2.kristofer-977.workers.dev";

    let rpc_services = RpcServices::Custom {
        chainId: 11155111,
        services: vec![RpcApi {
            url: format!("{}/{}", base_url, "eth-sepolia"),
            headers: None,
        }],
    };

    let res: CallResult<(MultiGetBlockByNumberResult,)> = call_with_payment128(
        evm_rpc::evm_rpc.0,
        "eth_getBlockByNumber",
        (rpc_services, None::<RpcConfig>, BlockTag::Latest),
        ETH_DEFAULT_CALL_CYCLES,
    )
    .await;

    let block = match res {
        Ok((MultiGetBlockByNumberResult::Consistent(GetBlockByNumberResult::Ok(block)),)) => block,
        Ok((inconsistent,)) => ic_cdk::trap(&format!("Inconsistent: {inconsistent:?}")),
        Err(err) => ic_cdk::trap(&format!("{:?}", err)),
    };

    format!("Block: {:?}", block)
}
