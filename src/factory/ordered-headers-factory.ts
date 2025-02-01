import { CoinTrackerHeader } from "../enum/cointracker-header.enum"
import { OutputType } from "../enum/output-type.enum"
import { Header } from "../type/header.type"

export class OrderedHeadersFactory {

    // Keep this in sync with Header
    private static COIN_TRACKER_HEADERS = [
        CoinTrackerHeader.DATE,
        CoinTrackerHeader.RECEIVED_QUANTITY,
        CoinTrackerHeader.RECEIVED_CURRENCY,
        CoinTrackerHeader.SENT_QUANTITY,
        CoinTrackerHeader.SENT_CURRENCY,
        CoinTrackerHeader.FEE_AMOUNT,
        CoinTrackerHeader.FEE_CURRENCY,
        CoinTrackerHeader.TAG,
    ]

    static get(outputType: OutputType): Header[] {
        switch (outputType) {
            case OutputType.COIN_TRACKER:
                return OrderedHeadersFactory.COIN_TRACKER_HEADERS
        }
    }
}