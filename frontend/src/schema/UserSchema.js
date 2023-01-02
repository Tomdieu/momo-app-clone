import * as Yup from "yup";

import APIService from '../utils/ApiService'

const validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  first_name: Yup.string().required("First name require"),
  last_name: Yup.string(),
  email: Yup.string()
    .email("Email must be valid")
    .required("Email is required"),
  phone_number: Yup.string().required(),
  password: Yup.string().min(8, "Password must be at least 6 characters"),
  password_confirmation: Yup.string().min(8, "Password must be at least"),
});

export const loginValidationSchema = Yup.object().shape({
  username: Yup.string()
    .email("Please enter valid email")
    .required("Email Address is Required"),
  password: Yup.string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Password is required"),
});

export const basicSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, "username must be atleast 5 characters")
    .required("username required")
    .test("username", "a with this username already exists", function (value) {
      // return value!=='ivantom'
      return new Promise((resolve, reject) => {
        APIService.getIfUserExist("username", value)
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
  first_name: Yup.string().required("first name required"),
  last_name: Yup.string(),
  email: Yup.string()
    .email("please enter a invalid email")
    .required("email required"),
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
  password: Yup.string().min(5).required("password required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "password don't match")
    .required("confirm password required"),
});
