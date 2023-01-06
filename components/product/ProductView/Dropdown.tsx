import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'

import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'
import { getProductFromAttributes } from '@components/utils/attributesGenerator'
import { Dialog, RadioGroup, Switch } from '@headlessui/react'


// export default function Dropdown({
//   items = [],
//   onChange = () => {},
//   label = '',
//   fieldCode = '',
//   currentAttribute = '',
//   getStockPerAttribute,
//   productId,
//   setSelectedAttrData,
//   setAttrCombination,
//   isDisabled,
//   product,
//   variant,
// }: any) {
//   const { openNotifyUser, closeNotifyUser } = useUI()

//   const router = useRouter()

//   const slug = `products/${router.query.slug}`

//   const [productData, setProductData] = useState(
//     getStockPerAttribute(fieldCode, currentAttribute)
//   )

//   const [selected, setSelected] = useState({
//     currentAttribute,
//     stock: productData.currentStock,
//     productId: productData.productId,
//     stockCode: productData.stockCode,
//   })

//   useEffect(() => {
//     const getStockPerAttrData = getStockPerAttribute(
//       fieldCode,
//       currentAttribute
//     )
//     setProductData(getStockPerAttrData)
//     setSelected({
//       currentAttribute,
//       stock: getStockPerAttrData.currentStock,
//       productId: getStockPerAttrData.productId,
//       stockCode: getStockPerAttrData.stockCode,
//     })
//   }, [currentAttribute])

//   useEffect(() => {
//     const getStockPerAttrData = getStockPerAttribute(
//       fieldCode,
//       currentAttribute
//     )
//     setProductData(getStockPerAttrData)
//     setSelected({
//       currentAttribute,
//       stock: getStockPerAttrData.currentStock,
//       productId: getStockPerAttrData.productId,
//       stockCode: getStockPerAttrData.stockCode,
//     })
//   }, [productId])

//   const isPreOrderEnabled = productData.isPreOrderEnabled

//   const generateItemOption = (value: any, stock: number) => {
//     if (stock <= 0 && !isPreOrderEnabled)
//       return `${value.toUpperCase()} - NOTIFY ME`
//     if (stock <= 0 && isPreOrderEnabled) {
//       return `${value.toUpperCase()} - PRE-ORDER`
//     }
//     if ((stock < 5 && stock > 0) || isPreOrderEnabled)
//       return `${value.toUpperCase()} - ONLY ${stock} LEFT`
//     return value.toUpperCase()
//   }

//   const handleOnChange = (value: any) => {
//     // const stockPerAttrValue = getStockPerAttribute(
//     //   fieldCode,
//     //   value.currentAttribute
//     // )

//     const stockPerAttrValue = getProductFromAttributes(
//       fieldCode,
//       value.currentAttribute,
//       variant,
//       product.variantProducts,
//       slug
//     )
//     setSelected({ ...value, ...stockPerAttrValue })
//     setAttrCombination(fieldCode, value.currentAttribute)
//     setSelectedAttrData(stockPerAttrValue)
//     if (value.stock === 0 && !isPreOrderEnabled) {
//       openNotifyUser(stockPerAttrValue.productId)
//     }
//   }

//   return (
//     <>
//       <div className="grid grid-cols-6 py-1 my-2 border-t border-b ">

//         <Listbox value={selected} onChange={handleOnChange} disabled={isDisabled}>
//           <Listbox.Label
//             className={`${
//               isDisabled ? 'opacity-40' : ''
//             } inline-block text-lg pr-3 uppercase font-bold text-gray-600 text-left`}
//           >
//             {label}
//           </Listbox.Label>
//           <div className="relative inline-block w-9/12 mt-1">
//             <Listbox.Button
//               disabled
//               className={`${
//                 isDisabled ? 'opacity-40' : ''
//               } relative w-full bg-white pl-3 pr-10 py-1 text-left cursor-default focus:outline-none focus:ring-1 sm:text-md`}
//             >
//               <span className="flex items-center">
//                 <span
//                   style={{ minHeight: '20px' }}
//                   className="block ml-3 font-medium text-black truncate"
//                 >
//                   {selected.currentAttribute
//                     ? generateItemOption(selected.currentAttribute, selected.stock)
//                     : ' '}
//                 </span>
//               </span>
//               <span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
//                 <ChevronDownIcon
//                   className="w-6 h-6 text-black"
//                   aria-hidden="true"
//                 />
//               </span>
//             </Listbox.Button>

//             <Transition
//               as={Fragment}
//               leave="transition ease-in duration-100"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                 {items.map((item: any) => {
//                   const stockAmount = getStockPerAttribute(
//                     fieldCode,
//                     item.fieldValue
//                   ).stock
//                   return (
//                     <Listbox.Option
//                       key={item.fieldValue}
//                       className={({ active }) =>
//                         classNames(
//                           active ? 'text-white bg-indigo-600' : 'text-gray-900',
//                           'cursor-default select-none relative py-2 pl-3 pr-9'
//                         )
//                       }
//                       value={{
//                         currentAttribute: item.fieldValue,
//                         stock: stockAmount,
//                       }}
//                     >
//                       {({ selected, active }) => (
//                         <>
//                           <div className="flex items-center">
//                             <span
//                               className={classNames(
//                                 selected ? 'font-semibold' : 'font-normal',
//                                 'ml-3 block truncate'
//                               )}
//                             >
//                               {item.fieldValue
//                                 ? generateItemOption(item.fieldValue, stockAmount)
//                                 : null}
//                             </span>
//                           </div>

