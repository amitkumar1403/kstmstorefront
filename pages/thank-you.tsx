/* This example requires Tailwind CSS v2.0+ */
import { useEffect, useState } from 'react'
import { useUI } from '@components/ui/context'
import Link from 'next/link'
import axios from 'axios'
import { NEXT_GET_ORDER_DETAILS } from '@components/utils/constants'
const defaultModel: any = {}
import { LoadingDots } from '@components/ui'
import { removeItem } from '@components/utils/localStorage'
import {
  BTN_BACK_TO_HOME,
  GENERAL_ADDRESSES,
  GENERAL_BILLING_ADDRESS,
  GENERAL_DELIVERED_BY,
  GENERAL_ITEMS,
  GENERAL_ON_THE_WAY,
  GENERAL_ORDER_WILL_BE_WITH_YOU_SOON,
  GENERAL_PAYMENT,
  GENERAL_PAYMENT_METHOD,
  GENERAL_PRICE,
  GENERAL_QUANTITY,
  GENERAL_SHIPPING,
  GENERAL_SHIPPING_ADDRESS,
  GENERAL_SHIPPING_METHOD,
  GENERAL_SUMMARY,
  GENERAL_THANK_YOU,
  GENERAL_TOTAL,
  GENERAL_YOUR_ORDER,
  LOADING_YOUR_ORDERS,
  NO_ORDER_PROVIDED,
  SUBTOTAL_INCLUDING_TAX,
  YOUR_INFORMATION,
} from '@components/utils/textVariables'
import { ELEM_ATTR, ORDER_CONFIRMATION_AFTER_PROGRESS_BAR_ELEM_SELECTORS } from '@framework/content/use-content-snippet'

