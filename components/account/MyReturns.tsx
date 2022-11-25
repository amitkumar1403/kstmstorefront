import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import {
  GENERAL_RECENT_ORDERS,
  RETURN_ORDER_TITLE,
  RETURN_ORDER_TEXT,
  GENERAL_ORDER_NUMBER,
  GENERAL_ORDER_PLACED_ON,
  GENERAL_DATE_PLACED,
  GENERAL_VIEW_PRODUCT,
  GENERAL_REFUND_AMOUNT,
  GENERAL_ADD_TO_BASKET,
  GENERAL_RETURN_NUMBER,
} from '@components/utils/textVariables'
import { NEXT_GET_RETURNS } from '@components/utils/constants'
import { useUI } from '@components/ui'
import Link from 'next/link'
import cartHandler from '@components/services/cart'

export default function MyReturns() {
  const { user, basketId, setCartItems, openCart } = useUI()

  const [returns, setReturns] = useState([])

  const fetchReturns = async () => {
    try {
      const { data }: any = await axios.post(NEXT_GET_RETURNS, {
        userId: user.userId,
      })
      setReturns(data.response.result)
    } catch (error) {
      alert('Woops! Error fetching returns')
      console.log(error)
    }
  }
  useEffect(() => {
    fetchReturns()
  }, [])

  const handleAddToCart = (product: any) => {
    cartHandler()
      .addToCart(
        {
          basketId,
          productId: product.recordId,
          qty: product.orderQty,
          manualUnitPrice: product.price?.raw?.withTax,
          stockCode: product.stockCode,
          userId: user.userId,
          isAssociated: user.isAssociated,
        },
        'ADD',
        {
          product: {
            name: product.name,
            price: {
              raw: {
                withTax: product.price.raw.withTax,
              },
            },
            stockCode: product.stockCode,
            recordId: product.recordId,
          },
        }
      )
      .then((response: any) => {
        setCartItems(response)
        openCart()
      })
      .catch((err: any) => console.log('error', err))
  }

  return (
    <div className="bg-white">
      {/* Mobile menu */}

      <main className="sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {RETURN_ORDER_TITLE}
            </h1>
            <p className="mt-2 text-sm text-gray-500">{RETURN_ORDER_TEXT}</p>
          </div>

          <section aria-labelledby="recent-heading" className="mt-16">
            <h2 id="recent-heading" className="sr-only">
              {GENERAL_RECENT_ORDERS}
            </h2>

            <div className="space-y-16 sm:space-y-24">
              {returns.map((order: any) => (
                <div key={order.number}>
                  <h3 className="sr-only">
                    {GENERAL_ORDER_PLACED_ON}{' '}
                    <time dateTime={order.returnDate}>
                      {new Date(order.returnDate).toDateString()}
                    </time>
                  </h3>

                  <div className="bg-gray-50 px-4 py-6 sm:rounded-lg sm:p-6 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-8">
                    <dl className="divide-y divide-gray-200 space-y-4 text-sm text-gray-600 flex-auto md:divide-y-0 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-6 lg:w-full lg:flex-none lg:gap-x-8">
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-gray-900">
                          {GENERAL_RETURN_NUMBER}
                        </dt>
                        <dd className="md:mt-1">{order.returnNo}</dd>
                      </div>
                      <div className="flex justify-between pt-4 md:block md:pt-0">
                        <dt className="font-medium text-gray-900">
                          {GENERAL_DATE_PLACED}
                        </dt>
                        <dd className="md:mt-1">
                          <time dateTime={order.returnDate}>
                            {new Date(order.returnDate).toDateString()}
                          </time>
                        </dd>
                      </div>
                      <div className="flex justify-between pt-4 font-medium text-gray-900 md:block md:pt-0">
                        <dt>{GENERAL_REFUND_AMOUNT}</dt>
                        <dd className="md:mt-1">
                          {order.refundAmount?.formatted?.withTax}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 flow-root px-4 sm:mt-10 sm:px-0">
                    <div className="-my-6 divide-y divide-gray-200 sm:-my-10">
                      {order.lineItems.map((product: any) => (
                        <div key={product.id} className="flex py-6 sm:py-10">
                          <div className="min-w-0 flex-1 lg:flex lg:flex-col">
                            <div className="lg:flex-1">
                              <div className="sm:flex">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {product.name}
                                  </h4>
                                </div>
                                <p className="mt-1 font-medium text-gray-900 sm:mt-0 sm:ml-6">
                                  {product.price?.formatted?.withTax}
                                </p>
                              </div>
                              <div className="mt-2 flex text-sm font-medium sm:mt-4">
                                <Link href={`/${product.slug}`} passHref>
                                  <a className="text-indigo-600 hover:text-indigo-500">
                                    {GENERAL_VIEW_PRODUCT}
                                  </a>
                                </Link>
                                <div className="border-l border-gray-200 ml-4 pl-4 sm:ml-6 sm:pl-6">
                                  <div className="border-l border-gray-200 ml-4 pl-4 sm:ml-6 sm:pl-6">
                                    <button
                                      onClick={() => handleAddToCart(product)}
                                      className="text-indigo-600 hover:text-indigo-500"
                                    >
                                      {GENERAL_ADD_TO_BASKET}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 font-medium">
                              <p className={'text-gray-500'}>
                                {order.returnStatusLabel}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0 sm:m-0 sm:mr-6 sm:order-first">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="col-start-2 col-end-3 sm:col-start-1 sm:row-start-1 sm:row-span-2 w-20 h-20 rounded-lg object-center object-cover sm:w-40 sm:h-40 lg:w-52 lg:h-52"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
