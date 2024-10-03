use alloy::signers::Signer;

use crate::create_icp_signer;

#[ic_cdk::update]
async fn sign_message(message: String) -> Result<String, String> {
    let signer = create_icp_signer().await;
    let signature = signer.sign_message(message.as_bytes()).await.unwrap();
    Ok(format!("{:?}", signature))
}
