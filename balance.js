const xrpl = require('xrpl')
const { hot_wallet, cold_wallet } = require('./wallets')

const balance = async () => {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // Check balances ------------------------------------------------------------
    console.log("Getting hot address balances...")
    const hot_balances = await client.request({
        command: "account_lines",
        account: hot_wallet.address,
        ledger_index: "validated"
    })
    console.log("Account address : ", hot_balances.result.account)

    hot_balances.result.lines.forEach(line => {
        console.log("Currency        : ", line.currency)
        console.log("Balance         : ", line.balance)
        console.log("\n")
    })

    // console.log("Getting cold address balances...")
    // const cold_balances = await client.request({
    //     command: "gateway_balances",
    //     account: cold_wallet.address,
    //     ledger_index: "validated",
    //     hotwallet: [hot_wallet.address]
    // })
    // console.log(cold_balances.result)

    client.disconnect()
}

balance()