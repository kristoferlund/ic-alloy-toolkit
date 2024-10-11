# Alloy + ICP Toolkit

[Alloy](https://alloy.rs/) is the next generation of Ethereum support libraries,
written in Rust and designed for scalability and performance. Alloy is a rewrite
of of [ethers-rs](https://github.com/gakonst/ethers-rs) from the ground up.
Alloy includes built in support for transports like HTTP, WebSockets and IPC.

**Alloy now also works with the Internet Computer (ICP)!**

The Alloy libraries have been forked to add support for ICP as a transport
layer. This makes it possible to use the full feature set of Alloy from ICP
canisters.

This repository contains a collection of examples of how to use Alloy in an IC
context.

- The backend canister interacting with the EVM through Alloy is written in
  Rust.
- The frontend canster uses Vite/React.
- The ic-alloy fork: <https://github.com/kristoferlund/ic-alloy>
- Live demo: <https://u4yi6-xiaaa-aaaap-aib2q-cai.icp0.io>

![screenshot](media/screenshot.png)

## Example, get the balance of an address

```Rust
#[ic_cdk::update]
async fn get_balance(address: String) -> Result<String, String> {
    let address = address.parse::<Address>().map_err(|e| e.to_string())?;
    let rpc_service = RpcService::EthSepolia(EthSepoliaService::Alchemy);
    let config = IcpConfig::new(rpc_service);
    let provider = ProviderBuilder::new().on_icp(config);
    let result = provider.get_balance(address).await;

    match result {
        Ok(balance) => Ok(balance.to_string()),
        Err(e) => Err(e.to_string()),
    }
}
```

[get_balance.rs](src/backend/src/service/get_balance.rs)

## Example, sign a message

```Rust
#[ic_cdk::update]
async fn sign_message(message: String) -> Result<String, String> {
    let ecdsa_key_name = "key_1".to_string();
    IcpSigner::new(vec![], &ecdsa_key_name, None)).await.unwrap();
    let signature = signer.sign_message(message.as_bytes()).await.unwrap();
    Ok(format!("{:?}", signature))
}
```

[sign_message.rs](src/backend/src/service/sign_message.rs)

## Run locally

Pre-requisites:

- Fork the [ic-alloy](https://github.com/kristoferlund/ic-alloy) repository as a
  sibling to this repository.
- Check out the `icp` branch in the forked repository.

Run:

```bash
dfx start --background
dfx deploy
```

## Author

- [kristofer@kristoferlund.se](mailto:kristofer@kristoferlund.se)
- Twitter: [@kristoferlund](https://twitter.com/kristoferlund)
- Discord: kristoferkristofer
- Telegram: [@kristoferkristofer](https://t.me/kristoferkristofer)

## License

This project is licensed under the MIT License. See the LICENSE file for more
details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you
have any suggestions or improvements.
