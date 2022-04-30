#!/usr/bin/env node
'use strict';
 
// Get json data from https://api.koinly.io/api/transactions?per_page=10&order=date

import { ArgumentParser } from 'argparse';
import { readFileSync, writeFileSync } from 'fs';
import { CoinTrackerTag } from './enum/coin-tracker-tag.enum';
import { KoinlyLabel } from './enum/koinly-label.enum';
import { KoinlyType } from './enum/koinly-type.enum';
import { Transaction } from './model/transaction.model';
 

const CoinTrackerTagByKoinlyLabel = new Map<KoinlyLabel, CoinTrackerTag>([
    [KoinlyLabel.GIFT, CoinTrackerTag.GIFT],
    [KoinlyLabel.LOST, CoinTrackerTag.LOST],
    [KoinlyLabel.FORK, CoinTrackerTag.FORK],
    [KoinlyLabel.AIRDROP, CoinTrackerTag.AIRDROP],
    [KoinlyLabel.MINING, CoinTrackerTag.MINED],
    [KoinlyLabel.STAKING, CoinTrackerTag.STAKED],
])

// Keep this in sync with Header
const ORDERED_REQ_HEADERS = [
    Header.DATE,
    Header.RECEIVED_QUANTITY,
    Header.RECEIVED_CURRENCY,
    Header.SENT_QUANTITY,
    Header.SENT_CURRENCY,
    Header.FEE_AMOUNT,
    Header.FEE_CURRENCY,
    Header.TAG,
]

// Keep this in sync with Header
const ORDERED_OPT_HEADERS = [
    Header.TYPE,
    Header.LABEL,
    Header.RECEIVER_WALLET,
    Header.SENDER_WALLET,
    Header.RECEIVER_COST_BASIS,
    Header.SENDER_COST_BASIS,
    Header.GAIN,
    Header.DESCRIPTION,
]

const ORDERED_ALL_HEADERS = [
    ...ORDERED_REQ_HEADERS,
    ...ORDERED_OPT_HEADERS
]

const HEADER_GETTERS = new Map<Header, ValueGetter>([
    [Header.DATE, (t: Transaction) => {
        const time = t.date.split("T")[1].slice(0, 8) // hh:mm:ss
        const date = t.date.split("T")[0] // YYYY-MM-dd
        const year = date.slice(0, 4) //YYYY
        const month = date.slice(5, 7) // MM
        const day = date.slice(8, 10) // dd
        // format is MM/dd/YYYY hh:mm:ss
        return `${month}/${day}/${year} ${time}`
    }],
    [Header.RECEIVED_QUANTITY, (t: Transaction) => t.to?.amount],
    [Header.RECEIVED_CURRENCY, (t: Transaction) => t.to?.currency.symbol],
    [Header.SENT_QUANTITY, (t: Transaction) => t.from?.amount],
    [Header.SENT_CURRENCY, (t: Transaction) => t.from?.currency.symbol],
    [Header.FEE_AMOUNT, (t: Transaction) => t.fee?.amount],
    [Header.FEE_CURRENCY, (t: Transaction) => t.fee?.currency.symbol],
    [Header.TAG, (t: Transaction) => CoinTrackerTagByKoinlyLabel.get(t.label as KoinlyLabel)],
    [Header.TYPE, (t: Transaction) => t.type],
    [Header.LABEL, (t: Transaction) => t.label],
    [Header.RECEIVER_WALLET, (t: Transaction) => t.to?.wallet.name],
    [Header.SENDER_WALLET, (t: Transaction) => t.from?.wallet.name],
    [Header.RECEIVER_COST_BASIS, (t: Transaction) => t.to?.cost_basis],
    [Header.SENDER_COST_BASIS, (t: Transaction) => t.from?.cost_basis],
    [Header.GAIN, (t: Transaction) => t.gain],
    [Header.DESCRIPTION, (t: Transaction) => t.description],
])

type ValueGetter = (t: Transaction) => any;

function parseTrans(transactions: Transaction[], headerGetters: Map<Header, ValueGetter>): any[]{
    return transactions
        .filter(t => !t.ignored)
        .map(t => 
            ORDERED_ALL_HEADERS.map(header => headerGetters.get(header))
                .filter(g => !!g)
                .map(g => g!(t))
                .join(",")
            )
}

function createCsv(pages: any[], headerGetters: Map<Header, ValueGetter>) {
    const headers = ORDERED_ALL_HEADERS.filter(header => !!headerGetters.get(header))
    const trans = pages.flatMap(page => page.transactions)

    trans.forEach(tran => {
        if (tran.type == KoinlyType.CRYPTO_DEPOSIT) {
            if (!isValidDeposit(tran)) {
                throw "Receive/deposit transactions: " +
                "Should have empty values for the sent quantity and sent currency " +
                "Received Quantity should *NOT* include fees "
            }
        }
        if (tran.type == KoinlyType.CRYPTO_WITHDRAWAL) {
            if (!isValidWithdrawal(tran)) {
                "Send/withdrawal transactions: " +
                    "Should have empty values for the received quantity and received currency " +
                    "Sent Quantity should include fees ";
            }
        }
        if (tran.type == KoinlyType.EXCHANGE) {
            if (!isValidExchange(tran)) {
                    throw "Trade transactions: " +
                    "Should have values for the received quantity, received currency, sent quantity, and sent currency"
                }    
        }
    })


    const transCsvLines = parseTrans(trans, headerGetters)
    return [
        [...headers].join(","),
         ...transCsvLines
        ].join("\n")
}

function isValidExchange(tran: Transaction) {
    return HEADER_GETTERS.get(Header.SENT_QUANTITY)!(tran)
        && HEADER_GETTERS.get(Header.SENT_CURRENCY)!(tran)
        && HEADER_GETTERS.get(Header.RECEIVED_QUANTITY)!(tran)
        && HEADER_GETTERS.get(Header.RECEIVED_CURRENCY)!(tran)
}

export function isValidDeposit(tran: Transaction) {
    return !(HEADER_GETTERS.get(Header.SENT_QUANTITY)!(tran)
        || HEADER_GETTERS.get(Header.SENT_CURRENCY)!(tran)
        || HEADER_GETTERS.get(Header.FEE_AMOUNT)!(tran))
}

export function isValidWithdrawal(tran: Transaction) {
    return !(HEADER_GETTERS.get(Header.RECEIVED_QUANTITY)!(tran)
        || HEADER_GETTERS.get(Header.RECEIVED_CURRENCY)!(tran)
        || HEADER_GETTERS.get(Header.FEE_AMOUNT)!(tran))
}

function main(args: any) {
    let pages = JSON.parse(readFileSync(args.pages, 'utf8').toString())
    let headerGetters: Map<Header, ValueGetter>;

    if (args.extra) {
        headerGetters = HEADER_GETTERS
    } else {
        headerGetters = new Map<Header, ValueGetter>(ORDERED_REQ_HEADERS.map(header => [header, HEADER_GETTERS.get(header)!]))
    }
    let csv = createCsv(pages, headerGetters)
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

let args = parser.parse_args()
main(args)
