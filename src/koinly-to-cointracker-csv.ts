 
// Get json data from https://api.koinly.io/api/transactions?per_page=10&order=date

import { ArgumentParser } from 'argparse';
import { readFileSync, writeFileSync } from 'fs';
import { CoinTrackerTag } from './enum/coin-tracker-tag.enum';
import { CoinTrackerHeader } from './enum/cointracker-header.enum';
import { InputSourceType } from './enum/input-source.enum';
import { KoinlyLabel } from './enum/koinly-label.enum';
import { KoinlyType } from './enum/koinly-type.enum';
import { OptionalHeader } from './enum/optional-header.enum';
import { InputSourceFactory } from './factory/input-source.factory';
import { KoinlyValueGetterFactory } from './factory/koinly-value-getter.factory';
import { KoinlyInputSource } from './koinly-input-source';
import { Transaction } from './model/transaction.model';
import { Header } from './type/header.type';
import { ValueGetterAbstractFactory } from './factory/value-getter.abstract.factory';
import { ValueGetterFactoryProvider } from './factory/value-getter.factory.provider';
 

// Keep this in sync with Header
const ORDERED_REQ_HEADERS = [
    CoinTrackerHeader.DATE,
    CoinTrackerHeader.RECEIVED_QUANTITY,
    CoinTrackerHeader.RECEIVED_CURRENCY,
    CoinTrackerHeader.SENT_QUANTITY,
    CoinTrackerHeader.SENT_CURRENCY,
    CoinTrackerHeader.FEE_AMOUNT,
    CoinTrackerHeader.FEE_CURRENCY,
    CoinTrackerHeader.TAG,
]

// Keep this in sync with Header
const ORDERED_OPT_HEADERS = [
    OptionalHeader.TYPE,
    OptionalHeader.LABEL,
    OptionalHeader.RECEIVER_WALLET,
    OptionalHeader.SENDER_WALLET,
    OptionalHeader.RECEIVER_COST_BASIS,
    OptionalHeader.SENDER_COST_BASIS,
    OptionalHeader.GAIN,
    OptionalHeader.DESCRIPTION,
]

const ORDERED_ALL_HEADERS = [
    ...ORDERED_REQ_HEADERS,
    ...ORDERED_OPT_HEADERS
]

function parseTrans(transactions: Transaction[], headerGetters: ValueGetterAbstractFactory<Transaction>): any[]{
    return transactions
        .filter(t => !t.ignored)
        .map(t => 
            ORDERED_ALL_HEADERS.map(header => headerGetters.get(header))
                .filter(g => !!g)
                .map(g => g!(t))
                .join(",")
            )
}

function createCsv(pages: any[], headers: Header[], valueGetterFactory: ValueGetterAbstractFactory<Transaction>) {
    const trans = pages.flatMap(page => page.transactions)

    trans.forEach(tran => {
        if (tran.type == KoinlyType.CRYPTO_DEPOSIT) {
            if (!isValidDeposit(tran, valueGetterFactory)) {
                throw "Receive/deposit transactions: " +
                "Should have empty values for the sent quantity and sent currency " +
                "Received Quantity should *NOT* include fees "
            }
        }
        if (tran.type == KoinlyType.CRYPTO_WITHDRAWAL) {
            if (!isValidWithdrawal(tran, valueGetterFactory)) {
                "Send/withdrawal transactions: " +
                    "Should have empty values for the received quantity and received currency " +
                    "Sent Quantity should include fees ";
            }
        }
        if (tran.type == KoinlyType.EXCHANGE) {
            if (!isValidExchange(tran, valueGetterFactory)) {
                    throw "Trade transactions: " +
                    "Should have values for the received quantity, received currency, sent quantity, and sent currency"
                }    
        }
    })

    const transCsvLines = parseTrans(trans, valueGetterFactory)
    return [
        [...headers].join(","),
         ...transCsvLines
        ].join("\n")
}

function isValidExchange(tran: Transaction, valueGetterFactory: ValueGetterAbstractFactory) {
    return valueGetterFactory.get(CoinTrackerHeader.SENT_QUANTITY)!(tran)
        && valueGetterFactory.get(CoinTrackerHeader.SENT_CURRENCY)!(tran)
        && valueGetterFactory.get(CoinTrackerHeader.RECEIVED_QUANTITY)!(tran)
        && valueGetterFactory.get(CoinTrackerHeader.RECEIVED_CURRENCY)!(tran)
}

export function isValidDeposit(tran: Transaction, valueGetterFactory: ValueGetterAbstractFactory) {
    return !(valueGetterFactory.get(CoinTrackerHeader.SENT_QUANTITY)!(tran)
        || valueGetterFactory.get(CoinTrackerHeader.SENT_CURRENCY)!(tran)
        || valueGetterFactory.get(CoinTrackerHeader.FEE_AMOUNT)!(tran))
}

export function isValidWithdrawal(tran: Transaction, valueGetterFactory: ValueGetterAbstractFactory) {
    return !(valueGetterFactory.get(CoinTrackerHeader.RECEIVED_QUANTITY)!(tran)
        || valueGetterFactory.get(CoinTrackerHeader.RECEIVED_CURRENCY)!(tran)
        || valueGetterFactory.get(CoinTrackerHeader.FEE_AMOUNT)!(tran))
}

function main(args: any) {
    const inputSourceFactory = new InputSourceFactory(
        new KoinlyInputSource(
            new KoinlyValueGetterFactory()
        )
    );

    const inputSource = inputSourceFactory.get(InputSourceType[args.type as keyof typeof InputSourceType])

    let pages = inputSource.read(args.pages)
    let headers: Header[]

    if (args.extra) {
        headers = ORDERED_ALL_HEADERS
    } else {
        headers = ORDERED_REQ_HEADERS
    }
    let csv = createCsv(pages, headers, inputSource.getValueGetterFactory())
    if (args.output) { 
        writeFileSync(args.output, csv)
    }
}

const parser = new ArgumentParser({
  description: 'Convert koinly to cointracker csv.'
});
 
parser.add_argument("pages")
parser.add_argument("-o", "--output", { help: "Name of output file" })
parser.add_argument("-x", "--extra", { action: "store_true", help: "Output extra information into csv. This will break Cointracker functionality." })
parser.add_argument("-t", "--type", { choices: Object.keys(InputSourceType).map(k => k as InputSourceType), required: true, type: "str", help: "Specify input source, e.g., koinly" })

let args = parser.parse_args()
main(args)
