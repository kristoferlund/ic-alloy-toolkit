mod service;

use alloy::{
    signers::icp::IcpSigner,
    transports::icp::{RpcApi, RpcService},
};
use ic_cdk::export_candid;

fn get_rpc_service() -> RpcService {
    RpcService::Custom(RpcApi {
        url: "https://catts-evm-proxy-2.kristofer-977.workers.dev/eth-sepolia".to_string(),
        //url: "https://9c9b-217-213-65-240.ngrok-free.app/eth-sepolia".to_string(),
        headers: None,
    })
}

fn get_ecdsa_key_name() -> String {
    #[allow(clippy::option_env_unwrap)]
    let dfx_network = option_env!("DFX_NETWORK").unwrap();
    match dfx_network {
        "local" => "dfx_test_key".to_string(),
        "ic" => "key_1".to_string(),
        _ => panic!("Unsupported network."),
    }
}

async fn create_icp_signer() -> IcpSigner {
    let ecdsa_key_name = get_ecdsa_key_name();
    let chain_id = 11155111;
    IcpSigner::new(vec![], &ecdsa_key_name, Some(chain_id))
        .await
        .unwrap()
}

export_candid!();
