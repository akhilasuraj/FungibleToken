const xrpl = require('xrpl')

const cold_wallet = xrpl.Wallet.fromSeed("ssRpEiJBtkeC96p5ZrkGWCJvfN15P")
const hot_wallet = xrpl.Wallet.fromSeed("ssFqDFpJ8RG9iRwYdj8NnoUXtcuQN")

module.exports = {
    cold_wallet: cold_wallet,
    hot_wallet: hot_wallet
}