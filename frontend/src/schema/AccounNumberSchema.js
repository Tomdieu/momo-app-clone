import * as Yup from 'yup'

import ApiService from '../utils/ApiService'


const AccountNumberSchema = Yup.object().shape({
    account_number: Yup.string()
    .test('account_number', 'This account number does not exists', function (value) {
        return new Promise((resolve, reject) => {
          ApiService.getIfUserExist("phone_number", value)
              .then((res) => res.json())
              .then((dt) => {
                console.log(dt);
                if (dt.found) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
          });
    })
})

export default AccountNumberSchema