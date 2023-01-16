import * as Yup from 'yup'
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIService from '../utils/ApiService'

const UpdateProfileSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is require'),
  last_name: Yup.string(),
  phone_number: Yup.string()
    .matches(/^[+]?(237)?6(\d+){8}$/, {
      message: ["Please enter a valid cameroonian phone number"],
    })
    .required("phone number required")
    .test('phone_number','This phone number already exists',(value)=>{
      return new Promise((resolve, reject) => {
        APIService.getIfUserExist("phone_number", value)
          .then((res) => res.json())
          .then((data) => {
            // console.log(data)
            AsyncStorage.getItem('userInfo').then((dt)=>{
              const userDetail = JSON.parse(dt);
              // console.log(userDetail.phone_number,value,userDetail.phone_number===value,data.success)
              console.log(userDetail.phone_number,value)
              if(Boolean((userDetail.phone_number === value))){
                resolve(true);
              }
              else{
                resolve(false);
              }
            })
            
          });
      });
    }),
})

export default UpdateProfileSchema