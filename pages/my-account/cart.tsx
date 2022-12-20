import dynamic from 'next/dynamic'
import { XIcon as XIconSolid } from '@heroicons/react/solid'
import { Layout } from '@components/common'
import { GetServerSideProps } from 'next'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useCart as getCart } from '@framework/cart'
import cookie from 'cookie'
import { basketId as basketIdGenerator } from '@components/ui/context'
import Link from 'next/link'
import { useUI } from '@components/ui/context'
import cartHandler from '@components/services/cart'
import { PlusSmIcon, MinusSmIcon } from '@heroicons/react/outline'
const  PromotionInput  = dynamic(() => import('../components/cart/PromotionInput'));
import { useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { getShippingPlans } from '@framework/shipping'
import {
  BTN_CHECKOUT_NOW,
  BTN_PLACE_ORDER,
  GENERAL_CATALOG,
  GENERAL_DISCOUNT,
  GENERAL_ORDER_SUMMARY,
  GENERAL_PRICE_LABEL_RRP,
  GENERAL_REMOVE,
  GENERAL_SHIPPING,
  GENERAL_SHOPPING_CART,
  GENERAL_TOTAL,
  IMG_PLACEHOLDER,
  ITEMS_IN_YOUR_CART,
  SUBTOTAL_INCLUDING_TAX,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'

function Cart({ cart }: any) {
  const { setCartItems, cartItems, basketId } = useUI()
  const { addToCart } = cartHandler()

  const mapShippingPlansToItems = (plans?: any, items?: any) => {
    const itemsClone = [...items]
    return plans.reduce((acc: any, obj: any) => {
      acc?.forEach((cartItem?: any) => {
        const foundShippingPlan = obj.Items.find((item: any) => {
          return (
            item.ProductId.toLowerCase() === cartItem.productId.toLowerCase()
          )
        })
        if (foundShippingPlan) {
          cartItem.shippingPlan = obj
        }
      })
      return acc
    }, itemsClone)
  }

  const fetchShippingPlans = async () => {
    const shippingMethodItem: any = cart.shippingMethods.find(
      (method: any) => method.id === cart.shippingMethodId
    )

    const model = {
      BasketId: basketId,
      OrderId: '00000000-0000-0000-0000-000000000000',
      PostCode: '',
      ShippingMethodType: shippingMethodItem.type,
      ShippingMethodId: cart?.shippingMethodId,
      ShippingMethodName: shippingMethodItem.displayName,
      ShippingMethodCode: shippingMethodItem.shippingCode,
      DeliveryItems: cart?.lineItems?.map((item: any) => {
        return {
          BasketLineId: Number(item.id),
          OrderLineRecordId: '00000000-0000-0000-0000-000000000000',
          ProductId: item.productId,
          ParentProductId: item.parentProductId,
          StockCode: item.stockCode,
          Qty: item.qty,
          PoolCode: item.poolCode || null,
        }
      }),
      AllowPartialOrderDelivery: true,
      AllowPartialLineDelivery: true,
      PickupStoreId: '00000000-0000-0000-0000-000000000000',
      RefStoreId: null,
      PrimaryInventoryPool: 'PrimaryInvPool',
      SecondaryInventoryPool: 'PrimaryInvPool',
      IsEditOrder: false,
      OrderNo: null,
      DeliveryCenter: null,
    }
    //const response = await axios.post(NEXT_SHIPPING_PLANS, { model })
    const shippingPlans = await getShippingPlans()({ model: model });
    //console.log(JSON.stringify(shippingPlans));

    setCartItems({
      ...cart,
      lineItems: mapShippingPlansToItems(shippingPlans, cart.lineItems),
    })
  }

  useEffect(() => {
    async function loadShippingPlans() {
      await fetchShippingPlans();
    }

    if (cart?.shippingMethods.length > 0) {
      loadShippingPlans()
    }
    else {
      setCartItems(cart)
    }
  }, [])

  const handleItem = (product: any, type = 'increase') => {
    const asyncHandleItem = async () => {
      let data: any = {
        basketId,
        productId: product.id,
        stockCode: product.stockCode,
        manualUnitPrice: product.manualUnitPrice,
        displayOrder: product.displayOrderta,
        qty: -1,
      }
      if (type === 'increase') {
        data.qty = 1
      }
      if (type === 'delete') {
        data.qty = 0
        userCart.lineItems = userCart.lineItems.filter(
          (item: { id: any }) => item.id !== product.id
        )
      }
      try {
        const item = await addToCart(data)
        setCartItems(item)
      } catch (error) {
        console.log(error)
      }
    }
    asyncHandleItem()
  }

  const userCart = cartItems
  const isEmpty: boolean = userCart?.lineItems?.length === 0

  return (
    <div className="bg-white w-full sm:w-3/5 mx-auto">
      <main className="sm:pt-6 pt-6 sm:pb-16 pb-12 sm:pb-0 px-4 sm:px-0 lg:px-0">
        <h1 className="text-2xl font-semibold tracking-tight text-black sm:text-2xl uppercase relative">
          {GENERAL_SHOPPING_CART} <span className='font-semibold text-sm text-gray-400 absolute top-2 pl-2'>{'- '}{userCart.lineItems.length} Items added</span>
        </h1>
        {!isEmpty && (
          <form className="relative sm:mt-6 mt-4 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                {ITEMS_IN_YOUR_CART}
              </h2>

              <ul
                role="list"
                className=""
              >
                {userCart.lineItems?.map((product: any, productIdx: number) => (
                  <li key={productIdx} className="flex p-2 sm:p-3 border border-gray-200 mb-2 rounded-md">
                    <div className="flex-shrink-0">
                      <Image
                        layout="fixed"
                        width={140}
                        height={180}
                        src={generateUri(product.image, "h=200&fm=webp") || IMG_PLACEHOLDER} 
                        alt={product.name}
                        className="w-16 h-20 rounded-sm object-center object-cover sm:w-48 sm:h-48 image"
                      />                     
                    </div>
                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                      <div className="relative sm:pr-9 pr-6 flex justify-between sm:pr-0 h-full">
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex justify-between flex-col">
                              <h3 className="sm:py-0 py-0 sm:text-md text-md font-semibold text-black">
                                {product.brand}
                              </h3>
                              <h3 className="sm:text-md text-md my-2 sm:my-1">
                                <Link href={`/${product.slug}`}>
                                  <a
                                    href={product.slug}
                                    className="font-normal text-gray-700 hover:text-gray-800"
                                  >
                                    {product.name}
                                  </a>
                                </Link>
                              </h3>
                            </div>
                            <div className="mt-2 sm:mt-2 sm:pr-0 pl-0 pr-0">
                              <div className="border sm:px-4 px-2 text-gray-900 flex flex-row sm:w-2/6 w-4/6">
                                <MinusSmIcon
                                  onClick={() => handleItem(product, 'decrease')}
                                  className="w-4 cursor-pointer"
                                />
                                <span className="text-md px-4 sm:py-1  py-1">
                                  {product.qty}
                                </span>
                                <PlusSmIcon
                                  className="w-4 cursor-pointer"
                                  onClick={() => handleItem(product, 'increase')}
                                />
                              </div>
                            </div>
                            <p className="mt-1 text-md sm:font-medium font-bold text-black">
                              {product.price?.formatted?.withTax}
                              {product.listPrice?.raw.withTax > 0 && product.listPrice?.raw.withTax != product.price?.raw?.withTax ? (
                                <span className="px-2 text-sm line-through text-red-400">
                                  {GENERAL_PRICE_LABEL_RRP}{' '}
                                  {product.listPrice.formatted.withTax}
                                </span>
                              ) : null}
                            </p>
                            {product.children?.map(
                              (child: any, idx: number) => {
                                return (
                                  <div
                                    className="flex mt-10"
                                    key={'child' + idx}
                                  >
                                    <div className="flex-shrink-0 w-12 h-12 border border-gray-200 rounded-md overflow-hidden">
                                      <img
                                        src={child.image}
                                        alt={child.name}
                                        className="w-full h-full object-center object-cover"
                                      />
                                    </div>
                                    <div className="flex ml-5 justify-between font-medium text-gray-900">
                                      <Link href={`/${child.slug}`}>
                                        {child.name}
                                      </Link>
                                      <p className="ml-4">
                                        {child.price?.formatted?.withTax > 0 ? child.price?.formatted?.withTax : ""}
                                      </p>
                                      {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                    </div>
                                    {
                                      !child.parentProductId ? (
                                        <div className="flex-1 flex items-center justify-end text-sm">
                                          {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleItem(child, 'delete')
                                            }
                                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                                          >
                                            <span className="sr-only">
                                              {GENERAL_REMOVE}
                                            </span>
                                            <XIconSolid
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="mt-0 sm:mt-0 sm:pr-9 pl-2 pr-0">
                                          <div className="border sm:px-4 px-2 text-gray-900 flex flex-row">
                                            <span className="text-md px-2 sm:py-2 py-1">
                                              {child.qty}
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    }
                                  </div>
                                )
                              }
                            )}
                          </div>
                          <p className="py-5 text-sm font-medium text-gray-900 sm:block hidden">
                            {product.shippingPlan?.shippingSpeed}
                          </p>
                        </div>
                        
                        <div className="absolute top-0 right-0">
                          <button
                            type="button"
                            onClick={() => handleItem(product, 'delete')}
                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">{GENERAL_REMOVE}</span>
                            <XIconSolid
                              className="sm:h-5 sm:w-5 h-4 w-4 text-black mt-2"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col sm:hidden block">
                        <p className="pt-3 sm:text-sm text-xs font-bold text-gray-700">
                          {product.shippingPlan?.shippingSpeed}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="md:sticky top-20 sm:mt-0 mt-4 bg-white border-l rounded-sm px-4 py-0 sm:px-6 lg:px-6 lg:mt-0 lg:col-span-5"
            >
              <h2
                id="summary-heading"
                className="text-xl font-semibold text-black uppercase"
              >
                {GENERAL_ORDER_SUMMARY}
              </h2>
              <div className='sm:p-3 p-3 mt-6 border '>
                <PromotionInput />
              </div>
              <dl className="mt-6 sm:space-y-2 space-y-2">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">
                    {SUBTOTAL_INCLUDING_TAX}
                  </dt>
                  <dd className="text-md font-semibold text-black">
                    {cartItems.subTotal?.formatted?.withTax}
                  </dd>
                </div>
                <div className="sm:pt-1 pt-2 flex items-center justify-between">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>{GENERAL_SHIPPING}</span>
                  </dt>
                  <dd className="text-md font-semibold text-black">
                    {cartItems.shippingCharge?.formatted?.withTax}
                  </dd>
                </div>
                <div className="sm:pt-2 pt-2 flex items-center justify-between">
                  {userCart.promotionsApplied?.length > 0 && (
                    <>
                      <dt className="flex items-center text-sm text-gray-600">
                        <span>{GENERAL_DISCOUNT}</span>
                      </dt>
                      <dd className="text-md font-semibold text-red-500">
                        <p>{'-'}{cartItems.discount?.formatted?.withTax}</p>
                      </dd>
                    </>
                  )}
                </div>                

                <div className="border-t pt-2 text-gray-900 flex items-center justify-between">
                  <dt className="font-bold text-lg text-black">{GENERAL_TOTAL}</dt>
                  <dd className="font-bold text-xl text-black">
                    {cartItems.grandTotal?.formatted?.withTax}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <Link href="/checkout">
                  <a
                    type="submit"
                    className="text-center w-full bg-black border border-transparent rounded-sm uppercase shadow-sm py-3 px-4 font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black"
                  >
                    {BTN_PLACE_ORDER}
                  </a>
                </Link>
              </div>
            </section>
          </form>
        )}
        {isEmpty && (
          <div className="py-10 text-gray-900 h-full w-full flex flex-col justify-center items-center">
            Uh-oh, you don't have any items in here
            <Link href="/search">
              <button
                type="button"
                className="text-indigo-600 font-medium hover:text-indigo-500"
              >
                {GENERAL_CATALOG}
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
Cart.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Checkout']

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

export default withDataLayer(Cart, PAGE_TYPE)