//                           {selected ? (
//                             <span
//                               className={classNames(
//                                 active ? 'text-white' : 'text-indigo-600',
//                                 'absolute inset-y-0 right-0 flex items-center pr-4'
//                               )}
//                             >
//                               <CheckIcon className="w-5 h-5"aria-hidden="true"/>
//                             </span>
//                           ) : null}
//                         </>
//                       )}
//                     </Listbox.Option>
//                   )
//                 })}
//               </Listbox.Options>
//             </Transition>
//           </div>
//         </Listbox>
//       </div>
//     </>    
//   )
// }

export default function Dropdown({
  items = [],
  onChange = () => { },
  label = '',
  fieldCode = '',
  currentAttribute = '',
  getStockPerAttribute,
  productId,
  setSelectedAttrData,
  setAttrCombination,
  isDisabled,
  product,
  variant,
  handleSetProductVariantInfo,
}: any) {
  const { openNotifyUser, closeNotifyUser } = useUI()

  const router = useRouter()

  const slug = `products/${router.query.slug}`

  const [productData, setProductData] = useState(
    getStockPerAttribute(fieldCode, currentAttribute)
  )

  const [selected, setSelected] = useState({
    currentAttribute,
    stock: productData.currentStock,
    productId: productData.productId,
    stockCode: productData.stockCode,
  })

  useEffect(() => {
    handleSetProductVariantInfo({ clothSize: currentAttribute })
  }, [])

  useEffect(() => {
    const getStockPerAttrData = getStockPerAttribute(
      fieldCode,
      currentAttribute
    )
    setProductData(getStockPerAttrData)
    setSelected({
      currentAttribute,
      stock: getStockPerAttrData.currentStock,
      productId: getStockPerAttrData.productId,
      stockCode: getStockPerAttrData.stockCode,
    })
  }, [currentAttribute])

  useEffect(() => {
    const getStockPerAttrData = getStockPerAttribute(
      fieldCode,
      currentAttribute
    )
    setProductData(getStockPerAttrData)
    setSelected({
      currentAttribute,
      stock: getStockPerAttrData.currentStock,
      productId: getStockPerAttrData.productId,
      stockCode: getStockPerAttrData.stockCode,
    })
  }, [productId])

  const isPreOrderEnabled = productData.isPreOrderEnabled

  const generateItemOption = (value: any, stock: number) => {
    if (stock <= 0 && !isPreOrderEnabled)
      return `${value.toUpperCase()} - NOTIFY ME`
    if (stock <= 0 && isPreOrderEnabled) {
      return `${value.toUpperCase()} - PRE-ORDER`
    }
    if ((stock < 5 && stock > 0) || isPreOrderEnabled)
      return `${value.toUpperCase()} - ONLY ${stock} LEFT`
    return value.toUpperCase()
  }

  const handleOnChange = (value: any) => {
    // const stockPerAttrValue = getStockPerAttribute(
    //   fieldCode,
    //   value.currentAttribute
    // )

    const stockPerAttrValue = getProductFromAttributes(
      fieldCode,
      value.currentAttribute,
      variant,
      product.variantProducts,
      slug
    )
    setSelected({ ...value, ...stockPerAttrValue })
    setAttrCombination(fieldCode, value.currentAttribute)
    setSelectedAttrData(stockPerAttrValue)
    if (value.stock === 0 && !isPreOrderEnabled) {
      openNotifyUser(stockPerAttrValue.productId)
    }
    return onChange(fieldCode, value.currentAttribute)
  }
  return (
    <div className="px-0 py-0">
      <div className='flex justify-between'>
        <h3 className='text-sm font-bold'>Size</h3>
        <h3 className='text-sm'>Size guide</h3>
      </div>
      <RadioGroup value={selected} onChange={handleOnChange} disabled={isDisabled} className="flex flex-row space-y-2 h-14">
        <div className="flex flex-row w-full m-auto space-y-2">
          <RadioGroup.Label className="sr-only">Size</RadioGroup.Label>
          {items.map((item: any) => {
            const stockAmount = getStockPerAttribute(
              fieldCode,
              item.fieldValue
            ).stock
            return (

              <RadioGroup.Option
                key={item.fieldValue}
                value={{
                  currentAttribute: item.fieldValue,
                  stock: stockAmount,
                }}
                className={({ active, checked }) =>
                  classNames(
                    generateItemOption(selected.currentAttribute, selected.stock)==generateItemOption(item.fieldValue, stockAmount) ? 'text-white bg-black border border-black' : 'text-gray-900',
                    'mx-auto py-2 w-full cursor-default select-none relative border border-grey-60 hover:border-black focus:outline-none'
                  )
                  // py-2 pr-2 pl-2 md:py-2 md:pr-2 md:pl-2 sm:py-2 sm:pr-2 sm:pl-2 
                }
              >

                {({ active, checked }) => (
                  <>
                    <div className="flex items-center">
                      <span
                        className={classNames(
                          selected ? 'font-semibold' : 'font-normal',
                          ' m-auto block truncate '
                        )}
                      >
                        {item.fieldValue
                          ? generateItemOption(item.fieldValue, stockAmount)
                          : null}
                      </span>
                      {/* <span className="flex items-center">
                        <span
                          style={{ minHeight: '20px' }}
                          className="block ml-3 font-medium text-black truncate"
                        >
                          {selected.currentAttribute
                            ? generateItemOption(selected.currentAttribute, selected.stock)
                            : ' '}
                        </span>
                      </span> */}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            )
          })}
        </div>
      </RadioGroup>

    </div>
  )
}

