use alloy::{
    primitives::Address,
    providers::{Provider, ProviderBuilder},
    transports::icp::{EthSepoliaService, RpcService},
};

#[ic_cdk::update]
async fn get_latest_block() -> Result<String, String> {
    let provider =
        ProviderBuilder::new().on_icp(RpcService::EthSepolia(EthSepoliaService::Alchemy));
    let result = provider.get_block_number().await;

    match result {
        Ok(block) => Ok(block.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[ic_cdk::update]
async fn get_balance(address: String) -> Result<String, String> {
    let address = address.parse::<Address>().map_err(|e| e.to_string())?;
    let provider =
        ProviderBuilder::new().on_icp(RpcService::EthSepolia(EthSepoliaService::Alchemy));
    let result = provider.get_balance(address).await;

    match result {
        Ok(balance) => Ok(balance.to_string()),
        Err(e) => Err(e.to_string()),
    }
}
