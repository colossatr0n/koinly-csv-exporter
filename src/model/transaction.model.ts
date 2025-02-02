export interface KoinlyTransaction {
    id: string,
    txhash: string,
    type: string
    from?: Data
    to?: Data
    fee?: Data
    label: string
    date: string
    ignored: boolean
    gain?: string
    description?: string
    net_value: string
    net_worth: any
}

interface Data {
    amount: string
    currency: Currency
    wallet?: Wallet
    cost_basis?: string
}

interface Wallet {
    name: string,
    pool: boolean
}

interface Currency {
    symbol: string
}
