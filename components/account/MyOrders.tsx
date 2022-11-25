import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  NEXT_GET_ORDERS,
  NEXT_CREATE_RETURN_DATA,
} from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Link from 'next/link'
import cartHandler from '@components/services/cart'
import {
  MY_ORDERS_TEXT,
  GENERAL_RECENT_ORDERS,
  GENERAL_ORDER_NUMBER,
  GENERAL_DATE_PLACED,
  GENERAL_TRACKING_LINK,
  GENERAL_VIEW_PRODUCT,
  GENERAL_ADD_TO_BASKET,
  ORDER_HISTORY_TITLE,
  GENERAL_TOTAL,
  GENERAL_ORDER_PLACED_ON,
  GENERAL_CREATE_RETURN,
} from '@components/utils/textVariables'
import ReturnModal from '@components/returns/Modal'

export default function MyOrders() {
  const [data, setData] = useState([])
  const [productIdsInReturn, setProductIdsInReturn] = useState([''])
  const [returnData, setReturnData] = useState({ product: {}, order: {} })
  const { user, basketId, setCartItems, openCart } = useUI()

  useEffect(() => {
    const fetchOrders = async () => {
      const response: any = await axios.post(NEXT_GET_ORDERS, {
        id: user.userId,
        hasMembership: user.hasMembership,
      })

      setData(response.data)
    }
    fetchOrders()
  }, [])

  const handleCreateReturn = (product: any, order: any) => {
    setReturnData({ product: product, order: order })
  }

  const handlePostReturn = async (data: any) => {
    const returnInfo: any = returnData
    const model = {
      orderId: returnInfo.order.id,
      lineItems: [
        {
          productId: returnInfo.product.productId,
          stockCode: returnInfo.product.stockCode,
          returnQtyRequested: returnInfo.product.qty,
          returnQtyRecd: 0,
          reasonForReturnId: data.reasonsForReturn,
          requiredActionId: data.requiredActions,
          comment: data.comment,
        },
      ],
      faultReason: data.reasonsForReturn,
      uploadFileUrls: ['string'],
    }
    try {
      const responseData: any = await axios.post(NEXT_CREATE_RETURN_DATA, {
        model,
      })
      setProductIdsInReturn([
        ...productIdsInReturn,
        ...responseData.data.response.result.lineItems.map(
          (item: any) => item.productId
        ),
      ])
      return true
    } catch (error) {
      alert('Woops! Could not create a return')
      console.log(error)
    }
  }

  const handleClose = () => setReturnData({ product: {}, order: {} })
  const handleAddToCart = (product: any) => {
    cartHandler()
      .addToCart(
        {
          basketId,
          productId: product.recordId,
          qty: product.qty,
          manualUnitPrice: product.price,
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
                withTax: product.price,
              },
            },
            stockCode: product.stockCode,
            recordId: product.id,
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
              {ORDER_HISTORY_TITLE}
            </h1>
            <p className="mt-2 text-sm text-gray-500">{MY_ORDERS_TEXT}</p>
          </div>
          <ReturnModal
            handlePostReturn={handlePostReturn}
            handleClose={handleClose}
            returnData={returnData}
          />
          <section aria-labelledby="recent-heading" className="mt-16">
            <h2 id="recent-heading" className="sr-only">
              {GENERAL_RECENT_ORDERS}
            </h2>

            <div className="space-y-16 sm:space-y-24">
              {data.map((order: any) => (
                <div key={order.orderNo}>
                  <h3 className="sr-only">
                    {GENERAL_ORDER_PLACED_ON}{' '}
                    <time dateTime={order.orderDate}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </time>
                  </h3>
                  <div className="bg-gray-50 px-4 py-8 sm:rounded-lg sm:p-8 md:flex md:items-center md:justify-between md:space-x-6 lg:space-x-10">
                    <dl className="divide-y divide-gray-200 space-y-6 text-sm text-gray-600 flex-auto md:divide-y-0 md:space-y-0 md:grid md:grid-cols-5 md:gap-x-10 w-full lg:flex-none lg:gap-x-10">
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-gray-900">
                          {GENERAL_ORDER_NUMBER}
                        </dt>
                        <dd className="md:mt-1">{order.orderNo}</dd>
                      </div>
                      <div className="flex justify-between pt-4 md:block md:pt-0">
                        <dt className="font-medium text-gray-900">
                          {GENERAL_DATE_PLACED}
                        </dt>
                        <dd className="md:mt-1">
                          <time dateTime={order.orderDate}>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </time>
                        </dd>
                      </div>
                      <div className="flex justify-between pt-4 font-medium text-gray-900 md:block md:pt-0">
                        <dt>{GENERAL_TOTAL}</dt>
                        <dd className="md:mt-1">
                          {order?.subTotal?.formatted?.withTax}
                        </dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-gray-900">Status</dt>
                        <dd className="md:mt-1">{order.orderStatus}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-gray-900">Tracking</dt>
                        {/* <dd className="md:mt-1">{order.orderStatus}</dd> */}
                        <a
                          href={order.trackingLink}
                          className="md:mt-1 text-indigo-600 hover:indigo-500"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {GENERAL_TRACKING_LINK}
                        </a>
                      </div>
                    </dl>
                  </div>
                  <div className="mt-6 flow-root px-4 sm:mt-10 sm:px-0">
                    <div className="-my-6 divide-y divide-gray-200 sm:-my-10">
                      {order.itemsBasic.map((product: any) => (
                        <div key={product.id} className="flex py-6 sm:py-10">
                          <div className="min-w-0 flex-1 lg:flex lg:flex-col">
                            <div className="lg:flex-1">
                              <div className="sm:flex">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {product?.name}
                                  </h4>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: product.shortDescription,
                                    }}
                                    className="hidden mt-2 text-sm text-gray-500 sm:block"
                                  />
                                </div>
                                <p className="mt-1 font-medium text-gray-900 sm:mt-0 sm:ml-6">
                                  {product.price?.formatted?.withTax}
                                </p>
                              </div>
                              <div className="mt-2 flex text-sm font-medium sm:mt-4">
                                <Link href={`/${product.slug || '#'}`}>
                                  <a
                                    href={product.slug || '#'}
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    {GENERAL_VIEW_PRODUCT}
                                  </a>
                                </Link>
                                <div className="border-l border-gray-200 ml-4 pl-4 sm:ml-6 sm:pl-6">
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className="text-indigo-600 hover:text-indigo-500"
                                  >
                                    {GENERAL_ADD_TO_BASKET}
                                  </button>
                                </div>
                                {productIdsInReturn.includes(
                                  product.productId
                                ) ? (
                                  <div className="border-l border-gray-200 ml-4 pl-4 sm:ml-6 sm:pl-6">
                                    <button
                                      type="button"
                                      className="text-indigo-600 hover:text-indigo-500"
                                    >
                                      Return is created
                                    </button>
                                  </div>
                                ) : (
                                  <div className="border-l border-gray-200 ml-4 pl-4 sm:ml-6 sm:pl-6">
                                    <button
                                      onClick={() =>
                                        handleCreateReturn(product, order)
                                      }
                                      type="button"
                                      className="text-indigo-600 hover:text-indigo-500"
                                    >
                                      {product.shippedQty < product.qty
                                        ? 'Cancel'
                                        : GENERAL_CREATE_RETURN}
                                    </button>
                                  </div>
                                )}
                              </div>
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
