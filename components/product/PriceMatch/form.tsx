import { 
  BTN_SUBMIT, 
  VALIDATION_ENTER_CORRECT_URL, 
  VALIDATION_ENTER_PRODUCT_LINK, 
  VALIDATION_ENTER_WEBSITE_LINK
} from '@components/utils/textVariables'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { config } from './config'
const schema = Yup.object().shape({
  websiteName: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      VALIDATION_ENTER_CORRECT_URL
    )
    .required(VALIDATION_ENTER_WEBSITE_LINK),
  websiteLink: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      VALIDATION_ENTER_CORRECT_URL
    )
    .required(VALIDATION_ENTER_PRODUCT_LINK),
  costOfProduct: Yup.number().required('Required'),
  deliveryCost: Yup.number().required('Required'),
  totalCost: Yup.number(),
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string().required('Required'),
})

export default function PriceMatchForm({ submitContactForm }: any) {
  return (
    <Formik
      initialValues={{
        websiteName: '',
        websiteLink: '',
        name: '',
        email: '',
        phone: '',
      }}
      validationSchema={schema}
      onSubmit={(values) => {
        // same shape as initial values
        submitContactForm(values)
      }}
    >
      {({ errors, touched, handleSubmit, values, handleChange }: any) => (
        <Form>
          {config.map((itemForm: any, itemIdx: number) => {
            let value = values[itemForm.key]
            if (itemForm.key === 'totalCost') {
              value = (values.costOfProduct || 0) + (values.deliveryCost || 0)
            }
            return (
              <>
                <Field
                  key={itemIdx}
                  name={itemForm.key}
                  placeholder={itemForm.placeholder}
                  onChange={handleChange}
                  value={value}
                  type={itemForm.type}
                  className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
                />
                {errors[itemForm.key] && touched[itemForm.key] ? (
                  <div className="text-red-400 text-xs capitalize mb-2">
                    {errors[itemForm.key]}
                  </div>
                ) : null}
              </>
            )
          })}
          <div className="mt-5 flex justify-center items-center">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
            >
              {BTN_SUBMIT}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
