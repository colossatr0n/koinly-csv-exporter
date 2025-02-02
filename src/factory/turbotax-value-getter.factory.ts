import { KoinlyLabel } from "../enum/koinly-label.enum"
import { KoinlyType } from "../enum/koinly-type.enum"
import { OptionalHeader } from "../enum/optional-header.enum"
import { TurboTaxHeader } from "../enum/turbotax-header.enum"
import { KoinlyTransaction } from "../model/transaction.model"
import { Header } from "../type/header.type"
import { ValueGetter } from "../type/value-getter.type"
import { TurboTaxLabelFactory } from "./turbotax-label.factory"
import { TurboTaxTypeFactory } from "./turbotax-type.factory"
import { ValueGetterAbstractFactory } from "./value-getter.abstract.factory"

export class TurboTaxValueGetterFactory implements ValueGetterAbstractFactory {

    private turboTaxLabelFactory: TurboTaxLabelFactory
    private turboTaxTypeFactory: TurboTaxTypeFactory

    constructor(
        turboTaxLabelFactory: TurboTaxLabelFactory = new TurboTaxLabelFactory(),
        turboTaxTypeFactory: TurboTaxTypeFactory = new TurboTaxTypeFactory(),
    ) {
        this.turboTaxLabelFactory = turboTaxLabelFactory
        this.turboTaxTypeFactory = turboTaxTypeFactory
    }

    get(header: Header): ValueGetter {
        switch (header) {
            case TurboTaxHeader.DATE:
                return (t: KoinlyTransaction) => {
                    const time = t.date.split("T")[1].slice(0, 8) // hh:mm:ss
                    const date = t.date.split("T")[0] // YYYY-MM-dd
                    const year = date.slice(0, 4) //YYYY
                    const month = date.slice(5, 7) // MM
                    const day = date.slice(8, 10) // dd
                    // format is YYYY/MM/dd hh:mm:ss
                    return `${year}/${month}/${day} ${time}`
                }
            case TurboTaxHeader.RECEIVED_AMOUNT:
                return (t: KoinlyTransaction) => t.to?.amount
            case TurboTaxHeader.RECEIVED_ASSET:
                return (t: KoinlyTransaction) => t.to?.currency.symbol
            case TurboTaxHeader.SENT_AMOUNT:
                return (t: KoinlyTransaction) => t.from?.amount
            case TurboTaxHeader.SENT_ASSET:
                return (t: KoinlyTransaction) => t.from?.currency.symbol
            case TurboTaxHeader.FEE_AMOUNT:
                return (t: KoinlyTransaction) => t.fee?.amount
            case TurboTaxHeader.FEE_ASSET:
                return (t: KoinlyTransaction) => t.fee?.currency.symbol
            case TurboTaxHeader.TRANSACTION_ID:
                return (t: KoinlyTransaction) => {
                    return t.id //TODO not sure on this one
                }
            case TurboTaxHeader.TRANSACTION_HASH:
                return (t: KoinlyTransaction) => t.txhash
            case TurboTaxHeader.DESCRIPTION:
                return (t: KoinlyTransaction) => {
                    if (t.description != null) {
                        return t.description
                    }
                    if (t.to?.wallet?.pool == true || t.from?.wallet?.pool == true) {
                        return "Pool or trading bot."
                    }
                }
            case TurboTaxHeader.TYPE:
                return (t: KoinlyTransaction) => {
                    const val1 = this.turboTaxLabelFactory.get(t.label as KoinlyLabel)
                    const val2 = this.turboTaxTypeFactory.get(t.type as KoinlyType)
                    if (val1) {
                        return val1;
                    }
                    if (val2) {
                        return val2;
                    }
                    throw `Unknown KoinlyType "${t.type}"`
                }
            case TurboTaxHeader.MARKET_VALUE_CURRENCY:
                return (t: KoinlyTransaction) => {
                    // const sale = TurboTaxTypeByKoinlyLabel.get(t.label as KoinlyLabel)
                    // const buy = TurboTaxTypeByKoinlyType.get(t.type as KoinlyType) 
                    // if (sale == TurboTaxType.SALE 
                    //  || buy == TurboTaxType.BUY 
                    //  || (t.type == KoinlyType.CRYPTO_DEPOSIT && t.label == KoinlyLabel.STAKING)
                    //  || t.type == KoinlyType.EXCHANGE) {
                    //     return "USD";
                    // }
                    if (this.get(TurboTaxHeader.MARKET_VALUE)?.(t)) {
                        return "USD"
                    }
                }
            case TurboTaxHeader.MARKET_VALUE:
                return (t: KoinlyTransaction) => {
                    // TODO not sure on this one. See for more details: https://ttlc.intuit.com/turbotax-support/en-us/help-article/cryptocurrency/create-csv-file-unsupported-source/L1yhp71Nt_US_en_US
                    // TurboTax will calculate this automatically if left blank
                    // if (t.type == KoinlyType.BUY) {
                    //     return t.to?.cost_basis
                    // }
                    // if (t.type == KoinlyType.SELL) {
                    //     return t.net_value
                    // }
                    // if (t.type == KoinlyType.CRYPTO_DEPOSIT && t.label == KoinlyLabel.STAKING
                    //  || t.type == KoinlyType.EXCHANGE) {
                    //     return t.to?.cost_basis
                    // }
                    // else if (t.type == KoinlyType.CRYPTO_DEPOSIT && t.label == null) {
                    //     return t.to?.cost_basis 
                    // }
                }
            case OptionalHeader.RECEIVER_WALLET:
                return (t: KoinlyTransaction) => t.to?.wallet?.name
            case OptionalHeader.SENDER_WALLET:
                return (t: KoinlyTransaction) => t.from?.wallet?.name
            case OptionalHeader.RECEIVER_COST_BASIS:
                return (t: KoinlyTransaction) => t.to?.cost_basis
            case OptionalHeader.SENDER_COST_BASIS:
                return (t: KoinlyTransaction) => t.from?.cost_basis
            case OptionalHeader.GAIN:
                return (t: KoinlyTransaction) => t.gain
            default:
                return (t: KoinlyTransaction) => undefined
        }
    }
}
