mod service;

use alloy::transports::icp::{EthSepoliaService, RpcService};
use ic_cdk::export_candid;

const RPC_SERVICE: RpcService = RpcService::EthSepolia(EthSepoliaService::Alchemy);

export_candid!();
