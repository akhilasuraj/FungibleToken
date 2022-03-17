// Hot Address: rw78N7K6PqxdNofgcA1kZYnSY4fkT2HsTj
// Hot Secret: ssFqDFpJ8RG9iRwYdj8NnoUXtcuQN

const xrpl = require('xrpl')
const { cold_wallet, hot_wallet } = require("./wallets")

const recieve = async () => {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // Configure hot address settings --------------------------------------------

    const hot_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": hot_wallet.address,
        "Domain": "6578616D706C652E636F6D", // "example.com"
        // enable Require Auth so we can't use trust lines that users
        // make to the hot address, even by accident:
        "SetFlag": xrpl.AccountSetAsfFlags.asfRequireAuth,
        "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
            xrpl.AccountSetTfFlags.tfRequireDestTag)
    }

    const hst_prepared = await client.autofill(hot_settings_tx)
    const hst_signed = hot_wallet.sign(hst_prepared)
    console.log("Sending hot address AccountSet transaction...")
    const hst_result = await client.submitAndWait(hst_signed.tx_blob)
    if (hst_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${hst_signed.hash}`)
    } else {
        throw `Error sending transaction: ${hst_result.result.meta.TransactionResult}`
    }

    // Create trust line from hot to cold address --------------------------------
    const currency_code = "LKR"
    const trust_set_tx = {
        "TransactionType": "TrustSet",
        "Account": hot_wallet.address,
        "LimitAmount": {
            "currency": currency_code,
            "issuer": cold_wallet.address,
            "value": "10000000000" // Large limit, arbitrarily chosen
        }
    }

    const ts_prepared = await client.autofill(trust_set_tx)
    const ts_signed = hot_wallet.sign(ts_prepared)
    console.log("Creating trust line from hot address to issuer...")
    const ts_result = await client.submitAndWait(ts_signed.tx_blob)
    if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.hash}`)
    } else {
        throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`
    }

    client.disconnect()
}

recieve()