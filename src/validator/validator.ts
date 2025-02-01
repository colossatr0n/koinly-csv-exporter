import { ValueGetterAbstractFactory } from "../factory/value-getter.abstract.factory"
import { KoinlyTransaction } from "../model/transaction.model"
import { Header } from "../type/header.type"

export interface Validator {
    isValidExchange(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory<Header>): boolean
    isValidDeposit(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory<Header>): boolean 
    isValidWithdrawal(tran: KoinlyTransaction, valueGetterFactory: ValueGetterAbstractFactory<Header>): boolean
}