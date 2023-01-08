import * as Yup from 'yup'

const UpdateProfileSchema = Yup.object().shape({
  first_name:Yup.string().required('First name is require'),
  last_name:Yup.string().required("Last name is require")  
})

export default UpdateProfileSchema