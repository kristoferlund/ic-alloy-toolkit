use alloy::{
    network::{EthereumWallet, TransactionBuilder},
    primitives::U256,
    providers::{Provider, ProviderBuilder},
    rpc::types::request::TransactionRequest,
    signers::Signer,
    transports::icp::IcpConfig,
};

use crate::{create_icp_signer, get_rpc_service_sepolia};

/// This function will attempt to send 100 wei to the ethereum address of the canister.
///
/// Transfer some SepoliaEth to the canister address before calling this function.
///
/// Using `with_recommended_fillers` with the provider means the following RPC functions
/// will be called before transaction is made:
/// - `eth_getTransactionCount`: To determine the nonce of the Transction
/// - `eth_chainId`: To determine the chain id
/// - `eth_feeHistory`: To determine historic gas price
/// - `eth_estimateGas`: To determine the gas limit
#[ic_cdk::update]
async fn send_eth_with_fillers() -> Result<String, String> {
    let rpc_service = get_rpc_service_sepolia();
    let signer = create_icp_signer().await;
    let config = IcpConfig::new(rpc_service);
    let address = signer.address();
    let wallet = EthereumWallet::from(signer);

    let provider = ProviderBuilder::new()
        .with_recommended_fillers()
        .wallet(wallet)
        .on_icp(config);

    let tx = TransactionRequest::default()
        .with_to(address)
        .with_value(U256::from(100));

    let transport_result = provider.send_transaction(tx.clone()).await;
    match transport_result {
        Ok(builder) => {
            let node_hash = *builder.tx_hash();
            let pending_tx = provider.get_transaction_by_hash(node_hash).await.unwrap();
            Ok(format!("{:?}", pending_tx))
        }
        Err(e) => Err(format!("{:?}", e)),
    }
}
