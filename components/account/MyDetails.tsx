import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { formConfig, schema } from './configs/details'
import { useUI } from '@components/ui/context'
import { handleSubmit } from './common'
import LoadingDots from '@components/ui/LoadingDots'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { MY_DETAIL_TEXT, GENERAL_SAVE_CHANGES } from '@components/utils/textVariables'

export default function MyDetails() {
  const [title, setTitle] = useState('My Details')

  const { user, setUser } = useUI()
  const { CustomerUpdated } = EVENTS_MAP.EVENT_TYPES

  const initialValues = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    mobile: user.mobile,
    phone: user.phone,
  }

  const handleDataSubmit = async (values: any) => {
    await handleSubmit(values, user, setUser, setTitle)
    eventDispatcher(CustomerUpdated, {
      entity: JSON.stringify({
        id: user.userId,
        name: user.username,
        dateOfBirth: user.yearOfBirth,
        gender: user.gender,
        email: user.email,
        postCode: user.postCode,
      }),
      entityId: user.userId,
      entityName: user.firstName + user.lastName,
      eventType: CustomerUpdated,
    })
  }

  return (
    <main className="sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
          {MY_DETAIL_TEXT}
          </p>
        </div>
      </div>
      <div>
        <Formik
          validationSchema={schema}
          initialValues={initialValues}
          onSubmit={handleDataSubmit}
        >
          {({
            errors,
            touched,
            handleSubmit,
            values,
            handleChange,
            isSubmitting,
          }: any) => {
            return (
              <div className="flex-col w-full py-5 flex items-flex-start mx-auto max-w-4xl justify-center">
                <Form className="font-semibold w-full sm:w-1/2">
                  {formConfig.map((formItem: any, idx: number) => {
                    return (
                      <div key={`${formItem.label}_${idx}`}>
                        <label className="text-gray-700 text-sm">
                          {formItem.label}
                        </label>
                        <Field
                          key={idx}
                          name={formItem.name}
                          placeholder={formItem.placeholder}
                          onChange={handleChange}
                          value={values[formItem.name]}
                          type={formItem.type}
                          className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
                        />

                        {errors[formItem.name] && touched[formItem.name] ? (
                          <div className="text-red-400 text-xs capitalize mb-2">
                            {errors[formItem.name]}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </Form>
                <div className="mt-10 flex sm:flex-col1">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                  >
                    {isSubmitting ? <LoadingDots /> : GENERAL_SAVE_CHANGES}
                  </button>
                </div>
              </div>
            )
          }}
        </Formik>
      </div>
    </main>
  )
}
