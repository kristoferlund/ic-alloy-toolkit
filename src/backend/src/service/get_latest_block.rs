use alloy::{
    providers::{Provider, ProviderBuilder},
    transports::icp::IcpConfig,
};

use crate::RPC_SERVICE;

#[ic_cdk::update]
async fn get_latest_block() -> Result<String, String> {
    let config = IcpConfig::new(RPC_SERVICE);
    let provider = ProviderBuilder::new().on_icp(config);
    let result = provider.get_block_number().await;

    match result {
        Ok(block) => Ok(block.to_string()),
        Err(e) => Err(e.to_string()),
    }
}
