export enum CoinTrackerTag {
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