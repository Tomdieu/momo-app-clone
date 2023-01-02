import * as Yup from 'yup'

import ApiService from '../utils/ApiService'


const PhoneSchema = Yup.object().shape({
    phoneNumber: Yup.string().min(9, 'Phone number must be atleast 9 numbers starting with 6xxxxxxxx')
    .max(13, 'Phone number must be atmost 13 characters with prefix +2376xxxxxxxx')
    .required('Phone number require')
    .test('phoneNumber', 'This phone number does not exists', function (value) {
        return new Promise((resolve, reject) => {
          ApiService.getIfUserExist("phone_number", value)
              .then((res) => res.json())
              .then((dt) => {
                console.log(dt);
                resolve(dt.success)
              });
          });
    })
})

export default PhoneSchema