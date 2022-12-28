import * as Yup from 'yup'


const AmountSchema = Yup.object().shape({
    amount: Yup
    .string()
    .required('The amount is require')
    .matches(/^(\d+)$/, 'Please amount must be numeric')
    .test('amount', 'You can only send a minimun of 100 XAF',function(value){
        return parseInt(value)>=100
    })
})

export default AmountSchema