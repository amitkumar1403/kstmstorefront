import {
  Elements,
  useElements,
  useStripe,
  PaymentElement,
} from '@stripe/react-stripe-js'
import getStripe from '@components/utils/get-stripe'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  STRIPE_CHECKOUT_SESSION,
  UPDATE_ORDER_STATUS,
  NEXT_POST_PAYMENT_RESPONSE,
} from '@components/utils/constants'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { useUI, basketId as generateBasketId } from '@components/ui/context'
import Cookies from 'js-cookie'
import setSessionIdCookie from '@components/utils/setSessionId'
import cartHandler from '@components/services/cart'
import Router from 'next/router'
import { getItem } from '@components/utils/localStorage'
const { CheckoutConfirmation } = EVENTS_MAP.EVENT_TYPES
const { Order } = EVENTS_MAP.ENTITY_TYPES

function CheckoutForm({
  handlePayments,
  orderResponse,
  clientSecret,
  setPaymentIntent,
  orderModel,
}: any) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  const { cartItems, basketId, setBasketId, setCartItems, setOrderId } = useUI()
  const { associateCart } = cartHandler()

  const handleUserAfterPayment = async (paymentIntent: any) => {
    const orderResponseFromLocalStorage: any = getItem('orderResponse')
    const orderModelFromLocalStorage: any = getItem('orderModelPayment')

    const res: any = await axios.post(NEXT_POST_PAYMENT_RESPONSE, {
      model: orderModelFromLocalStorage,
      orderId: orderResponseFromLocalStorage.id,
    })

    const { orderNo, grandTotal } = orderResponseFromLocalStorage
    eventDispatcher(CheckoutConfirmation, {
      basketItemCount: cartItems.lineItems.length,
      basketTotal: grandTotal?.raw?.withTax,
      shippingCost: cartItems.shippingCharge?.raw?.withTax,
      promoCodes: cartItems.promotionsApplied,
      basketItems: JSON.stringify(
        cartItems.lineItems.map((i: any) => {
          return {
            categories: i.categoryItems,
            discountAmt: i.discount?.raw?.withTax,
            id: i.id,
            img: i.image,
            isSubscription: i.isSubscription,
            itemType: i.itemType,
            manufacturer: i.manufacturer || '',
            name: i.name,
            price: i.price?.raw?.withTax,
            productId: i.productId,
            qty: i.qty,
            rootManufacturer: i.rootManufacturer || '',
            stockCode: i.stockCode,
            subManufacturer: i.subManufacturer,
            tax: i.totalPrice?.raw?.withTax,
          }
        })
      ),
      entity: JSON.stringify({
        basketId: basketId,
        billingAddress: orderResponseFromLocalStorage.billingAddress,
        customerId: orderResponseFromLocalStorage.customerId,
        discount: orderResponseFromLocalStorage.discount?.raw?.withTax,
        grandTotal: grandTotal?.raw?.withTax,
        id: orderResponseFromLocalStorage.id,
        lineitems: orderResponseFromLocalStorage.items,
        orderNo: orderNo,
        paidAmount: paymentIntent.amount / 100,
        payments: [
          {
            methodName: 'stripe',
            paymentGateway: 'stripe',
            amount: paymentIntent.amount / 100,
          },
        ],
        promoCode: orderResponseFromLocalStorage.promotionsApplied,
        shipCharge: orderResponseFromLocalStorage.shippingCharge?.raw?.withTax,
        shippingAddress: orderResponseFromLocalStorage.shippingAddress,
        shippingMethod: orderResponseFromLocalStorage.shipping,
        status: paymentIntent.status,
        subTotal: orderResponseFromLocalStorage.subTotal?.raw?.withTax,
        tax: grandTotal?.raw?.withTax,
        taxPercent: orderResponseFromLocalStorage.taxPercent,
        timestamp: orderResponseFromLocalStorage.orderDate,
      }),
      entityId: orderResponseFromLocalStorage.id,
      entityName: orderNo,
      entityType: Order,
      eventType: CheckoutConfirmation,
    })
    Cookies.remove('sessionId')
    setSessionIdCookie()
    Cookies.remove('basketId')
    const generatedBasketId = generateBasketId()
    setBasketId(generatedBasketId)
    const userId = cartItems.userId
    const newCart = await associateCart(userId, generatedBasketId)
    setCartItems(newCart.data)
    setOrderId(orderResponseFromLocalStorage.id)
    Router.push('/thank-you')
  }
  useEffect(() => {
    if (!stripe) {
      return
    }

    const urlClientSecret: any = new URLSearchParams(
      window.location.search
    ).get('payment_intent_client_secret')

    if (!urlClientSecret || clientSecret) {
      return
    }

    setPaymentIntent(true)

    stripe
      .retrievePaymentIntent(urlClientSecret)
      .then(({ paymentIntent }: any) => {
        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Payment succeeded!')
            handleUserAfterPayment(paymentIntent)
            break
          case 'processing':
            setMessage('Your payment is processing.')
            break
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.')
            break
          default:
            setMessage('Something went wrong.')
            break
        }
      })
  }, [stripe])

  const handleSubmit = async () => {
    // Block native form submission.
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)
    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    // Use your card Element with other Stripe.js APIs
    const { error }: any = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: window.location.origin + Router.pathname,
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
    }
    setIsLoading(false)
  }

  return (
    <form id="payment-form">
      <PaymentElement id="payment-element" />
      <button
        disabled={isLoading || !stripe || !elements}
        type="button"
        onClick={handleSubmit}
        id="payment-submit"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="stripe-spinner" id="stripe-spinner"></div>
          ) : (
            'Pay now'
          )}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
}

export default function StripeWrapper(props: any) {
  const [clientSecret, setClientSecret] = useState('')

  const stripePromise = getStripe()

  const appearance = {
    theme: 'stripe',
  }

  const { cartItems } = useUI()
  useEffect(() => {
    const { orderNo, grandTotal } = props.orderResponse

    const fetchClientSecret = async () => {
      const client: any = await axios.post(STRIPE_CHECKOUT_SESSION, {
        amount: grandTotal.raw.withTax,
        user_email: cartItems.userEmail,
        orderNo: orderNo,
      })
      setClientSecret(client.data.clientSecret)
    }
    !props.isPaymentIntent && fetchClientSecret()
  }, [])

  const options: any = {
    clientSecret: clientSecret || props.isPaymentIntent,
    appearance,
  }

  return options.clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm {...props} />
    </Elements>
  ) : null
}
