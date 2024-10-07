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
    static TIMER_ID:  RefCell<Option<TimerId>> = const { RefCell::new(None) };
    static BLOCKS: RefCell<Vec<FixedBytes<32>>> = const { RefCell::new(Vec::new()) };
    static POLL_COUNT : RefCell<usize> = const { RefCell::new(0) };
}

#[ic_cdk::update]
async fn watch_blocks_start() -> Result<String, String> {
    TIMER_ID.with(|timer_id_cell| {
        if timer_id_cell.borrow().is_some() {
            return Err("Already watching for blocks.".to_string());
        }
        Ok(())
    })?;

    let rpc_service = get_rpc_service();
    let config = IcpConfig::new(rpc_service);
    let provider = ProviderBuilder::new().on_icp(config);
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
    BLOCKS.with_borrow_mut(|blocks| {
        blocks.clear();
    });
    POLL_COUNT.with_borrow_mut(|poll_count| {
        *poll_count = 0;
    });
    let poller = provider.watch_blocks().await.unwrap();
    let timer_id = poller
        .with_limit(Some(POLL_LIMIT))
        .with_poll_interval(Duration::from_secs(10))
        .start(callback)
        .unwrap();

    TIMER_ID.with_borrow_mut(|timer_id_cell| {
        *timer_id_cell = Some(timer_id);
    });

    Ok(format!(
        "Watching for blocks, polling {} times.",
        POLL_LIMIT
    ))
}

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

#[ic_cdk::query]
async fn watch_blocks_is_polling() -> Result<bool, String> {
    TIMER_ID.with(|timer_id_cell| Ok(timer_id_cell.borrow().is_some()))
}

#[ic_cdk::query]
async fn watch_blocks_get() -> Result<Vec<String>, String> {
    BLOCKS.with(|blocks| {
        let blocks = blocks.borrow();
        Ok(blocks.iter().map(|b| format!("{}", b)).collect())
    })
}
