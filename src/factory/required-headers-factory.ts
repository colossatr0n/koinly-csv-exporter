import { CoinTrackerHeader } from "../enum/cointracker-header.enum"
import { OptionalHeader } from "../enum/optional-header.enum"
import { OutputType } from "../enum/output-type.enum"
import { TurboTaxHeader } from "../enum/turbotax-header.enum"

export class RequiredHeadersFactory {

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
    
    private static TURBO_TAX_HEADERS = [
        TurboTaxHeader.DATE,
        TurboTaxHeader.TYPE,
        TurboTaxHeader.SENT_ASSET,
        TurboTaxHeader.SENT_AMOUNT,
        TurboTaxHeader.RECEIVED_ASSET,
        TurboTaxHeader.RECEIVED_AMOUNT,
        TurboTaxHeader.FEE_ASSET,
        TurboTaxHeader.FEE_AMOUNT,
        TurboTaxHeader.MARKET_VALUE_CURRENCY,
        TurboTaxHeader.MARKET_VALUE,
        TurboTaxHeader.DESCRIPTION,
        TurboTaxHeader.TRANSACTION_HASH,
        TurboTaxHeader.TRANSACTION_ID,
    ]

    constructor(){}

    get(outputType: OutputType): (CoinTrackerHeader | TurboTaxHeader | OptionalHeader)[] {
        switch (outputType) {
            case OutputType.COIN_TRACKER:
                return RequiredHeadersFactory.COIN_TRACKER_HEADERS
            case OutputType.TURBO_TAX:
                return RequiredHeadersFactory.TURBO_TAX_HEADERS
        }
    }
}