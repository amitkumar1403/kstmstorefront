import { GENERAL_ADD_TO_BASKET, VALIDATION_PLEASE_COMPLETE_THIS_FIELD } from '@components/utils/textVariables'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { config } from './config'

const schema = Yup.object().shape({
  line1: Yup.string().required(VALIDATION_PLEASE_COMPLETE_THIS_FIELD),
  line2: Yup.string(),
  line3: Yup.string(),
})

export default function EngravingForm({ submitForm }: any) {
  return (
    <Formik
      initialValues={{ line1: '', line2: '', line3: '' }}
      onSubmit={(values) => submitForm(values)}
      validationSchema={schema}
    >
      {({ errors, touched, handleSubmit, values, handleChange }: any) => {
        return (
          <Form className="w-full font-semibold mt-4">
            {config.map((itemForm: any, itemIdx: number) => {
              return (
                <>
                  <label className="text-black font-semibold uppercase text-xs">
                    {itemForm.label}
                  </label>

                  <Field
                    key={itemIdx}
                    name={itemForm.key}
                    placeholder={itemForm.placeholder}
                    onChange={handleChange}
                    value={values[itemForm.key]}
                    type={itemForm.type}
                    className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
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
                className="w-full max-w-xs flex-1 uppercase bg-black border border-transparent rounded-sm py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black sm:w-full"
              >
                {GENERAL_ADD_TO_BASKET}
              </button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
