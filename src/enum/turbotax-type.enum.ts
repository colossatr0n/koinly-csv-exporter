export enum TurboTaxType {
    BUY = "buy", // purchasing a digital asset like crypto or an NFT, with cash
    SALE = "sale", // selling your digital asset at a gain or loss. Example, Tyler makes a profit by exchanging a crypto coin for cash. If Tyler used a crypto coin to obtain an NFT, it’s considered a sale
    CONVERT = "convert", // using one type of crypto to buy another type of crypto
    TRANSFER = "transfer", // moving your crypto or asset from one wallet or exchange to another. This isn't taxable
    INCOME = "income", // receiving cryptocurrency from participating in various types of activities. This could include rewards from taking cryptocurrency courses or promotional airdrops. This would also include receiving payments in cryptocurrency from selling goods and services.
    INTEREST = "interest", // earned through these accounts: Crypto interest, Crypto lending, Crypto savings, Crypto liquidity pools.
    EXPENSE = "expense", // any transaction or fees you were charged while using an exchange’s services
    DEPOSIT = "deposit", // moving crypto into a wallet or account. The wallet can be either custodial or noncustodial, and is either a wallet you own or a wallet held by the exchange
    WITHDRAWAL = "withdrawal", // removing fiat (government-issued money) or crypto from a wallet or account. Withdrawals can also include sending crypto or fiat money to another person as payment or moving cryptocurrency to cold storage (offline cryptocurrency storage)

    // recieve transactions
    MINING = "mining", // creating coins by validating transactions to be added to a blockchain network through proof-of-work protocols.
    AIRDROP = "airdrop", // using this distribution method where assets are delivered to wallets. 
    FORKING = "forking", // changing a blockchain’s rules, where the new rules apply to tokens. Rule changes can result in monetary gains
    STAKING = "staking", // earning rewards by committing your crypto holdings to validate and verify blockchain transactions through Proof of Stake protocols. The most common blockchains for staking are:

    OTHER = "other", // any other activity that can't be automatically categorized under the preceding transaction types
}
