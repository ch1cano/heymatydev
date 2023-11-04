const fetch = require('node-fetch')
module.exports = class Bitaps {
  constructor() {
    this.baseurl = process.env.BITAPS_API_BASE_URL
    // this.forwardingAddress = process.env.BITAPS_FORWARDING_ADDRESS
    this.wallet_id = process.env.BITAPS_WALLET_ID
    this.paymentAddressCallbackURL = `https://heydaddy.io/api/bitaps/callback-link/payment-address`
  }
  //Создание платежного адреса
  async createPaymentAddress(
    wid = this.wallet_id,
    cb = this.paymentAddressCallbackURL,
    conf = 3
  ) {
    const body = {
      wallet_id: wid,
      callback_link: cb,
      confirmations: conf
    }
    const resp = await fetch(`${this.baseurl}/create/wallet/payment/address`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json()
  }
  // Запрос состояния кошелька
  async getWalletState(wid = this.wallet_id) {
    const resp = await fetch(`${this.baseurl}/wallet/state/${wid}`, {
      method: 'get'
    })
    return await resp.json()
  }
  // Выплата с кошелька
  async sendPaymentToUser(receiver, userid, amount, wid = this.wallet_id) {
    const receivers_list = [
      {
        address: receiver,
        amount: parseInt(amount)
      }
    ]
    const message = {
      format: 'text',
      payload: userid
    }
    const body = {
      receivers_list,
      message
    }
    const resp = await fetch(`${this.baseurl}/wallet/send/payment/${wid}`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
    return await resp.json()
  }
}
