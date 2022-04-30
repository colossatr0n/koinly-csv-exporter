import { CoinTrackerTag } from "../enum/coin-tracker-tag.enum"
import { CoinTrackerHeader } from "../enum/cointracker-header.enum"
import { KoinlyLabel } from "../enum/koinly-label.enum"
import { OptionalHeader } from "../enum/optional-header.enum"
import { Transaction } from "../model/transaction.model"
import { Header } from "../type/header.type"
import { ValueGetter } from "../type/value-getter.type"
import { ValueGetterAbstractFactory } from "./value-getter.abstract.factory"

export class KoinlyValueGetterFactory implements ValueGetterAbstractFactory<Transaction> {

    private coinTrackerTagByKoinlyLabel = new Map<KoinlyLabel, CoinTrackerTag>([
        [KoinlyLabel.GIFT, CoinTrackerTag.GIFT],
        [KoinlyLabel.LOST, CoinTrackerTag.LOST],
        [KoinlyLabel.FORK, CoinTrackerTag.FORK],
        [KoinlyLabel.AIRDROP, CoinTrackerTag.AIRDROP],
        [KoinlyLabel.MINING, CoinTrackerTag.MINED],
        [KoinlyLabel.STAKING, CoinTrackerTag.STAKED],
    ])

    constructor() {}

    get(header: Header): ValueGetter<Transaction> {
        switch (header) {
            case CoinTrackerHeader.DATE: { 
                return (t: Transaction) => {
                    const time = t.date.split("T")[1].slice(0, 8) // hh:mm:ss
                    const date = t.date.split("T")[0] // YYYY-MM-dd
                    const year = date.slice(0, 4) //YYYY
                    const month = date.slice(5, 7) // MM
                    const day = date.slice(8, 10) // dd
                    // format is MM/dd/YYYY hh:mm:ss
                    return `${month}/${day}/${year} ${time}`
                }
            }
            case CoinTrackerHeader.RECEIVED_QUANTITY: return (t: Transaction) => t.to?.amount
            case CoinTrackerHeader.RECEIVED_CURRENCY: return (t: Transaction) => t.to?.currency.symbol
            case CoinTrackerHeader.SENT_QUANTITY: return (t: Transaction) => t.from?.amount
            case CoinTrackerHeader.SENT_CURRENCY: return (t: Transaction) => t.from?.currency.symbol
            case CoinTrackerHeader.FEE_AMOUNT: return (t: Transaction) => t.fee?.amount
            case CoinTrackerHeader.FEE_CURRENCY: return (t: Transaction) => t.fee?.currency.symbol
            case CoinTrackerHeader.TAG: return (t: Transaction) => this.coinTrackerTagByKoinlyLabel.get(t.label as KoinlyLabel)
            // Optional
            case OptionalHeader.TYPE: return (t: Transaction) => t.type
            case OptionalHeader.LABEL: return (t: Transaction) => t.label
            case OptionalHeader.RECEIVER_WALLET: return (t: Transaction) => t.to?.wallet.name
            case OptionalHeader.SENDER_WALLET: return (t: Transaction) => t.from?.wallet.name
            case OptionalHeader.RECEIVER_COST_BASIS: return (t: Transaction) => t.to?.cost_basis
            case OptionalHeader.SENDER_COST_BASIS: return (t: Transaction) => t.from?.cost_basis
            case OptionalHeader.GAIN: return (t: Transaction) => t.gain
            case OptionalHeader.DESCRIPTION: return (t: Transaction) => t.description
            default: return (t: Transaction) => undefined
        }
    }
}

