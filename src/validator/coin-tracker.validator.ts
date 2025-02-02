import { CoinTrackerHeader } from "../enum/cointracker-header.enum"
import { ValueGetterAbstractFactory } from "../factory/value-getter.abstract.factory"
import { KoinlyTransaction } from "../model/transaction.model"
import { Validator } from "./validator"

export class CoinTrackerValidator implements Validator {
    public isValidExchange(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory) {
        return valueGetterFactory.get(CoinTrackerHeader.SENT_QUANTITY)!(tran)
            && valueGetterFactory.get(CoinTrackerHeader.SENT_CURRENCY)!(tran)
            && valueGetterFactory.get(CoinTrackerHeader.RECEIVED_QUANTITY)!(tran)
            && valueGetterFactory.get(CoinTrackerHeader.RECEIVED_CURRENCY)!(tran)
    }

    public isValidDeposit(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory) {
        return !(valueGetterFactory.get(CoinTrackerHeader.SENT_QUANTITY)!(tran)
            || valueGetterFactory.get(CoinTrackerHeader.SENT_CURRENCY)!(tran)
            || valueGetterFactory.get(CoinTrackerHeader.FEE_AMOUNT)!(tran))
    }

    public isValidWithdrawal(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory) {
        return !(valueGetterFactory.get(CoinTrackerHeader.RECEIVED_QUANTITY)!(tran)
            || valueGetterFactory.get(CoinTrackerHeader.RECEIVED_CURRENCY)!(tran)
            || valueGetterFactory.get(CoinTrackerHeader.FEE_AMOUNT)!(tran))
    }
}