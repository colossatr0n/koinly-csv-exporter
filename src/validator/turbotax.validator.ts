import { TurboTaxHeader } from "../enum/turbotax-header.enum"
import { ValueGetterAbstractFactory } from "../factory/value-getter.abstract.factory"
import { KoinlyTransaction } from "../model/transaction.model"
import { Validator } from "./validator"

export class TurboTaxValidator implements Validator {
    public isValidExchange(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory) {
        return valueGetterFactory.get(TurboTaxHeader.SENT_AMOUNT)!(tran)
            && valueGetterFactory.get(TurboTaxHeader.SENT_ASSET)!(tran)
            && valueGetterFactory.get(TurboTaxHeader.RECEIVED_AMOUNT)!(tran)
            && valueGetterFactory.get(TurboTaxHeader.RECEIVED_ASSET)!(tran)
    }

    public isValidDeposit(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory) {
        return !(valueGetterFactory.get(TurboTaxHeader.SENT_AMOUNT)!(tran)
            || valueGetterFactory.get(TurboTaxHeader.SENT_ASSET)!(tran)
            || valueGetterFactory.get(TurboTaxHeader.FEE_AMOUNT)!(tran))
    }

    public isValidWithdrawal(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory) {
        return !(valueGetterFactory.get(TurboTaxHeader.RECEIVED_AMOUNT)!(tran)
            || valueGetterFactory.get(TurboTaxHeader.RECEIVED_ASSET)!(tran)
            || valueGetterFactory.get(TurboTaxHeader.FEE_AMOUNT)!(tran))
    }
}