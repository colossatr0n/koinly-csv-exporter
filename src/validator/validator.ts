import { ValueGetterAbstractFactory } from "../factory/value-getter.abstract.factory"
import { KoinlyTransaction } from "../model/transaction.model"

export interface Validator {
    isValidExchange(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory): boolean
    isValidDeposit(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory): boolean 
    isValidWithdrawal(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory): boolean
}