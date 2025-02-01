// Be sure to update ORDERED_REQ_HEADERS, HEADER_GETTERS, and ORDERED_OPT_HEADERS in koinly-to-cointracker-csv when adding members
export enum CoinTrackerHeader {
    DATE = "Date",
    RECEIVED_QUANTITY = "Received Quantity",
    RECEIVED_CURRENCY = "Received Currency",
    SENT_QUANTITY = "Sent Quantity",
    SENT_CURRENCY = "Sent Currency",
    FEE_AMOUNT = "Fee Amount",
    FEE_CURRENCY = "Fee Currency",
    TAG = "Tag",
}