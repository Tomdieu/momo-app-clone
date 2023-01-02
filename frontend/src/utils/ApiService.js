// import axios from 'axios'

export default class Trixwallet {
  static endPoint = 'http://192.168.8.103:8000'
  static webSocketUrl = 'ws://127.0.0.1:8000'

  /**
   *
   * @param {String} field
   * @param {String} value
   */
  static async getIfUserExist(field, value) {
    const url = this.endPoint + `/api/auth/user/${field}:${value}/available/`
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return res
  }

  static async getAccountInfo(field,value,token){
    const url = this.endPoint + `/api/momo/get-account/?${field}=${value}`;
    const res = await fetch(url,{
      headers:{
        'Content-Type':'application/json',
        'Authorization':`token ${token}`
      }
    })

    return res
  }

  static async getTransactionChargeInfo(type,token){
    const url = this.endPoint + `/api/momo/get-transaction-charges/?type=${type}`;
    const res = await fetch(url,{
      headers:{
        'Content-Type':'application/json',
        'Authorization':`token ${token}`
      }
    })

    return res
  }

  static async verifyPinCode(pin_code,token){
    const url = this.endPoint + `/api/momo/verify-pin-code/?pin_code=${pin_code}`;
    const res = await fetch(url,{
      headers:{
        'Content-Type':'application/json',
        'Authorization':`token ${token}`
      }
    })

    return res
  }


  /**
   *
   *  The ourput of the response looks like
   *  ```
   *    {
   *       "success": true,
   *       "data":{...}
   *       "token": "your-token"
   *    }
   * ```
   *
   * @param {String} username
   * @param {String} password
   */
  static async authenticate(username, password) {
    const url = this.endPoint + '/api/auth/login/'
    const res = await fetch(url, {
      method: 'POST',
      body:JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return res
  }

  // static async authenticate(username, password) {
  //   const url = this.endPoint + '/api/auth/login/'
  //   const res = await axios.post(url,{username,password},{
  //     headers:{
  //       'Content-Type':'application/json'
  //     }
  //   })
  //   return res
  // }

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

  /**
   *
   * # Logout
   *
   * @param {string} token
   * @returns
   */
  static async logout(token) {
    const url = this.endPoint + '/api/auth/logout/'
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
  /**
   * 
   * ## Update Language
   * This functions is use to update the language of a user
   * 
   * The data should be like
   * ```
   *  {
        "lang": 'EN' | 'FR'
      }
   * ```
   * 
   * @param {object} data 
   * @param {string} token
   * @returns 
   */
  static async updateLanguage(data, token) {
    const url = this.endPoint + '/api/auth/update-language/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', Authorization: `token ${token}` }
    })
    return res
  }
  /**
   * ## Get profile
   * this function get the profile of a user
   *
   * and to get it you must get the first [0] value of the response
   *
   * @param {string} token
   * @returns
   */
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
  /**
   * ## Update Account
   *
   * This functions updates the accounts of a user
   *
   * @param {int} id
   * @param {object} data
   * @param {string} token
   * @returns
   */
  static async updateAccount(id, data, token) {
    const url = this.endPoint + `/api/momo/accounts/${id}/`
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }
  /**
   *
   * ## Transfer Charges
   *
   * @param {string} token
   * @returns
   */
  static async transferCharges(token) {
    const url = this.endPoint + `/api/momo/transaction-charges/`
    const res = await fetch(url, {
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })

    return res
  }

  /**
   *
   * ## Transfer Transaction List
   *
   * @param {string} token
   * @returns
   */
  static async transferList(token) {
    const url = this.endPoint + '/api/momo/transfer-money/'
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  /**
   *
   * ## Transfer Money
   *
   * @param {object} data
   * @param {string} token
   * @returns
   */
  static async transferMoney(data, token) {
    const url = this.endPoint + '/api/momo/transfer-money/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  /**
   *
   * ## Deposit Transaction List
   *
   * @param {string} token
   * @returns
   */
  static async depositList(token) {
    const url = this.endPoint + '/api/momo/deposit-money/'
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  /**
   *
   * ## Deposit Money
   *
   * @param {object} data
   * @param {string} token
   * @returns
   */
  static async depositMoney(data, token) {
    const url = this.endPoint + '/api/momo/deposit-money/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  static async withdrawList(token) {
    const url = this.endPoint + '/api/momo/withdraw-money/'
    const res = await fetch(url, {
      method: 'GET',
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


  /**
   * 
   * ## Change Pin Code
   * 
   * data should contain the information
   * ```
   *  {
        "old_pin": "",
        "new_pin": "",
        "confirm_pin": ""
    }
   * ```
   * 
   * @param {object} data 
   * @param {token} token 
   * @returns 
   */
  static async changePinCode(data, token) {
    const url = this.endPoint + '/api/momo/change-pin-code/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  /**
   *
   * This functions get all the pending withdrawal
   *
   * @param {string} token
   * @returns
   */
  static async pendingWithdrawals(token) {
    const url = this.endPoint + '/api/momo/confirm-withdrawal/'
    const res = await fetch(url, {
      method: 'POST',
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
  /**
     * ## Notification
     * This functions is use to get convert a currency to another
     * 
     * the `data` must contain the following information
     * ```
     *  {
            "from_currency": "",
            "to_currency": "",
            "amount": null
        }
     * ```

     *  Example
     * ```
     * {
          "from_currency": "USD",
          "to_currency": "XAF",
          "amount": 3000
      }
     * ```
     *  
     * @param {string} token 
     * @param {object} data
     * @returns 
     */
  static async convertCurrency(data, token) {
    const url = this.endPoint + '/api/momo/convert-currency/'
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  /**
   * ## Notification
   * This functions is use to get the notification of a sign in user
   * @param {string} token
   * @returns
   */
  static async getNotifications(token) {
    const url = this.endPoint + '/api/notifications/'
    const res = await fetch(url, {
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }

  static async deleteNotifications(id, token) {
    const url = this.endPoint + '/api/notifications/' + id + '/'
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }
    })
    return res
  }
}
