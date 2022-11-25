import dynamic from 'next/dynamic'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
const CheckoutRouter = dynamic(() => import('@components/checkout/CheckoutRouter'))
const CheckoutForm = dynamic(() => import('@components/checkout/CheckoutForm'))
import { useState, useEffect } from 'react'
import cookie from 'cookie'
import { basketId as basketIdGenerator } from '@components/ui/context'
import { useCart as getCart } from '@framework/cart'
import { GetServerSideProps } from 'next'
import { useUI } from '@components/ui/context'
import { asyncHandler } from '@components/account/Address/AddressBook'
import { NEXT_GUEST_CHECKOUT } from '@components/utils/constants'
import axios from 'axios'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import useAnalytics from '@components/services/analytics/useAnalytics'

function Checkout({ cart, config, location }: any) {
  const { user, basketId, setCartItems, cartItems, setUser, setIsGuestUser } = useUI()
  const [isLoggedIn, setIsLoggedIn] = useState(!!cartItems.userEmail)
  const [defaultShippingAddress, setDefaultShippingAddress] = useState({})
  const [defaultBillingAddress, setDefaultBillingAddress] = useState({})
  const [userAddresses, setUserAddresses] = useState([])
  const handleGuestMail = (values: any) => {
    const handleAsync = async () => {
      const response = await axios.post(NEXT_GUEST_CHECKOUT, {
        basketId: basketId,
        ...values,
      })
      const newCartClone = { ...response.data, isGuestCheckout: true }
      setCartItems(newCartClone)
      setIsLoggedIn(!!response.data.userEmail)
      setUser({ userId: response.data.userId, email: response.data.userEmail })
      setIsGuestUser(true)
    }
    handleAsync()
  }
  const { getAddress } = asyncHandler()

  const fetchAddress = async () => {
    try {
      const response: any = await getAddress(cartItems.userId)
      const billingAddress = response.find((item: any) => item.isDefaultBilling)
      const shippingAddress = response.find(
        (item: any) => item.isDefaultDelivery
      )
      setUserAddresses(response)
      if (billingAddress) setDefaultBillingAddress(billingAddress)
      if (shippingAddress) setDefaultShippingAddress(shippingAddress)
    } catch (error) {
      console.log(error, 'err')
    }
  }

  const { CheckoutStarted } = EVENTS_MAP.EVENT_TYPES

  const { Basket } = EVENTS_MAP.ENTITY_TYPES

  useAnalytics(CheckoutStarted, {
    entity: JSON.stringify({
      grandTotal: cart.grandTotal.raw,
      id: cart.id,
      lineItems: cart.lineItems,
      shipCharge: cart.shippingCharge.raw.withTax,
      shipTax: cart.shippingCharge.raw.tax,
      taxPercent: cart.taxPercent,
      tax: cart.grandTotal.raw.tax,
    }),
    promoCodes: JSON.stringify(cart.promotionsApplied),
    entityId: cart.id,
    entityName: PAGE_TYPE,
    entityType: Basket,
    eventType: CheckoutStarted,
  })

  useEffect(() => {
    fetchAddress()
  }, [])

  if (isLoggedIn) {
    return (
      <CheckoutForm
        cart={cart}
        addresses={userAddresses}
        defaultBillingAddress={defaultBillingAddress}
        defaultShippingAddress={defaultShippingAddress}
        user={user}
        getAddress={getAddress}
        fetchAddress={fetchAddress}
        config={config}
        location={location}
      />
    )
  }
  return (
    <CheckoutRouter
      setIsLoggedIn={setIsLoggedIn}
      handleGuestMail={handleGuestMail}
    />
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = cookie.parse(context.req.headers.cookie || '')
  let basketRef: any = cookies.basketId
  if (!basketRef) {
    basketRef = basketIdGenerator()
    context.res.setHeader('set-cookie', `basketId=${basketRef}`)
  }

  const response = await getCart()({
    basketId: basketRef,
    cookies: context.req.cookies,
  })

  return {
    props: { cart: response }, // will be passed to the page component as props
  }
}

const PAGE_TYPE = PAGE_TYPES['Checkout']

export default withDataLayer(Checkout, PAGE_TYPE, false)
