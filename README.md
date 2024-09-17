# Alloy + ICP Demo

Demo of an ICP canister plus frontend that uses Alloy to interact with Ethereum. Alloy is the next generation of Ethereum support libraries, written in Rust and designed for scalability and performance.

Alloy includes built in support for transports like HTTP, WebSockets and IPC. This demo uses a fork of the Alloy library that adds support for the Internet Computer.

- The ic-alloy fork: https://github.com/kristoferlund/ic-alloy
- Live demo: https://u4yi6-xiaaa-aaaap-aib2q-cai.icp0.io

> [!NOTE]  
> Work in progress. This demo is actively being worked on, support for Alloy signers and more features are coming soon.

## Run locally

Pre-requisites:

- Fork the [ic-alloy](https://github.com/kristoferlund/ic-alloy) repository as a sibling to this repository.
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

This project is licensed under the MIT License. See the LICENSE file for more details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any suggestions or improvements.
