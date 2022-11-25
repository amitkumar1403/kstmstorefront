import { useState } from 'react'
import { useUI } from '@components/ui/context'
import Router from 'next/router'
import useWishlist from '@components/services/wishlist'
import { NEXT_LOGIN_CHECKOUT } from '@components/utils/constants'
import axios from 'axios'
import Form from '@components/customer'
import GuestForm from './GuestForm'
import Link from 'next/link'
import { BTN_CHECKOUT_SECURELY, CUSTOMER_ERROR_MESSAGE, GUEST_CHECKOUT, LOG_IN, NEW_CUSTOMER } from '@components/utils/textVariables'
const config = [
  {
    title: LOG_IN,
    key: 'logIn',
  },
  {
    title: GUEST_CHECKOUT,
    key: 'guestCheckout',
  },
]

const DEFAULT_TAB = {
  title: LOG_IN,
  key: 'logIn',
}

export default function CheckoutRouter({
  handleGuestMail,
  setIsLoggedIn,
}: any) {
  const [noAccount, setNoAccount] = useState(false)
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB)
  const { setUser, setIsGuestUser, wishlistItems, basketId, setCartItems } = useUI()
  const { getWishlist } = useWishlist()

  const handleUserLogin = (values: any) => {
    const asyncLoginUser = async () => {
      const result: any = await axios.post(NEXT_LOGIN_CHECKOUT, {
        basketId: basketId,
        ...values,
      })
      if (!result.data) {
        setNoAccount(true)
      } else if (result.data) {
        setNoAccount(false)
        setCartItems(result.data)
        setIsLoggedIn(true)
        setIsGuestUser(false);
        // setUser(result.data)
        // getWishlist(result.data.userId, wishlistItems)
        Router.push('/checkout')
      }
    }
    asyncLoginUser()
  }

  const handleGuestCheckout = (values: any) => handleGuestMail(values)

  const handleTabChange = (key: string) => {
    const item: any = config.find((item: any) => item.key === key)
    if (item.key !== activeTab.key) {
      setActiveTab(item)
    }
  }

  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h2 className="sm:text-6xl text-3xl uppercase font-bold text-center tracking-tight text-gray-900">
            {BTN_CHECKOUT_SECURELY}
          </h2>
        </div>
        <div className="flex justify-center items-center pt-10">
          {config.map((item: any, idx: number) => {
            return (
              <div
                key={idx}
                onClick={() => handleTabChange(item.key)}
                className={`cursor-pointer py-2 font-semibold text-gray-900 sm:w-1/4 w-2/3 sm:px-12 px-6 text-center border-b-2 ${
                  activeTab.key === item.key
                    ? 'border-gray-900'
                    : 'border-gray-300'
                }`}
              >
                {item.title}
              </div>
            )
          })}
        </div>
        {activeTab.key === 'logIn' && (
          <div className="flex justify-center items-center flex-col">
            <Form btnText="Login" type="login" onSubmit={handleUserLogin} />
            <div>
              <Link href="/my-account/register">
                <span className="text-gray-600 underline cursor-pointer">
                  {NEW_CUSTOMER}
                </span>
              </Link>
            </div>
          </div>
        )}
        {activeTab.key === 'guestCheckout' && (
          <GuestForm onSubmit={handleGuestCheckout} />
        )}
        <div className="w-full flex flex-col justify-center items-center">
          {noAccount && activeTab.key === 'logIn' && (
            <span className="text-red-700 text-lg">
              {CUSTOMER_ERROR_MESSAGE}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
