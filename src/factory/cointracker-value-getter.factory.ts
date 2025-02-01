import { CoinTrackerHeader } from "../enum/cointracker-header.enum"
import { KoinlyLabel } from "../enum/koinly-label.enum"
import { OptionalHeader } from "../enum/optional-header.enum"
import { KoinlyTransaction } from "../model/transaction.model"
import { ValueGetter } from "../type/value-getter.type"
import { CoinTrackerLabelFactory } from "./cointracker-label-factory"
import { ValueGetterAbstractFactory } from "./value-getter.abstract.factory"

export class CoinTrackerValueGetterFactory implements ValueGetterAbstractFactory<CoinTrackerHeader | OptionalHeader> {

    private coinTrackerLabelFactory: CoinTrackerLabelFactory;

    constructor(
        coinTrackerLabelFactory: CoinTrackerLabelFactory = new CoinTrackerLabelFactory()
    ) {
        this.coinTrackerLabelFactory = coinTrackerLabelFactory
    }

    get(header: CoinTrackerHeader | OptionalHeader): ValueGetter {
        switch (header) {
            case CoinTrackerHeader.DATE: { 
                return (t: KoinlyTransaction) => {
                    const time = t.date.split("T")[1].slice(0, 8) // hh:mm:ss
                    const date = t.date.split("T")[0] // YYYY-MM-dd
                    const year = date.slice(0, 4) //YYYY
                    const month = date.slice(5, 7) // MM
                    const day = date.slice(8, 10) // dd
                    // format is MM/dd/YYYY hh:mm:ss
                    return `${month}/${day}/${year} ${time}`
                }
            }
            case CoinTrackerHeader.RECEIVED_QUANTITY: return (t: KoinlyTransaction) => t.to?.amount
            case CoinTrackerHeader.RECEIVED_CURRENCY: return (t: KoinlyTransaction) => t.to?.currency.symbol
            case CoinTrackerHeader.SENT_QUANTITY: return (t: KoinlyTransaction) => t.from?.amount
            case CoinTrackerHeader.SENT_CURRENCY: return (t: KoinlyTransaction) => t.from?.currency.symbol
            case CoinTrackerHeader.FEE_AMOUNT: return (t: KoinlyTransaction) => t.fee?.amount
            case CoinTrackerHeader.FEE_CURRENCY: return (t: KoinlyTransaction) => t.fee?.currency.symbol
            case CoinTrackerHeader.TAG: return (t: KoinlyTransaction) => this.coinTrackerLabelFactory.get(t.label as KoinlyLabel)
            // Optional
            case OptionalHeader.TYPE: return (t: KoinlyTransaction) => t.type
            case OptionalHeader.LABEL: return (t: KoinlyTransaction) => t.label
            case OptionalHeader.RECEIVER_WALLET: return (t: KoinlyTransaction) => t.to?.wallet.name
            case OptionalHeader.SENDER_WALLET: return (t: KoinlyTransaction) => t.from?.wallet.name
            case OptionalHeader.RECEIVER_COST_BASIS: return (t: KoinlyTransaction) => t.to?.cost_basis
            case OptionalHeader.SENDER_COST_BASIS: return (t: KoinlyTransaction) => t.from?.cost_basis
            case OptionalHeader.GAIN: return (t: KoinlyTransaction) => t.gain
            case OptionalHeader.DESCRIPTION: return (t: KoinlyTransaction) => t.description
            default: return (t: KoinlyTransaction) => undefined
        }
    }
}
