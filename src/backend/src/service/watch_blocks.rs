use std::{cell::RefCell, time::Duration};

use crate::get_rpc_service_sepolia;
use alloy::{
    primitives::FixedBytes,
    providers::{Provider, ProviderBuilder},
    transports::icp::IcpConfig,
};
use ic_cdk_timers::TimerId;

const POLL_LIMIT: usize = 10;

struct State {
    timer_id: Option<TimerId>,
    blocks: Vec<FixedBytes<32>>,
    poll_count: usize,
}

impl State {
    fn default() -> State {
        State {
            // Store the id of the IC_CDK timer used for polling the EVM RPC periodically.
            // This id can be used to cancel the timer before the configured `POLL_LIMIT`
            // has been reached.
            timer_id: None,
            // The block hashes returned by the EVM are stored here for display in the frontend.
            blocks: Vec::new(),
            // The number of polls made. Polls finish automatically, once the `POLL_LIMIT`
            // has been reached. This count is used to create a good interactive UI experience.
            poll_count: 0,
        }
    }
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

/// Using the ICP poller for Alloy allows smart contract canisters
/// to watch EVM blockchain changes easily. In this example, the canister
/// watches for new created blocks.
#[ic_cdk::update]
async fn watch_blocks_start() -> Result<String, String> {
    // Don't start a timer if one is already running
    STATE.with_borrow(|state| {
        if state.timer_id.is_some() {
            return Err("Already watching for blocks.".to_string());
        }
        Ok(())
    })?;

    let rpc_service = get_rpc_service_sepolia();
    let config = IcpConfig::new(rpc_service);
    let provider = ProviderBuilder::new().on_icp(config);

    // This callback will be called every time new blocks are received
    let callback = |incoming_blocks: Vec<FixedBytes<32>>| {
        STATE.with_borrow_mut(|state| {
            for block in incoming_blocks.iter() {
                state.blocks.push(*block);
            }

            state.poll_count += 1;
            if state.poll_count >= POLL_LIMIT {
                state.timer_id.take();
            }
        })
    };

    // Clear the blocks and poll count when starting a new watch
    STATE.with_borrow_mut(|state| {
        state.blocks.clear();
        state.poll_count = 0;
    });

    // Initialize the poller and start watching
    // `with_limit` (optional) is used to limit the number of times to poll, defaults to 3
    // `with_poll_interval` (optional) is used to set the interval between polls, defaults to 7 seconds
    let poller = provider.watch_blocks().await.unwrap();
    let timer_id = poller
        .with_limit(Some(POLL_LIMIT))
        .with_poll_interval(Duration::from_secs(10))
        .start(callback)
        .unwrap();

    // Save timer id to be able to stop watch before completion
    STATE.with_borrow_mut(|state| {
        state.timer_id = Some(timer_id);
    });

    Ok(format!(
        "Watching for blocks, polling {} times.",
        POLL_LIMIT
    ))
}

/// Stop the watch before it reaches completion
#[ic_cdk::update]
async fn watch_blocks_stop() -> Result<String, String> {
    STATE.with_borrow_mut(|state| {
        if let Some(timer_id) = state.timer_id.take() {
            ic_cdk_timers::clear_timer(timer_id);
            Ok(())
        } else {
            Err("No timer to clear.".to_string())
        }
    })?;

    Ok("Watching for blocks stopped.".to_string())
}

/// Returns a boolean that is `true` when watching and `false` otherwise.
#[ic_cdk::query]
async fn watch_blocks_is_polling() -> Result<bool, String> {
    STATE.with_borrow(|state| Ok(state.timer_id.is_some()))
}

/// Returns the number of polls made. Polls finish automatically, once the `POLL_LIMIT`
/// has been reached. This count is used to create a good interactive UI experience.
#[ic_cdk::query]
async fn watch_blocks_poll_count() -> Result<usize, String> {
    STATE.with_borrow(|state| Ok(state.poll_count))
}

/// Returns the list of blocks returned by the watch. Gets reset on each start.
#[ic_cdk::query]
async fn watch_blocks_get() -> Result<Vec<String>, String> {
    STATE.with_borrow(|state| Ok(state.blocks.iter().map(|b| format!("{}", b)).collect()))
}
