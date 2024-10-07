use std::{cell::RefCell, time::Duration};

use crate::get_rpc_service;
use alloy::{
    primitives::FixedBytes,
    providers::{Provider, ProviderBuilder},
    transports::icp::IcpConfig,
};
use ic_cdk_timers::TimerId;

const POLL_LIMIT: usize = 10;

thread_local! {
    // Store the id of the IC_CDK timer used for polling the EVM RPC periodically.
    // This id can be used to cancel the timer before the configured `POLL_LIMIT`
    // has been reached.
    static TIMER_ID:  RefCell<Option<TimerId>> = const { RefCell::new(None) };

    // The block hashes returned by the EVM are stored here for display in the frontend.
    static BLOCKS: RefCell<Vec<FixedBytes<32>>> = const { RefCell::new(Vec::new()) };

    // The number of polls made. Polls finish automatically, once the `POLL_LIMIT`
    // has been reached. This count is used to create a good interactive UI experience.
    static POLL_COUNT : RefCell<usize> = const { RefCell::new(0) };
}

/// Using the ICP poller for Alloy allows smart contract canisters
/// to watch EVM blockchain changes easily. In this example, the canister
/// watches for new created blocks.
#[ic_cdk::update]
async fn watch_blocks_start() -> Result<String, String> {
    // Don't start a timer if one is already running
    TIMER_ID.with(|timer_id_cell| {
        if timer_id_cell.borrow().is_some() {
            return Err("Already watching for blocks.".to_string());
        }
        Ok(())
    })?;

    let rpc_service = get_rpc_service();
    let config = IcpConfig::new(rpc_service);
    let provider = ProviderBuilder::new().on_icp(config);

    // This callback will be called every time new blocks are received
    let callback = |incoming_blocks: Vec<FixedBytes<32>>| {
        BLOCKS.with_borrow_mut(|blocks| {
            for block in incoming_blocks.iter() {
                ic_cdk::println!("incoming block: {:?}", block);
                blocks.push(*block);
            }

            POLL_COUNT.with_borrow_mut(|poll_count| {
                *poll_count += 1;
                if *poll_count >= POLL_LIMIT {
                    ic_cdk::println!("CLEARING timer");
                    TIMER_ID.with_borrow_mut(|timer_id_cell| {
                        timer_id_cell.take();
                    });
                }
            });
        })
    };

    // Clear the blocks and poll count when starting a new watch
    BLOCKS.with_borrow_mut(|blocks| {
        blocks.clear();
    });
    POLL_COUNT.with_borrow_mut(|poll_count| {
        *poll_count = 0;
    });

    // Initialize the poller and start watching
    // `with_limit` (optional) is used to limit the number of blocks to poll, defaults to 3
    // `with_poll_interval` (optional) is used to set the interval between polls, defaults to 7 seconds
    let poller = provider.watch_blocks().await.unwrap();
    let timer_id = poller
        .with_limit(Some(POLL_LIMIT))
        .with_poll_interval(Duration::from_secs(10))
        .start(callback)
        .unwrap();

    // Save timer id to be able to stop watch before completion
    TIMER_ID.with_borrow_mut(|timer_id_cell| {
        *timer_id_cell = Some(timer_id);
    });

    Ok(format!(
        "Watching for blocks, polling {} times.",
        POLL_LIMIT
    ))
}

/// Stop the watch before it reaches completion
#[ic_cdk::update]
async fn watch_blocks_stop() -> Result<String, String> {
    TIMER_ID.with_borrow_mut(|timer_id_cell| {
        if let Some(timer_id) = timer_id_cell.take() {
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
    TIMER_ID.with_borrow(|timer_id_cell| Ok(timer_id_cell.is_some()))
}

/// Returns the number of polls made. Polls finish automatically, once the `POLL_LIMIT`
/// has been reached. This count is used to create a good interactive UI experience.
#[ic_cdk::query]
async fn watch_blocks_poll_count() -> Result<usize, String> {
    POLL_COUNT.with_borrow(|poll_count| Ok(*poll_count))
}

/// Returns the list of blocks returned by the watch. Gets reset on each start.
#[ic_cdk::query]
async fn watch_blocks_get() -> Result<Vec<String>, String> {
    BLOCKS.with(|blocks| {
        let blocks = blocks.borrow();
        Ok(blocks.iter().map(|b| format!("{}", b)).collect())
    })
}
