// Description of Koinly types and labels/tags: https://help.koinly.io/en/articles/3661665-transactions-in-koinly-explained
export enum KoinlyType {
    // Withdrawal type
    CRYPTO_WITHDRAWAL = "crypto_withdrawal",
    WITHDRAWAL = "withdrawal", // crypto and fiat

    // Deposit type
    CRYPTO_DEPOSIT = "crypto_deposit",
    FIAT_DEPOSIT = "fiat_deposit",
    DEPOSIT = "deposit", // cryto and fiat

    BUY = "buy", // fiat -> crypto 
    SELL = "sell", // crypto -> fiat

    // This is a special type of transaction and is actually composed 
    // of a Deposit transaction and a Withdrawal transaction. Transfers 
    // are created internally by Koinly and can not be imported from
    // csv files or via API.
    //
    // To see how this works in Koinly, see https://help.koinly.io/en/articles/3661312-how-koinly-handles-transfers-between-your-own-wallets
    TRANSFER = "transfer",

    // Trade types
    EXCHANGE = "exchange", // crypto -> crypto
}