export default function OrderConfirmation() {
  const [order, setOrderData] = useState(defaultModel)
  const [isLoading, setIsLoading] = useState(true)
  const { setOrderId, orderId } = useUI()

  useEffect(() => {
    const fetchOrder = async () => {
      const { data }: any = await axios.post(NEXT_GET_ORDER_DETAILS, {
        id: orderId,
      })
      setOrderData(data.order)
      setIsLoading(false)
    }
    removeItem('orderResponse')
    removeItem('orderModelPayment')
    if (orderId) fetchOrder()
    if (!orderId) setIsLoading(false)
    return function cleanup() {
      setOrderId('')
    }
  }, [])

  if (isLoading) {
    return (
      <main className="px-4 pt-16 pb-24 bg-white sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
        <h1 className="w-full text-5xl font-extrabold text-center text-gray-600 uppercase tracking-light">
          {LOADING_YOUR_ORDERS}
        </h1>
        <div className="flex items-center justify-center w-full mt-10 text-gray-900">
          <LoadingDots />
        </div>
      </main>
    )
  }
  return (
    <>
      <main className="px-4 pt-6 pb-24 bg-gray-50 sm:px-6 sm:pt-6 lg:px-8 lg:py-2">
        <div className="max-w-3xl p-4 mx-auto bg-white rounded-md shadow-lg">
          <div className="max-w-xl">
            <h1 className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
              {order.orderNo ? GENERAL_THANK_YOU : null}
            </h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-black uppercase sm:text-3xl">
              {order.orderNo ? GENERAL_ON_THE_WAY : NO_ORDER_PROVIDED}
            </p>
            {order.orderNo ? (
              <p className="mt-2 text-black">
                {GENERAL_YOUR_ORDER}{' '}<span className='font-bold text-black'>{order.orderNo}</span>{' '}
                {GENERAL_ORDER_WILL_BE_WITH_YOU_SOON}
              </p>
            ) : null}
          </div>

          {order.orderNo ? (
            <section
              aria-labelledby="order-heading"
              className="mt-10 border-t border-gray-200"
            >
              <h2 id="order-heading" className="sr-only">
                {GENERAL_YOUR_ORDER}
              </h2>

              <h3 className="sr-only">{GENERAL_ITEMS}</h3>
              {order.items.map((product: any) => {
                let personalization = "";
                if (product?.customInfo1 != "") {
                  const message = JSON.parse(product?.customInfo1);
                  personalization = message?.formatted?.data?.Message;
                }

                return (
                  product?.name != "Personalization" &&
                  <div
                    key={product.id}
                    className="flex py-10 space-x-6 border-b border-gray-200"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="flex-none object-cover object-center w-20 h-20 bg-gray-100 rounded-lg sm:w-40 sm:h-40"
                    />
                    <div className="flex flex-col flex-auto">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          <Link href={`/${product.slug}`}>
                            <a>{product.name}</a>
                          </Link>
                        </h4>

                        <div
                          dangerouslySetInnerHTML={{
                            __html: product.shortDescription,
                          }}
                          className="mt-2 text-sm text-gray-500"
                        />
                        {personalization != "" &&
                          <>
                            <div className='mt-2 ml-2 font-semibold text-black'>personalization</div>
                            <div
                              className="mt-1 ml-2 text-sm text-gray-500"
                            >{personalization}</div>
                          </>
                        }

                      </div>
                      <div className="flex items-end flex-1 mt-6">
                        <dl className="flex space-x-4 text-sm divide-x divide-gray-200 sm:space-x-6">
                          <div className="flex">
                            <dt className="font-medium text-gray-900">
                              {GENERAL_QUANTITY}
                            </dt>
                            <dd className="ml-2 text-gray-700">{product.qty}</dd>
                          </div>
                          <div className="flex pl-4 sm:pl-6">
                            <dt className="font-medium text-gray-900">
                              {GENERAL_PRICE}
                            </dt>
                            <dd className="ml-2 text-gray-700">
                              {product.price.formatted.withTax}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="sm:ml-40 sm:pl-6">
                <h3 className="sr-only">{YOUR_INFORMATION}</h3>

                <h4 className="sr-only">{GENERAL_ADDRESSES}</h4>
                <dl className="grid grid-cols-2 py-10 text-sm gap-x-6">
                  <div>
                    <dt className="font-medium text-gray-900">
                      {GENERAL_SHIPPING_ADDRESS}
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <address className="not-italic">
                        <span className="block">{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</span>
                        <span className="block">{`${order.shippingAddress.phoneNo}`}</span>
                        <span className="block">{`${order.shippingAddress.address1}`}</span>
                        <span className="block">{`${order.shippingAddress.address2}`}</span>
                        <span className="block">{`${order.shippingAddress.city} ${order.shippingAddress.countryCode} ${order.shippingAddress.postCode}`}</span>
                      </address>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900">
                      {GENERAL_BILLING_ADDRESS}
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <address className="not-italic">
                        <span className="block">{`${order.billingAddress.firstName} ${order.billingAddress.lastName}`}</span>
                        <span className="block">{`${order.shippingAddress.phoneNo}`}</span>
                        <span className="block">{`${order.billingAddress.address1}`}</span>
                        <span className="block">{`${order.billingAddress.address2}`}</span>
                        <span className="block">{`${order.billingAddress.city} ${order.billingAddress.countryCode} ${order.billingAddress.postCode}`}</span>
                      </address>
                    </dd>
                  </div>
                </dl>

                <h4 className="sr-only">{GENERAL_PAYMENT}</h4>
                <dl className="grid grid-cols-2 py-10 text-sm border-t border-gray-200 gap-x-6">
                  {order.payments && (
                    <div>
                      <dt className="font-medium text-gray-900">
                        {GENERAL_PAYMENT_METHOD}
                      </dt>
                      <dd className="mt-2 text-gray-700">
                        <p>{order.payments[0]?.paymentMethod}</p>
                        {/* <p>{order.payments[0]?.paymentGateway}</p> */}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-medium text-gray-900">
                      {GENERAL_SHIPPING_METHOD}
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <p>{order.shipping.displayName}</p>
                      {/* <p>
                        {GENERAL_DELIVERED_BY}:{' '}
                        {new Date(
                          order.shipping.expectedDeliveryDate
                        ).toLocaleDateString()}
                      </p> */}
                    </dd>
                  </div>
                </dl>

                <h3 className="sr-only">{GENERAL_SUMMARY}</h3>

                <dl className="pt-10 space-y-6 text-sm border-t border-gray-200">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900">
                      {SUBTOTAL_INCLUDING_TAX}
                    </dt>
                    <dd className="text-gray-700">
                      {order.subTotal?.formatted?.withTax}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900">
                      {GENERAL_SHIPPING}
                    </dt>
                    <dd className="text-gray-700">
                      {order.shippingCharge.formatted.withTax}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900">{GENERAL_TOTAL}</dt>
                    <dd className="text-gray-900">
                      {order.grandTotal?.formatted?.withTax}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          ) : null}
          <div className="max-w-xl">
            <Link href={`/`} passHref>
              <a
                href="/"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {BTN_BACK_TO_HOME}
              </a>
            </Link>
          </div>
        </div>
      </main>

      {/* Placeholder for order confirmation after progress bar snippet */}
      <div className={`${ELEM_ATTR}${ORDER_CONFIRMATION_AFTER_PROGRESS_BAR_ELEM_SELECTORS[0]}`}></div>
    </>
  );
}
