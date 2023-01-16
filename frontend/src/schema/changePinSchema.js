import * as Yup from 'yup';


const changePinSchema = Yup.object().shape({
	old_pin: Yup.string().min(5,"Please Enter 5 digit").required('old pin is required'),
    new_pin: Yup.string().min(5,"Please Enter 5 digit").required('New pin is required'),
    confirm_pin: Yup.string().min(5,"Please Enter 5 digit").oneOf([Yup.ref('new_pin'), null], "Pin doesn't match").required("confirm pin is required")
});


export default changePinSchema;