// Be sure to update ORDERED_REQ_HEADERS, HEADER_GETTERS, and ORDERED_OPT_HEADERS in koinly-to-cointracker-csv when adding members
export enum TurboTaxHeader {
    DATE = "Date",
    TYPE= "Type",
    SENT_ASSET = "Sent Asset",
    SENT_AMOUNT = "Sent Amount",
    RECEIVED_ASSET = "Received Asset",
    RECEIVED_AMOUNT = "Received Amount",
    FEE_ASSET = "Fee Asset",
    FEE_AMOUNT = "Fee Amount",
    MARKET_VALUE_CURRENCY = "Market Value Currency",
    MARKET_VALUE = "Market Value",
    DESCRIPTION = "Description",
    TRANSACTION_HASH = "Transaction Hash",
    TRANSACTION_ID = "Transaction ID",
}
