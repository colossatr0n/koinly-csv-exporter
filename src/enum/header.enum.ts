// Be sure to update ORDERED_REQ_HEADERS, HEADER_GETTERS, and ORDERED_OPT_HEADERS in koinly-to-cointracker-csv when adding members
enum Header {
    // Required
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
    LABEL= "Label", // Koinly's "tag" type
    RECEIVER_WALLET = "Receiver Wallet",
    SENDER_WALLET = "Sender Wallet",
    RECEIVER_COST_BASIS = "Receiver Cost Basis",
    SENDER_COST_BASIS = "Sender Cost Basis",
    GAIN = "Gain",
    DESCRIPTION = "Description"
}