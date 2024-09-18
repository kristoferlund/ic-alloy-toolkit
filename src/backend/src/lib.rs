use alloy::{
    eips::BlockNumberOrTag,
    primitives::{Address, U256},
    providers::{Provider, ProviderBuilder},
    rpc::client::{ClientBuilder, IcpClient},
    transports::icp::{EthSepoliaService, IcpConfig, RpcService},
};

const RPC_SERVICE: RpcService = RpcService::EthSepolia(EthSepoliaService::Alchemy);

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

#[ic_cdk::update]
async fn get_balance(address: String) -> Result<String, String> {
    let address = address.parse::<Address>().map_err(|e| e.to_string())?;
    let config = IcpConfig::new(RPC_SERVICE);
    let provider = ProviderBuilder::new().on_icp(config);
    let result = provider.get_balance(address).await;

    match result {
        Ok(balance) => Ok(balance.to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[ic_cdk::update]
async fn get_batch_balances(address: String) -> Result<String, String> {
    let address = address.parse::<Address>().map_err(|e| e.to_string())?;

    let config = IcpConfig::new(RPC_SERVICE);
    let client: IcpClient = ClientBuilder::default().icp(config);

    let mut batch = client.new_icp_batch();

    let tag = BlockNumberOrTag::Latest;

    let balance_fut1 = batch.add_call("eth_getBalance", &(address, tag)).unwrap();
    let balance_fut2 = batch.add_call("eth_getBalance", &(address, tag)).unwrap();

    batch.send().await.unwrap();

    let balance1: U256 = balance_fut1.await.unwrap();
    let balance2: U256 = balance_fut2.await.unwrap();

    Ok("todo".to_string())
}
