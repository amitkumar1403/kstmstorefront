import { Tab, Disclosure } from '@headlessui/react'
import { HeartIcon, MinusSmIcon, PlusSmIcon } from '@heroicons/react/outline'
import { StarIcon, PlayIcon } from '@heroicons/react/solid'
import classNames from '@components/utils/classNames'
import {PRODUCT_DESCRIPTION,PRODUCT_SPECIFICATION,GENERAL_SHIPPING,GENERAL_RETURNS} from '@components/utils/textVariables'

const colorRegex = /^#(?:[0-9a-f]{3}){1,2}$/i

const Attributes = ({ attributes = [] }: any) => {
  return (
    <table className="text-gray-900">
      <tbody>
        {attributes.map((attr: any, idx: number) => {
          return (
            <tr key={idx}>
              <th className="border text-left px-5 py-5">{attr.display}</th>
              <td className="border text-left px-5 py-5">
                {colorRegex.test(attr.value) ? (
                  <div
                    className="h-6 w-6 rounded-full mr-2 mt-2 border border-gray-100"
                    style={{ backgroundColor: attr.value }}
                  />
                ) : (
                  attr.value
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function ProductDetails({ product, description }: any) {
  const detailsConfig = [
    {
      title: PRODUCT_SPECIFICATION,
      InnerComponent: (props: any) => <Attributes {...props} />,
    },
    {
      title: GENERAL_SHIPPING,
      InnerComponent: (props: any) => (
        <p className="text-gray-900">
          {props.shippingMessage || <p>We currently ship in the UK and worldwide.<br/><br/>We accept payment via PayPal, Clearpay, and major card payment providers (including Visa, Mastercard, Maestro, and Switch) and more.</p>}
        </p>
      ),
    },
    {
      title: GENERAL_RETURNS,
      InnerComponent: (props: any) => (
        <p className="text-gray-900">
          {props.returnsMessage || <p>Items may be returned for a full refund within 14 days from the date an order was received.</p>}
        </p>
      ),
    },
  ]

  const descriptionConfig = [
    {
      title: PRODUCT_DESCRIPTION,
      InnerComponent: (props: any) => (
        <div
          className="text-gray-700 sm:space-y-6 space-y-2"
          dangerouslySetInnerHTML={{ __html: description || '' }}
        />
      ),
    }
  ]

  return (
    <>
      <div className='border-b divide-y divide-gray-200'>
        {descriptionConfig.map((desc:any, id:number)=>(
           <Disclosure as="div" key={`${id}-desc-item`} defaultOpen>
           {({ open }) => (
             <>
               <h3>
                 <Disclosure.Button className="group relative w-full sm:py-2 py-2 pr-2 flex justify-between items-center text-left">
                   <span
                     className={classNames(
                       open ? 'text-black' : 'text-gray-900',
                       'text-lg uppercase font-medium'
                     )}
                   >
                     {desc.title}
                   </span>
                   <span className="ml-6 flex items-center">
                     {open ? (
                       <MinusSmIcon
                         className="block h-6 w-6 text-black group-hover:text-gray-700"
                         aria-hidden="true"
                       />
                     ) : (
                       <PlusSmIcon
                         className="block h-6 w-6 text-black group-hover:text-gray-700"
                         aria-hidden="true"
                       />
                     )}
                   </span>
                 </Disclosure.Button>
               </h3>
               
               <Disclosure.Panel as="div" className="pb-6 prose prose-sm">
                 {desc.InnerComponent({
                   attributes: product.customAttributes || product.attributes,
                 })}
               </Disclosure.Panel>
             </>
           )}
         </Disclosure>
        ))}
      </div>
      <div className="border-b divide-y divide-gray-200 full-table">
        {detailsConfig.map((detail: any, idx: number) => (
          <Disclosure as="div" key={`${idx}-detail-item`}>
            {({ open }) => (
              <>
                <h3>
                  <Disclosure.Button className="group relative w-full sm:py-2 py-2 pr-2 flex justify-between items-center text-left">
                    <span
                      className={classNames(
                        open ? 'text-black' : 'text-gray-900',
                        'text-lg uppercase font-medium'
                      )}
                    >
                      {detail.title}
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusSmIcon
                          className="block h-6 w-6 text-black group-hover:text-gray-700"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusSmIcon
                          className="block h-6 w-6 text-black group-hover:text-gray-700"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel as="div" className="pb-6 prose prose-sm">
                  {detail.InnerComponent({
                    attributes: product.customAttributes || product.attributes,
                  })}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </>
  )
}
