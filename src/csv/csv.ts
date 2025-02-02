 
// Get json data from https://api.koinly.io/api/transactions?per_page=10&order=date

import { KoinlyType } from '../enum/koinly-type.enum';
import { KoinlyTransaction } from '../model/transaction.model';
import { Header } from '../type/header.type';
import { ValueGetterAbstractFactory } from '../factory/value-getter.abstract.factory';
import { Validator } from '../validator/validator';
 

export function createCsv(
        txns: any[], 
        headers: Header[],
        valueGetterFactory: ValueGetterAbstractFactory,
        validator: Validator
    ) {

    txns.forEach(txn => {
        if (txn.type == KoinlyType.CRYPTO_DEPOSIT) {
            if (!validator.isValidDeposit(txn, valueGetterFactory)) {
                throw "Receive/deposit transactions: " +
                "Should have empty values for the sent quantity and sent currency " +
                "Received Quantity should *NOT* include fees "
            }
        }
        if (txn.type == KoinlyType.CRYPTO_WITHDRAWAL) {
            if (!validator.isValidWithdrawal(txn, valueGetterFactory)) {
                "Send/withdrawal transactions: " +
                    "Should have empty values for the received quantity and received currency " +
                    "Sent Quantity should include fees ";
            }
        }
        if (txn.type == KoinlyType.EXCHANGE) {
            if (!validator.isValidExchange(txn, valueGetterFactory)) {
                    throw "Trade transactions: " +
                    "Should have values for the received quantity, received currency, sent quantity, and sent currency"
                }    
        }
    })

    const txnsCsvLines = parseTrans(txns, valueGetterFactory, headers)
    return [
        [...headers].join(","),
         ...txnsCsvLines
        ].join("\n")
}

export function parseTrans(transactions: KoinlyTransaction[], headerGetters: ValueGetterAbstractFactory, orderedHeaders: Header[]): any[]{
    return transactions
        .filter(t => !t.ignored)
        .sort((t1, t2) => {
            return +new Date(t1.date) - +new Date(t2.date);
        })
        .map(t => 
            orderedHeaders.map(header => headerGetters.get(header))
                .filter(g => !!g)
                .map(g => g!(t))
                .join(",")
            )
}