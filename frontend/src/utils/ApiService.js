export default class Trixwallet {
  static endPoint = 'http://127.0.0.1:8000/api'

  /**
   *
   *  The ourput of the response looks like
   *  ```
   *    {
   *       "success": true,
   *       "token": "your-token"
   *    }
   * ```
   *
   * @param {String} username
   * @param {String} password
   */
  static async authenticate(username, password) {
    const url = this.endPoint + '/auth/login/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return res
  }

  /**
   * This functions gets the data of a user an create an account
   * with the corresponding information provided.
   * @param {object} data
   */
  static async register(data) {
    const url = this.endPoint + '/api/auth/register/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return res
  }

  static async logout(token) {
    const url = this.endPoint + 'auth/logout/'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `token ${token}` }
    })

    return res
  }

  /**
   * This functions required an object containing.
   *
   * data :
   * ```
   *  {
   *      "old_password": "",
   *      "new_password": "",
   *      "confirm_password": ""
   *  }
   * ```
   *
   * token : 2kjskd2kjke2ksadk2ksd
   *
   * @param {object} data
   * @password {String} token
   */
  static async updatePassword(data, token) {
    const url = this.endPoint + '/api/auth/update-password/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', Authorization: `token ${token}` }
    })

    return res
  }

  static async updateLanguage(data) {
    const url = this.endPoint + '/api/auth/update-language/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', Authorization: `token ${token}` }
    })
    return res
  }

  static async getProfile(token) {
    const url = this.endPoint + '/api/auth/profile/'
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', Authorization: `token ${token}` }
    })
    return res
  }

  static async updateProfile(id, data) {
    const url = this.endPoint + `/api/auth/profile/${id}/`
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  //   Account

  static async account(token) {
    const url = this.endPoint + `/api/momo/accounts/`
    const res = await fetch(url, {
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })

    return res
  }

  static async updateAccount(id, data, token) {
    const url = this.endPoint + `/api/momo/accounts/${id}/`
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }
  static async transferCharges(token) {
    const url = this.endPoint + `/api/momo/transaction-charges/`
    const res = await fetch(url, {
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })

    return res
  }

  static async transferMoney(data, token) {
    const url = this.endPoint + '/api/momo/transfer-money/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  static async withdrawMoney(data, token) {
    const url = this.endPoint + '/api/momo/withdraw-money/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }
  static async changePinCode(data, token) {
    const url = this.endPoint + '/api/momo/change-pin-code/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  static async pendingWithdrawals(data, token) {
    const url = this.endPoint + '/api/momo/confirm-withdrawal/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  static async confirmOrDenyWithdrawals(id, data, token) {
    const url = this.endPoint + `/api/momo/confirm-withdrawal/${id}/`
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }
  static async convertCurrency(data, token) {
    const url = this.endPoint + '/api/momo/convert-currency/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }
}
