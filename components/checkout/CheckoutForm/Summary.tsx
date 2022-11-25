import Link from 'next/link'
import Image from 'next/image'
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

export default function Summary({
  cart,
  handleItem,
  confirmOrder,
  isShippingDisabled,
}: any) {
  return (
    <div className="mt-0 lg:mt-0 md:sticky top-0">
      <div className="mt-0 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-lg px-5 uppercase font-bold text-black mb-3 border-b py-4 rounded-t-md bg-gray-200">{GENERAL_ORDER_SUMMARY}</h2>
        <h3 className="sr-only">{ITEMS_IN_YOUR_CART}</h3>
        <ul role="list" className="divide-y divide-gray-200">
          {cart.lineItems?.map((product: any) => (
            <li key={product.id} className="flex py-3 px-4 sm:px-6">
              <div className="flex-shrink-0">
                <Image
                  layout='fixed'
                  width={80}
                  height={100}
                  src={`${product.image}` || IMG_PLACEHOLDER}
                  alt={product.name}
                  className="w-20 rounded-md"
                ></Image>
              </div>

              <div className="ml-6 flex-1 flex flex-col">
                <div className="flex">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm">
                      <span className="text-md font-semibold text-black block">
                        {product.brand}
                      </span>
                      <Link href={`/${product.slug}`}>
                        <a className="font-normal text-gray-700 hover:text-gray-800 block">
                          {product.name}
                        </a>
                      </Link>
                    </h4>
                    <p className="mt-1 text-sm font-bold text-black">
                      {product.price?.formatted?.withTax}
                        {product.listPrice?.raw.withTax > 0 && product.listPrice?.raw.withTax != product.price?.raw?.withTax ? (
                          <span className="px-2 text-sm line-through font-normal text-red-400">
                            {GENERAL_PRICE_LABEL_RRP}{' '}
                            {product.listPrice.formatted.withTax}
                          </span>
                        ) : null}
                    </p>
                  </div>
                </div>               
              </div>
            </li>
          ))}
        </ul>
        <div className='sm:p-3 p-3 mt-2 border '>
            <PromotionInput />
          </div>
        <dl className="border-t border-gray-200 py-2 px-4 space-y-2 sm:px-6">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-900">
              {' '}
              {SUBTOTAL_INCLUDING_TAX}
            </dt>
            <dd className="text-md font-bold text-black">
              {cart.subTotal?.formatted?.withTax}
            </dd>
          </div>
          {isShippingDisabled ? null : (
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-900">{GENERAL_SHIPPING}</dt>
              <dd className="text-md font-bold text-black">
                {cart.shippingCharge?.formatted?.withTax}
              </dd>
            </div>
          )}
          <div className="pt-2 flex items-center justify-between">
            {cart.promotionsApplied?.length > 0 && (
              <>
                <dt className="text-sm text-gray-900">
                  <span>{GENERAL_DISCOUNT}</span>
                </dt>
                <dd className="text-md font-bold text-red-500">
                  <p>{'-'}{cart.discount?.formatted?.withTax}</p>
                </dd>
              </>
            )}
          </div>          

          <div className="border-t pt-3 flex items-center justify-between">
            <dt className="text-xl font-bold text-black">{GENERAL_TOTAL}</dt>
            <dd className="text-2xl font-bold text-black">
              {cart.grandTotal?.formatted?.withTax}
            </dd>
          </div>
        </dl>

        {/* <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
          <button
            type="button"
            onClick={confirmOrder}
            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
          >
            {GENERAL_CONFIRM_ORDER}
          </button>
        </div> */}
      </div>
    </div>
  )
}
