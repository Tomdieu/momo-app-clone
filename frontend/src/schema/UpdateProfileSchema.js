import * as Yup from 'yup'

import APIService from '../utils/ApiService'

const UpdateProfileSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is require'),
  last_name: Yup.string().required("Last name is require"),
  phone_number: Yup.string()
    .matches(/^(237)?6(\d+){8}$/, {
      message: ["Please enter a valid cameroonian phone number"],
    })
    .required("phone number required")
    .test('phone_number','This phone number already exists',(value)=>{
      return new Promise((resolve, reject) => {
        APIService.getIfUserExist("phone_number", value)
          .then((res) => res.json())
          .then((dt) => {
            console.log(dt);
            if (dt.found) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
      });
    }),
})

export default UpdateProfileSchema