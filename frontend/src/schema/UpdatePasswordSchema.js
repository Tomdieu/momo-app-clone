import * as Yup from 'yup';

const UpdatePasswordSchema = Yup.object().shape({
    old_password: Yup.string().required('old password is required'),
    new_password: Yup.string().required('New password is required'),
    confirm_password: Yup.string().oneOf([Yup.ref('new_password'), null], "Password doesn't match").required("confirm password is required")
})

export default UpdatePasswordSchema;