import { KoinlyLabel } from "../enum/koinly-label.enum"
import { TurboTaxType } from "../enum/turbotax-type.enum"

export class TurboTaxLabelFactory {
    constructor(){}

    get(label: KoinlyLabel): TurboTaxType | undefined {
        switch (label) {
            case KoinlyLabel.MARGIN_INTEREST_FEE:
                return TurboTaxType.EXPENSE
            case KoinlyLabel.MARGIN_TRADE_FEE:
                return TurboTaxType.EXPENSE
            case KoinlyLabel.COST: // TODO this could also be a fee. See https://help.koinly.io/en/articles/3661665-transactions-in-koinly-explained
                return TurboTaxType.SALE
            case KoinlyLabel.LOAN_INTEREST:
                return TurboTaxType.INTEREST
            case KoinlyLabel.NO_LABEL:
                return TurboTaxType.OTHER
            case KoinlyLabel.OTHER_INCOME:
                return TurboTaxType.INCOME
            case KoinlyLabel.FORK:
                return TurboTaxType.FORKING
            case KoinlyLabel.AIRDROP:
                return TurboTaxType.AIRDROP
            case KoinlyLabel.MINING:
                return TurboTaxType.MINING
            case KoinlyLabel.STAKING:
                return TurboTaxType.STAKING
            default:
                return undefined
        }
    }
}