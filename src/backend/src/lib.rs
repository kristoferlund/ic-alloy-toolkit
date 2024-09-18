use alloy::{
    eips::BlockNumberOrTag,
    primitives::{Address, U256},
    providers::{Provider, ProviderBuilder},
    rpc::client::{ClientBuilder, IcpClient},
    transports::icp::{EthSepoliaService, IcpConfig, RpcService},
};
use ic_cdk::export_candid;

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
async fn get_batch_balances(addresses: Vec<String>) -> Result<String, String> {
    let config = IcpConfig::new(RPC_SERVICE);
    let client: IcpClient = ClientBuilder::default().icp(config);

    let mut batch = client.new_icp_batch();
    let tag = BlockNumberOrTag::Latest;
    let mut get_balance_calls = Vec::new();

    for address in addresses {
        let address = match address.parse::<Address>() {
            Ok(addr) => addr,
            Err(e) => return Err(e.to_string()),
        };
        let call = batch.add_call("eth_getBalance", &(address, tag)).unwrap();
        get_balance_calls.push(call);
    }

    batch.send().await.unwrap();

    let mut balances = Vec::new();
    for call in get_balance_calls {
        let balance: U256 = call.await.unwrap();
        balances.push(balance.to_string());
    }

    Ok(balances.join(","))
}

export_candid!();
