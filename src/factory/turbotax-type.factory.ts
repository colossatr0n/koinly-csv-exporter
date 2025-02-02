import { KoinlyType } from "../enum/koinly-type.enum"
import { TurboTaxType } from "../enum/turbotax-type.enum"

export class TurboTaxTypeFactory {
    constructor(){}

    get(label: KoinlyType): TurboTaxType | undefined {
        switch (label) {
            case KoinlyType.CRYPTO_WITHDRAWAL:
                return TurboTaxType.WITHDRAWAL
            case KoinlyType.CRYPTO_DEPOSIT:
                return TurboTaxType.DEPOSIT
            case KoinlyType.DEPOSIT:
                return TurboTaxType.DEPOSIT
            case KoinlyType.WITHDRAWAL:
                return TurboTaxType.WITHDRAWAL
            case KoinlyType.EXCHANGE:
                return TurboTaxType.CONVERT
            case KoinlyType.TRANSFER:
                return TurboTaxType.TRANSFER
            case KoinlyType.BUY:
                return TurboTaxType.BUY
            case KoinlyType.SELL:
                return TurboTaxType.SALE
        }
    }
}