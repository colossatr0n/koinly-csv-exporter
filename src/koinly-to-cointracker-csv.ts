#!/usr/bin/env node
'use strict';
 
import { ArgumentParser } from 'argparse';
import { readFileSync, writeFileSync } from 'fs';
 

interface Transaction {
    type: String
    from: Data
    to: Data
    fee: Data
    label: String
    date: Date
    ignored: boolean
}

interface Data {
    amount: String
    currency: Currency
    wallet: Wallet
}

interface Wallet {
    name: String
}

interface Currency {
    symbol: String
}

enum KoinlyType {
    CRYPTO_WITHDRAWAL = "crypto_withdrawal",
    CRYPTO_DEPOSIT = "crypto_deposit",
    EXCHANGE = "exchange",
    TRANSFER = "transfer",
}

enum CoinTrackerTag {
    // send transactions
    GIFT = "gift",
    LOST = "lost",
    DONATION = "donation",

    // receive transactions
    FORK = "fork",
    AIRDROP = "airdrop",
    MINED = "mined",
    PAYMENT = "payment",
    STAKED = "staked"

    // trades and transfers cannot have tagged values
}

enum KoinlyLabel {
    AIRDROP = "airdrop",
    FORK = "fork",
    MINING = "mining",
    STAKING = "staking",
    LOAN_INTEREST = "loan_interest",
    OTHER_INCOME = "other_income",
    GIFT = "gift",
    LOST = "lost",
    COST = "cost",
    MARGIN_INTEREST_FEE = "margin_interest_fee",
    MARGIN_TRADE_FEE = "margin_trade_fee",
    REALIZED_GAIN = "realized_gain",
    SWAP = "swap",
    LIQUIDITY_IN = "liquidity_in",
    LIQUIDITY_OUT = "liquidity_out",
    NO_LABEL = "no_label",
    FROM_POOL = "from_pool",
    TO_POOL = "to_pool",
}

const CoinTrackerTagByKoinlyLabel = new Map<KoinlyLabel, CoinTrackerTag>([
    [KoinlyLabel.GIFT, CoinTrackerTag.GIFT],
    [KoinlyLabel.LOST, CoinTrackerTag.LOST],
    [KoinlyLabel.FORK, CoinTrackerTag.FORK],
    [KoinlyLabel.AIRDROP, CoinTrackerTag.AIRDROP],
    [KoinlyLabel.MINING, CoinTrackerTag.MINED],
    [KoinlyLabel.STAKING, CoinTrackerTag.STAKED],
])

// Be sure to update ORDERED_REQ_HEADERS and ORDERED_OPT_HEADERS when adding members
enum Header {
    DATE = "Date",
    RECEIVED_QUANTITY = "Received Quantity",
    RECEIVED_CURRENCY = "Received Currency",
    SENT_QUANTITY = "Sent Quantity",
    SENT_CURRENCY = "Sent Currency",
    FEE_AMOUNT = "Fee Amount",
    FEE_CURRENCY = "Fee Currency",
    TAG = "Tag",
    // Optional
    TYPE= "Type",
    // Koinly's "tag" type
    LABEL= "Label",
    RECEIVER_WALLET = "Receiver Wallet",
    SENDER_WALLET = "Sender Wallet",
}

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
]

const ORDERED_ALL_HEADERS = [
    ...ORDERED_REQ_HEADERS,
    ...ORDERED_OPT_HEADERS
]

const HEADER_GETTERS = new Map<Header, ValueGetter>([
    [Header.DATE, (t: Transaction) => t.date],
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
    [Header.SENDER_WALLET, (t: Transaction) => t.from?.wallet.name]
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
            if (HEADER_GETTERS.get(Header.SENT_QUANTITY)?.(tran)
                || HEADER_GETTERS.get(Header.SENT_CURRENCY)?.(tran)
                || HEADER_GETTERS.get(Header.FEE_AMOUNT)?.(tran)) {
                    throw "Receive/deposit transactions: " +
                    "Should have empty values for the sent quantity and sent currency " +
                    "Received Quantity should *NOT* include fees "
                }    
        }
        if (tran.type == KoinlyType.CRYPTO_WITHDRAWAL) {
            if (HEADER_GETTERS.get(Header.RECEIVED_QUANTITY)?.(tran)
                || HEADER_GETTERS.get(Header.RECEIVED_CURRENCY)?.(tran)
                || HEADER_GETTERS.get(Header.FEE_AMOUNT)?.(tran)) {
                    "Send/withdrawal transactions: " +
                    "Should have empty values for the received quantity and received currency " +
                    "Sent Quantity should include fees "
                }    
        }
    })

    const transCsvLines = parseTrans(trans, headerGetters)
    return [
        [...headers].join(","),
         ...transCsvLines
        ].join("\n")
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
