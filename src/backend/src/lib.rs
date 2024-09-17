use alloy::{
    providers::{Provider, ProviderBuilder},
    transports::icp::{EthSepoliaService, RpcService},
};

#[ic_cdk::update]
async fn get_latest_block() -> Result<String, String> {
    let provider = ProviderBuilder::new().on_icp(RpcService::EthSepolia(EthSepoliaService::Ankr));
    let result = provider.get_block_number().await;

    match result {
        Ok(block) => Ok(block.to_string()),
        Err(e) => Err(e.to_string()),
    }
}
