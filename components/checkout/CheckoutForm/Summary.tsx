import Link from 'next/link'
import Image from 'next/legacy/image';
import { TrashIcon } from '@heroicons/react/solid'
import { PlusSmIcon, MinusSmIcon } from '@heroicons/react/outline'
import PromotionInput from '@components/cart/PromotionInput'
import {
  GENERAL_CONFIRM_ORDER,
  GENERAL_DISCOUNT,
  GENERAL_ORDER_SUMMARY,
  GENERAL_PRICE_LABEL_RRP,
  GENERAL_SHIPPING,
  GENERAL_TOTAL,
  IMG_PLACEHOLDER,
  ITEMS_IN_YOUR_CART,
  SUBTOTAL_INCLUDING_TAX
} from '@components/utils/textVariables'
let PERSONALISED_TEXT = ""
let PERSONALIZATION = ""

export default function Summary({
  cart,
  handleItem,
  confirmOrder,
  isShippingDisabled,
}: any) {
  return (
    <div className="top-0 mt-0 lg:mt-0 md:sticky">
      <div className="mt-0 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="px-5 py-4 mb-3 text-lg font-bold text-black uppercase bg-gray-200 border-b rounded-t-md">{GENERAL_ORDER_SUMMARY}</h2>
        <h3 className="sr-only">{ITEMS_IN_YOUR_CART}</h3>
        <ul role="list" className="divide-y divide-gray-200">
          {cart.lineItems?.map((product: any) => {
            let personalization = "";
            if (product?.customInfo1 != "") {
              const message = JSON.parse(product?.customInfo1);
              personalization = message?.formatted?.data?.Message;
            }
            return (

              <li key={product.id} className="flex px-4 py-3 sm:px-6">
                {cart.lineItems.map((val: any) => {
                  if (val.customInfo1 !== "") {
                    PERSONALISED_TEXT = personalization;
                  }
                  if (val.name !== "") {
                    PERSONALIZATION = val.name;
                    console.log("fur " + JSON.stringify(cart.lineItems))
                  }
                })}
                <div className="flex-shrink-0">
                  <Image
                    width={80}
                    height={100}
                    src={`${product.image}` || IMG_PLACEHOLDER}
                    alt={product.name}
                    style={{
                      maxWidth: "100%",
                      height: "auto"
                    }}
                    className="w-20 rounded-md"
                  ></Image>
                </div>

                <div className="flex flex-col flex-1 ml-6">
                  <div className="flex">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm">
                        <span className="block font-semibold text-black text-md">
                          {product.brand}
                        </span>
                        <Link href={`/${product.slug}`} className="block font-normal text-gray-700 hover:text-gray-800">
                            {product.name}
                        </Link>
                      </h4>
                      <p className="mt-1 text-sm font-bold text-black">
                        {product.price?.formatted?.withTax}
                        {product.listPrice?.raw.withTax > 0 && product.listPrice?.raw.withTax != product.price?.raw?.withTax ? (
                          <span className="px-2 text-sm font-normal text-red-400 line-through">
                            {GENERAL_PRICE_LABEL_RRP}{' '}
                            {product.listPrice.formatted.withTax}
                          </span>
                        ) : null}
                      </p>
                      <div>
                        { }
                      </div>
                      {product?.children?.map((child: any, childId: number) => (
                        <>
                          <div className='flex justify-between' key={childId}>
                            <div>
                              <p className='font-semibold text-black text-md'>Personalization</p>
                            </div>
                            <label>{child?.price?.formatted?.withTax}</label>
                          </div>
                          <label>{PERSONALISED_TEXT}</label>
                        </>
                      ))}

                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <div className='p-3 mt-2 border sm:p-3 '>
          <PromotionInput />
        </div>
        <dl className="px-4 py-2 space-y-2 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-900">
              {' '}
              {SUBTOTAL_INCLUDING_TAX}
            </dt>
            <dd className="font-bold text-black text-md">
              {cart.subTotal?.formatted?.withTax}
            </dd>
          </div>
          {isShippingDisabled ? null : (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-900">{GENERAL_SHIPPING}</dt>
              <dd className="font-bold text-black text-md">
                {cart.shippingCharge?.formatted?.withTax}
              </dd>
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            {cart.promotionsApplied?.length > 0 && (
              <>
                <dt className="text-sm text-gray-900">
                  <span>{GENERAL_DISCOUNT}</span>
                </dt>
                <dd className="font-bold text-red-500 text-md">
                  <p>{'-'}{cart.discount?.formatted?.withTax}</p>
                </dd>
              </>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <dt className="text-xl font-bold text-black">{GENERAL_TOTAL}</dt>
            <dd className="text-2xl font-bold text-black">
              {cart.grandTotal?.formatted?.withTax}
            </dd>
          </div>
        </dl>

        {/* <div className="px-4 py-6 border-t border-gray-200 sm:px-6">
          <button
            type="button"
            onClick={confirmOrder}
            className="w-full px-4 py-3 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
          >
            {GENERAL_CONFIRM_ORDER}
          </button>
        </div> */}
      </div>
    </div>
  )
}
