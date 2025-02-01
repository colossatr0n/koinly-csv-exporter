export interface KoinlyTransaction {
    type: string
    from?: Data
    to?: Data
    fee?: Data
    label: string
    date: string
    ignored: boolean
    gain?: string
    description?: string
}

interface Data {
    amount: string
    currency: Currency
    wallet: Wallet
    cost_basis?: string
}

interface Wallet {
    name: string
}

interface Currency {
    symbol: string
}