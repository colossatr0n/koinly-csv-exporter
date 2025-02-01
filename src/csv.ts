 
// Get json data from https://api.koinly.io/api/transactions?per_page=10&order=date

import { KoinlyType } from './enum/koinly-type.enum';
import { KoinlyTransaction } from './model/transaction.model';
import { Header } from './type/header.type';
import { ValueGetterAbstractFactory } from './factory/value-getter.abstract.factory';
import { Validator } from './validator/validator';
 

export function createCsv<T extends Header>(
        pages: any[], 
        headers: Header[],
        valueGetterFactory: ValueGetterAbstractFactory<T>,
        validator: Validator
    ) {
    const trans = pages

    trans.forEach(tran => {
        if (tran.type == KoinlyType.CRYPTO_DEPOSIT) {
            if (!validator.isValidDeposit(tran, valueGetterFactory)) {
                throw "Receive/deposit transactions: " +
                "Should have empty values for the sent quantity and sent currency " +
                "Received Quantity should *NOT* include fees "
            }
        }
        if (tran.type == KoinlyType.CRYPTO_WITHDRAWAL) {
            if (!validator.isValidWithdrawal(tran, valueGetterFactory)) {
                "Send/withdrawal transactions: " +
                    "Should have empty values for the received quantity and received currency " +
                    "Sent Quantity should include fees ";
            }
        }
        if (tran.type == KoinlyType.EXCHANGE) {
            if (!validator.isValidExchange(tran, valueGetterFactory)) {
                    throw "Trade transactions: " +
                    "Should have values for the received quantity, received currency, sent quantity, and sent currency"
                }    
        }
    })

    const transCsvLines = parseTrans(trans, valueGetterFactory, headers)
    return [
        [...headers].join(","),
         ...transCsvLines
        ].join("\n")
}

export function parseTrans(transactions: KoinlyTransaction[], headerGetters: ValueGetterAbstractFactory<Header>, orderedHeaders: Header[]): any[]{
    return transactions
        .filter(t => !t.ignored)
        .map(t => 
            orderedHeaders.map(header => headerGetters.get(header))
                .filter(g => !!g)
                .map(g => g!(t))
                .join(",")
            )
}