import { Layout } from '@components/common'
import { BTN_SUBMIT } from '@components/utils/textVariables'
import { useEffect, useState } from 'react'
import LoadingDots from '@components/ui/LoadingDots'
import {
  NEXT_FORGOT_PASSWORD,
  NEXT_RESET_PASSWORD,
  NEXT_VALIDATE_TOKEN,
} from '@components/utils/constants'
import axios from 'axios'
import { useRouter } from 'next/router'
import { validate } from 'email-validator'

const EMAIL_STATUSES_MAP = {
  NO_EMAIL: 0,
  INVALID_EMAIL: 1,
  VALID_EMAIL: 2,
}

const EMAIL_MESSAGES: any = {
  1: "We couldn't find an account with this email",
  2: 'Success! Check your email for the link to change your password',
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState(EMAIL_STATUSES_MAP.NO_EMAIL)
  const [isValid, setIsValid] = useState(false)
  const [token, setToken] = useState(null)
  const [form, setForm] = useState({ userName: '', password: '' })
  const router: any = useRouter()

  const handleChange = (e: any) => setEmail(e.target.value)

  const validateToken = async (token: any) => {
    try {
      const { data }: any = await axios.post(NEXT_VALIDATE_TOKEN, { token })
      if (!data.response.result.isValid) throw new Error('error')
      else {
        setToken(token)
        setIsValid(true)
        setEmailStatus(EMAIL_STATUSES_MAP.VALID_EMAIL)
        setIsLoading(false)
      }
    } catch (error) {
      alert('Woops! Token is invalid')
      router.push('/my-account/forgot-password')
    }
  }

  useEffect(() => {
    const token = router.query.token
    if (token) {
      //validate token
      setIsLoading(true)
      validateToken(token)
    }
  }, [])

  useEffect(() => {
    if (emailStatus === EMAIL_STATUSES_MAP.INVALID_EMAIL) {
      setTimeout(() => setEmailStatus(EMAIL_STATUSES_MAP.NO_EMAIL), 5000)
    }
  }, [emailStatus])

  const handleSubmit = async () => {
    setIsLoading(true)
    const isValidEmail = validate(email)
    if (isValidEmail) {
      let { data }: any = await axios.post(NEXT_FORGOT_PASSWORD, { email })

      if (!data.forgotRes.result.isValid) {
        setEmailStatus(EMAIL_STATUSES_MAP.INVALID_EMAIL)
      } else {
        const recordIdToken: any = data.forgotRes.result.recordId
        setToken(recordIdToken)
        setIsValid(data.forgotRes.result.isValid)
        setEmailStatus(EMAIL_STATUSES_MAP.VALID_EMAIL)
      }
      setForm({ ...form, userName: email })
      setEmail('')
    }
    setIsLoading(false)
  }

  const config: any = [
    {
      name: 'userName',
      label: 'Enter your email',
      type: 'text',
      placeholder: 'joe@example.com',
    },
    {
      name: 'password',
      label: 'Enter new password',
      type: 'password',
      placeholder: '*******',
    },
  ]
  const stateForm: any = form

  const handlePasswordChangeSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    const forgotPasswordData = { ...form, token: token }
    try {
      await axios.post(NEXT_RESET_PASSWORD, {
        ...forgotPasswordData,
      })
      setIsLoading(false)
      alert('Success! You will be redirected to login page')
      router.push('/my-account/login')
    } catch (error) {
      setIsLoading(false)
    }
  }
  return (
    <section>
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h2 className="my-4 text-4xl font-extrabold text-center tracking-tight text-gray-900">
            {isValid ? 'Change password' : 'Forgot password'}
          </h2>
          {isValid ? (
            <form
              onSubmit={handlePasswordChangeSubmit}
              className="flex-col w-full px-5 py-5 flex items-center justify-center font-semibold w-full sm:w-1/2"
            >
              {config.map((item: any, idx: number) => {
                return (
                  <div key={idx} className="w-full">
                    <label className="text-gray-700 text-sm">
                      {item.label}
                    </label>
                    <input
                      className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      name={item.name}
                      type={item.type}
                      onChange={(e) =>
                        setForm({ ...form, [item.name]: e.target.value })
                      }
                      value={stateForm[item.name]}
                      placeholder={item.placeholder}
                    />
                  </div>
                )
              })}
              <button
                type="submit"
                className="my-4 max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
              >
                {isLoading ? <LoadingDots /> : BTN_SUBMIT}
              </button>
            </form>
          ) : (
            <form className="flex-col w-full px-5 py-5 flex items-center justify-center font-semibold w-full sm:w-1/2">
              <label className="text-gray-700 text-sm">Enter your email</label>
              <input
                className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                name="email"
                onChange={handleChange}
                value={email}
                placeholder="name@example.com"
              />
              {emailStatus > 0 ? (
                <div className="w-full text-gray-900">
                  {EMAIL_MESSAGES[emailStatus]}
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="my-4 max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                >
                  {isLoading ? <LoadingDots /> : BTN_SUBMIT}
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

ForgotPasswordPage.Layout = Layout
