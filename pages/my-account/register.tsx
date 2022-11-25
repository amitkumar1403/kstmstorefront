import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Form from '@components/customer'
import axios from 'axios'
import {
  NEXT_SIGN_UP,
  NEXT_VALIDATE_EMAIL,
  NEXT_ASSOCIATE_CART,
} from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import Button from '@components/ui/IndigoButton'
import { validate } from 'email-validator'
import cartHandler from '@components/services/cart'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { BTN_REGISTER_FOR_FREE, GENERAL_EMAIL, VALIDATION_EMAIL_ALREADY_IN_USE, VALIDATION_ENTER_A_VALID_EMAIL, VALIDATION_YOU_ARE_ALREADY_LOGGED_IN } from '@components/utils/textVariables'

const EmailInput = ({ value, onChange, submit, apiError = '' }: any) => {
  const [error, setError] = useState(apiError)

  useEffect(() => {
    setError(apiError)
  }, [apiError])

  const handleSubmit = async () => {
    const isValidEmail = validate(value)
    if (isValidEmail) {
      error ? setError('') : false
      await submit(value)
    } else {
      setError(VALIDATION_ENTER_A_VALID_EMAIL)
    }
  }

  return (
    <div className="w-full flex justify-center mt-10 flex-col items-center">
      <div className="font-semibold w-full sm:w-1/2">
        <label className="text-gray-700 text-sm">{GENERAL_EMAIL}</label>
        <input
          className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
          value={value}
          type="email"
          onChange={onChange}
        />
      </div>
      {error ? <span className="text-red-500 capitalize">{error}</span> : null}
      <div className="w-full sm:w-1/2 flex justify-center items-center my-5">
        <Button buttonType="default" action={handleSubmit} title={'Submit'} />
      </div>
    </div>
  )
}
function RegisterPage({ recordEvent, setEntities }: any) {
  const [hasPassedEmailValidation, setHasPassedEmailValidation] =
    useState(false)
  const [userEmail, setUserEmail] = useState('')
  const { isGuestUser, setIsGuestUser, user, basketId } = useUI()
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { addToCart, associateCart } = cartHandler()
  const { CustomerCreated, PageViewed } = EVENTS_MAP.EVENT_TYPES

  useAnalytics(PageViewed, {
    eventType: PageViewed,
  })

  useEffect(() => {
    setError('')
  }, [userEmail])

  if (!isGuestUser && user.userId) {
    Router.push('/')
  }
  if (!isGuestUser && user.userId) {
    return (
      <div className="font-extrabold text-center w-full h-full text-gray-900">
        {VALIDATION_YOU_ARE_ALREADY_LOGGED_IN}
      </div>
    )
  }

  const handleBasketAssociation = async (userId: string) => {
    const response: any = await associateCart(userId, basketId)
  }

  const handleUserRegister = async (values: any) => {
    const response: any = await axios.post(NEXT_SIGN_UP, {
      data: { ...values, email: userEmail },
    })
    eventDispatcher(CustomerCreated, {
      entity: JSON.stringify({
        id: response.data.recordId,
        name: values.firstName + values.lastName,
        email: values.email,
      }),
      eventType: CustomerCreated,
    })
    await handleBasketAssociation(response.data.recordId)
    setSuccessMessage('Success!')
    setIsGuestUser(false)
    Router.push('/my-account/login')
  }

  const handleEmailSubmit = async (email: string) => {
    try {
      const { data }: any = await axios.post(NEXT_VALIDATE_EMAIL, {
        data: email,
      })
      if (!data.length) {
        setHasPassedEmailValidation(true)
      } else {
        setError(VALIDATION_EMAIL_ALREADY_IN_USE)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h2 className="text-6xl font-extrabold text-center tracking-tight text-gray-900">
            {BTN_REGISTER_FOR_FREE}
          </h2>
        </div>
        {!successMessage && (
          <>
            {!hasPassedEmailValidation ? (
              <EmailInput
                value={userEmail}
                onChange={(e: any) => setUserEmail(e.target.value)}
                submit={handleEmailSubmit}
                apiError={error}
              />
            ) : (
              <Form type="register" onSubmit={handleUserRegister} />
            )}
          </>
        )}
        <span className="flex w-full justify-center items-center text-2xl text-indigo-600">
          {successMessage}
        </span>
      </div>
    </section>
  )
}

RegisterPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(RegisterPage, PAGE_TYPE)
