const xrpl = require('xrpl')
const { hot_wallet, cold_wallet } = require('./wallets')

const send = async () => {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // Send token ----------------------------------------------------------------
    const issue_quantity = "500"
    const currency_code = "LKR"
    const send_token_tx = {
        "TransactionType": "Payment",
        "Account": cold_wallet.address,
        "Amount": {
            "currency": currency_code,
            "value": issue_quantity,
            "issuer": cold_wallet.address
        },
        "Destination": hot_wallet.address,
        "DestinationTag": 1 // Needed since we enabled Require Destination Tags
        // on the hot account earlier.
    }

    const pay_prepared = await client.autofill(send_token_tx)
    const pay_signed = cold_wallet.sign(pay_prepared)
    console.log(`Sending ${issue_quantity} ${currency_code} to ${hot_wallet.address}...`)
    const pay_result = await client.submitAndWait(pay_signed.tx_blob)
    if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`)
    } else {
        throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
    }

    client.disconnect()

}

send()