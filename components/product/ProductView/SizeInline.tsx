import { Dialog, RadioGroup, Switch } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'
import { getProductFromAttributes } from '@components/utils/attributesGenerator'
import Link from 'next/link'
import { HeartIcon, XIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import { groupBy, round } from 'lodash'
import Button from '@components/ui/AddButton'
import { BTN_ADD_TO_FAVORITES } from '@components/utils/textVariables'
import { matchStrings } from '@framework/utils/parse-util'
import * as SizeAttribute from '@components/product/ProductView/sizeAttribute.json'
import * as SizeChart from '@components/product/ProductView/SizeChart.json'
import cartHandler from '@components/services/cart'

export default function SizeInline({
  items = [],
  onChange = () => {},
  label = '',
  fieldCode = '',
  currentAttribute = '',
  getStockPerAttribute,
  productId,
  setAttrCombination,
  isDisabled,
  product,
  variant,
  generateLink = () => {},
  callToAction,
}: any) {
  currentAttribute = product?.stockCode?.substring(
    product?.stockCode?.lastIndexOf('-') + 1
  )
  const { openNotifyUser, closeNotifyUser, basketId, setCartItems, user } =
    useUI()
  // console.log('SIZEINLINE C2A',callToAction)

  const router = useRouter()

  const slug = `products/${router.query.slug}`

  const [productData, setProductData] = useState(
    getStockPerAttribute(fieldCode, currentAttribute)
  )

  const [isSizeChart, setSizeChart] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [isSizeChange, setSizeChange] = useState(false)
  const [selected, setSelected] = useState({
    ...currentAttribute,
    stock: productData.currentStock,
    productId: productData.productId,
    stockCode: productData.stockCode,
  })

  useEffect(() => {
    const getStockPerAttrData = getStockPerAttribute(
      fieldCode,
      currentAttribute
    )
    setProductData(getStockPerAttrData)
    setSelected({
      ...currentAttribute,
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
      ...currentAttribute,
      stock: getStockPerAttrData.currentStock,
      productId: getStockPerAttrData.productId,
      stockCode: getStockPerAttrData.stockCode,
    })
  }, [productId])

  const isPreOrderEnabled = productData.isPreOrderEnabled

  console.log(
    'MATCH_STRING',
    product?.stockCode?.substring(product?.stockCode?.lastIndexOf('-') + 1)
  )

  const generateItemOption = (value: any, stock: number) => {
    // console.log('PROPS_GEN_FUNC',value)
    if (stock <= 0 && !isPreOrderEnabled)
      return `${value.toUpperCase()} - Sold Out`
    if (stock <= 0 && isPreOrderEnabled) {
      return `${value.toUpperCase()} - PRE-ORDER`
    }
    if ((stock < 5 && stock > 0) || isPreOrderEnabled) {
      return `${value?.toUpperCase()} - ${stock} LEFT`
    } else {
      return `${value?.toUpperCase()} - ${stock} LEFT`
    }
    return value?.toUpperCase()
  }
  const handleChange = (item: any) => {
    console.log('ITEM FROM SIZE', item)
    return onChange(fieldCode, item?.fieldValue)
  }
  const handleChangeFromSizeChart = (size: any) => {
    return items.filter((i: any) => i.fieldValue === size)[0]
  }
  // const [selectedAttrData, setSelectedAttrData] = useState({
  //    productId: product.recordId,
  //    stockCode: product.stockCode,
  //    ...product,
  // });

  function setEnable() {
    setSizeChange(true)
    setEnabled(true)
  }
  function setDisabled() {
    setSizeChange(false)
    setEnabled(false)
  }

  const sanitizeSize = (value: string) => {
    if (value) {
      return value?.toUpperCase().replaceAll('T', '').replaceAll('V', '')
    }
    return value
  }

  const addProdWithSize = async () => {
    // const item = await cartHandler().addToCart(
    //          {
    //             basketId: basketId,
    //             productId: selectedAttrData?.productId,
    //             qty: 1,
    //             manualUnitPrice: product?.price?.raw?.withTax,
    //             stockCode: selectedAttrData?.stockCode,
    //             userId: user?.userId,
    //             isAssociated: user?.isAssociated,
    //          },
    //          'ADD',
    //          { product: selectedAttrData }
    //       )
    //       setCartItems(item)
    // console.log('item:',item)
  }

  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)
  let imageTagGroup: any = ''
  if (product?.images.length > 0) {
    imageTagGroup = groupBy(product?.images, 'tag')
  }

  let outerWearCategory = product?.mappedCategories?.find((x: any) =>
    matchStrings(x.categoryName, 'Outerwear', true)
  )
  let innerWearCategory = product?.mappedCategories?.find((x: any) =>
    matchStrings(x.categoryName, 'Innerwear', true)
  )
  const attrGroup = groupBy(product?.customAttributes, 'key')
  return (
    <>
      <div
        className="grid w-full grid-cols-3 px-4 border-gray-200 border-solid hide-swach-padding sm:border-t sm:px-0"
        id="productSize"
      >
        <div className="col-span-2 item-left">
          <h3 className="pt-3 text-xs font-semibold text-left text-gray-400 uppercase sm:text-sm">
            {label}:
            <span className="pl-1 text-xs font-bold text-black sm:text-sm">
              {product?.mappedCategories?.length > 0 &&
                SizeAttribute?.sizes?.map((attr: any, aid: number) => (
                  <>
                    {matchStrings(
                      attr.name,
                      product?.mappedCategories[0].categoryName,
                      true
                    ) && (
                      <>
                        <div className="inline-block" key={aid}>
                          {attr?.values?.map((fields: any, idx: number) => (
                            <>
                              <div key={idx}>
                                {matchStrings(
                                  fields.FieldText,
                                  currentAttribute,
                                  true
                                ) && (
                                  <>
                                    <p>
                                      {fields.FieldText}
                                      {' ('}
                                      {fields.FieldValue}
                                      {')'}
                                    </p>
                                  </>
                                )}
                              </div>
                            </>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ))}
            </span>
          </h3>
        </div>
        <div className="col-span-1 mt-3 text-right item-right">
          <h3
            className="text-sm font-semibold text-orange-600 cursor-pointer sm:text-md hover:text-orange-700"
            onClick={() => setSizeChart(true)}
          >
            Size Chart
          </h3>
        </div>
      </div>
      <RadioGroup
        value={'ring-gray-700'}
        onChange={() => {}}
        className="px-4 mt-4 mb-6 sm:px-0 hide-swach-padding"
      >
        <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
        <div className="flex items-center space-x-2">
          {items
            ?.sort((a: any, b: any) => a.displayOrder - b.displayOrder)
            ?.map((item: any, idx: any) => {
              //const path = generateLink(fieldCode, item.fieldValue)
              const stockAmount = getStockPerAttribute(
                fieldCode,
                item.fieldValue
              ).stock
              let soldoutCls = 'bg-white text-primary'
              if (stockAmount == 0) {
                soldoutCls = 'bg-gray-100 pointer-event-none text-gray-300'
              }
              return (
                <RadioGroup.Option
                  key={idx}
                  value={item.fieldValue}
                  className="relative flex flex-col justify-center text-center"
                  onClick={() => handleChange(item)}
                >
                  <>
                    <div
                      className={classNames(
                        //selected.currentAttribute == generateItemOption(item?.fieldValue, stockAmount)?.toLowerCase() ? 'border-gray-800' : 'bg-white',
                        `${
                          matchStrings(
                            product?.stockCode?.substring(
                              product?.stockCode?.lastIndexOf('-') + 1
                            ),
                            sanitizeSize(item?.fieldValue),
                            true
                          ) && stockAmount > 0
                            ? 'border-gray-800'
                            : soldoutCls
                        }`,
                        '-m-0.5 relative p-2 border w-16 h-16 dark:text-black border-gray-300 bg-white border-opacity-1 rounded-sm text-md content-center text-center flex items-center justify-center cursor-pointer focus:outline-none hover:bg-zinc-50'
                      )}
                    >
                      <RadioGroup.Label as="p" className="sr-only">
                        {item.fieldName} {item.value}
                      </RadioGroup.Label>
                      {/*href={`/${path}`}*/}
                      <Link
                        href="javascript:void(0);"
                        aria-hidden="true"
                        onClick={() => handleChange(item)}
                        className={classNames(item.fieldvalue, '')}
                      >
                        <>
                          {item.fieldValue
                            ? generateItemOption(
                                item.fieldValue,
                                stockAmount
                              )?.split('-')[0]
                            : null}
                          {matchStrings(
                            product?.stockCode?.substring(
                              product?.stockCode?.lastIndexOf('-') + 1
                            ),
                            item.fieldValue,
                            true
                          ) &&
                            stockAmount <= 5 && (
                              <div
                                className={classNames(
                                  selected.currentAttribute ==
                                    generateItemOption(
                                      item?.fieldValue,
                                      stockAmount
                                    )?.toLowerCase()
                                    ? 'inline-block top-14'
                                    : '',
                                  'absolute block w-14 text-xs font-semibold text-dark-red mt-20'
                                )}
                              >
                                {item.fieldValue
                                  ? generateItemOption(
                                      item.fieldValue,
                                      stockAmount
                                    )?.split('-')[1]
                                  : null}
                              </div>
                            )}
                        </>
                      </Link>
                    </div>

                    <div
                      className={classNames(
                        selected.currentAttribute ==
                          generateItemOption(
                            item?.fieldValue,
                            stockAmount
                          )?.toLowerCase()
                          ? 'inline-block top-14'
                          : 'hidden',
                        'text-center absolute'
                      )}
                    >
                      <span className="absolute block mt-1 text-xs font-semibold text-red-500 w-14 ">
                        {product?.currentStock} Left
                      </span>
                    </div>
                    <div
                      className={classNames(
                        selected.currentAttribute ==
                          generateItemOption(
                            item?.fieldValue,
                            stockAmount
                          )?.toLowerCase()
                          ? 'inline-block top-14'
                          : 'hidden',
                        'absolute block w-14 mt-1 text-xs font-semibold text-red-500'
                      )}
                    >
                      {item.fieldValue
                        ? generateItemOption(
                            item.fieldValue,
                            stockAmount
                          )?.split('-')[1]
                        : null}
                    </div>
                  </>
                </RadioGroup.Option>
              )
            })}
        </div>
      </RadioGroup>

      {/* QUICK VIEW PANEL FROM BOTTOM */}
      <Transition.Root show={isSizeChart} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-9999"
          onClose={() => setSizeChart(false)}
        >
          <div className="fixed inset-0 left-0 bg-orange-900/20" />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-400"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-400"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="w-screen max-w-md pointer-events-auto side-panel-lg">
                    <div className="relative z-50 flex flex-col h-full bg-white shadow-xl">
                      <div className="px-0 py-3 sm:px-0">
                        <div className="flex pb-2 border-b border-gray-200">
                          <button
                            type="button"
                            className="mr-2 text-black bg-white rounded-md outline-none hover:text-gray-500"
                            onClick={() => setSizeChart(false)}
                          >
                            <div className="inline-block px-6">
                              <span className="sr-only">Close panel</span>
                              <XIcon
                                className="relative w-6 h-6 text-zinc-600 -top-1"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="inline-block text-left">
                              <span className="flex-1 text-lg font-bold text-black">
                                Size Chart
                              </span>
                              <span className="flex-1 block text-sm text-gray-500">
                                {product.name}
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>
                      {/* Main */}
                      <div className="pt-4 overflow-y-auto sizeChart">
                        {outerWearCategory?.categoryName == 'Outerwear' && (
                          <>
                            {SizeChart?.Outerwear.map(
                              (chart: any, chid: number) =>
                                chart?.Images.map(
                                  (image: any, iid: number) =>
                                    matchStrings(
                                      image?.name,
                                      product?.mappedCategories[0]
                                        ?.categoryName,
                                      true
                                    ) && (
                                      <>
                                        <div
                                          className="flex flex-col px-4 sm:px-12 image-container"
                                          key={iid}
                                        >
                                          <Image
                                            src={image?.imageURL}
                                            className="image"
                                            layout="fill"
                                          />
                                        </div>
                                      </>
                                    )
                                )
                            )}

                            <div className="flex justify-between px-4 pb-3 mt-3 border-b border-gray-200 sm:px-12">
                              <div className="mt-1 item-left">
                                <h3 className="text-sm font-semibold text-black">
                                  Select a size to add to bag
                                </h3>
                              </div>
                              {isSizeChange ? (
                                <>
                                  <div className="item-right">
                                    <Switch
                                      checked={enabled}
                                      onChange={() => setDisabled()}
                                      className={`${
                                        enabled ? 'bg-white' : 'bg-white'
                                      } relative inline-flex switch-panel-parent transition-colors duration-200 dark:text-black ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 switch-in-before`}
                                    >
                                      <span className="sr-only">
                                        Use setting
                                      </span>
                                      <span
                                        aria-hidden="true"
                                        className={`${
                                          enabled
                                            ? 'translate-x-10'
                                            : 'translate-x-0'
                                        } switch-panel inline-block ring-0 transition duration-200 dark:text-black ease-in-out`}
                                      >
                                        cm
                                      </span>
                                    </Switch>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="item-right">
                                    <Switch
                                      checked={enabled}
                                      onChange={() => setEnable()}
                                      className={`${
                                        enabled ? 'bg-white' : 'bg-white'
                                      } relative inline-flex switch-panel-parent transition-colors duration-200 dark:text-black ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 switch-cm-before`}
                                    >
                                      <span className="sr-only">
                                        Use setting
                                      </span>
                                      <span
                                        aria-hidden="true"
                                        className={`${
                                          enabled
                                            ? 'translate-x-5 border-black'
                                            : 'translate-x-0'
                                        } switch-panel inline-block ring-0 transition dark:text-black duration-200 ease-in-out`}
                                      >
                                        in
                                      </span>
                                    </Switch>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <table className="w-full bg-white border-b border-gray-200">
                                {(product?.mappedCategories[0]?.categoryName ==
                                  'Constant 500 Day Tshirts' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Constant 500 Day All Degree Polo' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Fluid Tees' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Statement Popcorn Textured Casual Tees') && (
                                  <thead>
                                    <tr>
                                      <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200 ">
                                        <span>Size</span>
                                      </th>
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Chest</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Chest</span>
                                          <span className="block text-xs text-gray-400">
                                            (centimetres)
                                          </span>
                                        </th>
                                      )}
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">
                                            Front Length
                                          </span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">
                                            Across Shoulder
                                          </span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                )}
                                {(product?.mappedCategories[0]?.categoryName ==
                                  'Constant 500 Day Chino Shorts' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Better Basics French Terry Sweatshorts' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Breeeze Ultra-Light Casual Lounge Shorts' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Constant 500 Day Casual Shorts' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Statement All-Day Joggers') && (
                                  <thead>
                                    <tr>
                                      <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                        <span>Size</span>
                                      </th>
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Waist</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">
                                            Front Length
                                          </span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                )}
                                {(product?.mappedCategories[0]?.categoryName ==
                                  'Constant 500 Day Ottoman Joggers' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'The Stretch Pyjama Pants' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Shorts') && (
                                  <thead>
                                    <tr>
                                      <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                        <span>Size</span>
                                      </th>
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Waist</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Waist</span>
                                          <span className="block text-xs text-gray-400">
                                            (centimetres)
                                          </span>
                                        </th>
                                      )}
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">
                                            Front Length
                                          </span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                )}
                                {(product?.mappedCategories[0]?.categoryName ==
                                  'Sweatshirts' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Constant 500 Day Pullover Hoodies' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Better Basics Regular Fit Sweatshirt' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Statement All-Day Midweight Sweatshirts' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Statement Printed Crew Tees' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Better Basics Crew T Shirt') && (
                                  <thead>
                                    <tr>
                                      <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                        <span>Size</span>
                                      </th>
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Chest</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Chest</span>
                                          <span className="block text-xs text-gray-400">
                                            (centimetres)
                                          </span>
                                        </th>
                                      )}
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">
                                            Front Length
                                          </span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">
                                            Across Shoulder
                                          </span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                )}
                                <tbody>
                                  {SizeChart?.Outerwear.map(
                                    (chart: any, chid: number) =>
                                      chart.Sizes.map(
                                        (data: any, did: number) => {
                                          // console.log('CHART_SIZES_MAP:',data)
                                          return (
                                            matchStrings(
                                              data.CategoryName,
                                              product?.mappedCategories[0]
                                                .categoryName,
                                              true
                                            ) && (
                                              <>
                                                {(product?.mappedCategories[0]
                                                  ?.categoryName ==
                                                  'Constant 500 Day Tshirts' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Constant 500 Day All Degree Polo' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Fluid Tees' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Statement Popcorn Textured Casual Tees') && (
                                                  <tr key={did}>
                                                    <td
                                                      align="left"
                                                      className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md"
                                                    >
                                                      <input
                                                        onClick={() =>
                                                          handleChange(
                                                            handleChangeFromSizeChart(
                                                              data.Size
                                                            )
                                                          )
                                                        }
                                                        type="radio"
                                                        id={`size_${data.Size}`}
                                                        className="bg-gray-100 border border-gray-200"
                                                        value="S"
                                                        name="size"
                                                      />
                                                      <label
                                                        htmlFor={`size_${data.Size}`}
                                                        className="relative pl-4 text-md"
                                                      >
                                                        {data.Size}
                                                      </label>
                                                    </td>
                                                    {!isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {data?.ChestInches}
                                                        </span>
                                                      </td>
                                                    )}
                                                    {isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {data?.ChestCms}
                                                        </span>
                                                      </td>
                                                    )}
                                                    {!isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {
                                                            data?.FrontLengthInches
                                                          }
                                                        </span>
                                                      </td>
                                                    )}
                                                    {!isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {
                                                            data?.AcrossShoulderInches
                                                          }
                                                        </span>
                                                      </td>
                                                    )}
                                                  </tr>
                                                )}
                                                {(product?.mappedCategories[0]
                                                  ?.categoryName ==
                                                  'Constant 500 Day Chino Shorts' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Better Basics French Terry Sweatshorts' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Breeeze Ultra-Light Casual Lounge Shorts' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Constant 500 Day Casual Shorts' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Statement All-Day Joggers') && (
                                                  <tr key={did}>
                                                    <td
                                                      align="left"
                                                      className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md"
                                                    >
                                                      <input
                                                        onClick={() =>
                                                          handleChange(
                                                            handleChangeFromSizeChart(
                                                              data.Size
                                                            )
                                                          )
                                                        }
                                                        type="radio"
                                                        id={`size_${data.Size}`}
                                                        className="bg-gray-100"
                                                        value="S"
                                                        name="size"
                                                      />
                                                      <label
                                                        htmlFor={`size_${data.Size}`}
                                                        className="relative pl-4 text-md"
                                                      >
                                                        {data.Size}
                                                      </label>
                                                    </td>
                                                    {!isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {data?.WaistInches}
                                                        </span>
                                                      </td>
                                                    )}
                                                    {!isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {
                                                            data?.FrontLengthInches
                                                          }
                                                        </span>
                                                      </td>
                                                    )}
                                                  </tr>
                                                )}
                                                {(product?.mappedCategories[0]
                                                  ?.categoryName ==
                                                  'Constant 500 Day Ottoman Joggers' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'The Stretch Pyjama Pants' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Shorts') && (
                                                  <tr key={did}>
                                                    <td
                                                      align="left"
                                                      className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md"
                                                    >
                                                      <input
                                                        onClick={() =>
                                                          handleChange(
                                                            handleChangeFromSizeChart(
                                                              data.Size
                                                            )
                                                          )
                                                        }
                                                        type="radio"
                                                        id={`size_${data.Size}`}
                                                        className="bg-gray-100"
                                                        value="S"
                                                        name="size"
                                                      />
                                                      <label
                                                        htmlFor={`size_${data.Size}`}
                                                        className="relative pl-4 text-md"
                                                      >
                                                        {data.Size}
                                                      </label>
                                                    </td>
                                                    {!isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {data?.WaistInches}
                                                        </span>
                                                      </td>
                                                    )}
                                                    {isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {data?.WaistCms}
                                                        </span>
                                                      </td>
                                                    )}
                                                    {!isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {
                                                            data?.FrontLengthInches
                                                          }
                                                        </span>
                                                      </td>
                                                    )}
                                                  </tr>
                                                )}
                                                {(product?.mappedCategories[0]
                                                  ?.categoryName ==
                                                  'Sweatshirts' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Constant 500 Day Pullover Hoodies' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Better Basics Regular Fit Sweatshirt' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Statement All-Day Midweight Sweatshirts' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Statement Printed Crew Tees' ||
                                                  product?.mappedCategories[0]
                                                    ?.categoryName ==
                                                    'Better Basics Crew T Shirt') && (
                                                  <tr key={did}>
                                                    <td
                                                      align="left"
                                                      className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md"
                                                    >
                                                      <input
                                                        onClick={() =>
                                                          handleChange(
                                                            handleChangeFromSizeChart(
                                                              data.Size
                                                            )
                                                          )
                                                        }
                                                        type="radio"
                                                        id={`size_${data.Size}`}
                                                        className="bg-gray-100"
                                                        value="S"
                                                        name="size"
                                                      />
                                                      <label
                                                        htmlFor={`size_${data.Size}`}
                                                        className="relative pl-4 text-md"
                                                      >
                                                        {data.Size}
                                                      </label>
                                                    </td>
                                                    {!isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {data?.ChestInches}
                                                        </span>
                                                      </td>
                                                    )}
                                                    {isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {data?.ChestCms}
                                                        </span>
                                                      </td>
                                                    )}
                                                    {!isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {
                                                            data?.FrontLengthInches
                                                          }
                                                        </span>
                                                      </td>
                                                    )}
                                                    {!isSizeChange && (
                                                      <td className="py-3 text-sm font-medium text-center text-black">
                                                        <span>
                                                          {
                                                            data?.AcrossShoulderInches
                                                          }
                                                        </span>
                                                      </td>
                                                    )}
                                                  </tr>
                                                )}
                                              </>
                                            )
                                          )
                                        }
                                      )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        {innerWearCategory?.categoryName == 'Innerwear' && (
                          <>
                            {SizeChart?.Innerwear.map(
                              (chart: any, chid: number) =>
                                chart?.Images.map(
                                  (image: any, iid: number) =>
                                    matchStrings(
                                      image?.name,
                                      product?.mappedCategories[0]
                                        ?.categoryName,
                                      true
                                    ) && (
                                      <>
                                        <div
                                          className="flex flex-col px-4 sm:px-12 image-container"
                                          key={iid}
                                        >
                                          <Image
                                            src={image?.imageURL}
                                            className="image"
                                            layout="fill"
                                          />
                                        </div>
                                      </>
                                    )
                                )
                            )}
                            <div className="flex justify-between px-4 pb-3 mt-3 border-b border-gray-200 sm:px-12">
                              <div className="mt-1 item-left">
                                <h3 className="text-sm font-semibold text-black">
                                  Select a size to add to bag
                                </h3>
                              </div>
                              {isSizeChange ? (
                                <>
                                  <div className="item-right">
                                    <Switch
                                      checked={enabled}
                                      onChange={() => setDisabled()}
                                      className={`${
                                        enabled ? 'bg-white' : 'bg-white'
                                      } relative dark:text-black inline-flex switch-panel-parent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 switch-in-before`}
                                    >
                                      <span className="sr-only">
                                        Use setting
                                      </span>
                                      <span
                                        aria-hidden="true"
                                        className={`${
                                          enabled
                                            ? 'translate-x-10'
                                            : 'translate-x-0'
                                        } switch-panel dark:text-black inline-block ring-0 transition duration-200 ease-in-out`}
                                      >
                                        cm
                                      </span>
                                    </Switch>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="item-right">
                                    <Switch
                                      checked={enabled}
                                      onChange={() => setEnable()}
                                      className={`${
                                        enabled ? 'bg-white' : 'bg-white'
                                      } relative inline-flex dark:text-black switch-panel-parent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 switch-cm-before`}
                                    >
                                      <span className="sr-only">
                                        Use setting
                                      </span>
                                      <span
                                        aria-hidden="true"
                                        className={`${
                                          enabled
                                            ? 'translate-x-5 border-black'
                                            : 'translate-x-0'
                                        } switch-panel dark:text-black inline-block ring-0 transition duration-200 ease-in-out`}
                                      >
                                        in
                                      </span>
                                    </Switch>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <table className="w-full bg-white border-b border-gray-200">
                                {(product?.mappedCategories[0]?.categoryName ==
                                  'Boxer Brief' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Deo Soft Trunk' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Deo Soft Boxer Brief' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Deo Soft Brief' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Brief') && (
                                  <thead>
                                    <tr>
                                      <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                        <span>Size</span>
                                      </th>
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Waist</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Waist</span>
                                          <span className="block text-xs text-gray-400">
                                            (centimetres)
                                          </span>
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                )}
                                {(product?.mappedCategories[0]?.categoryName ==
                                  'Breeeze Ultra-light Inner Boxers' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Breeeze Ultra-light Boxer Shorts') && (
                                  <thead>
                                    <tr>
                                      <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                        <span>Size</span>
                                      </th>
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Waist</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Waist</span>
                                          <span className="block text-xs text-gray-400">
                                            (centimetres)
                                          </span>
                                        </th>
                                      )}
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Length</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Length</span>
                                          <span className="block text-xs text-gray-400">
                                            (centimetres)
                                          </span>
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                )}
                                {(product?.mappedCategories[0]?.categoryName ==
                                  'Neo Skin Bamboo Vest' ||
                                  product?.mappedCategories[0]?.categoryName ==
                                    'Neo-Cotton Ribbed Vest') && (
                                  <thead>
                                    <tr>
                                      <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                        <span>Size</span>
                                      </th>
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Chest</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Chest</span>
                                          <span className="block text-xs text-gray-400">
                                            (centimetres)
                                          </span>
                                        </th>
                                      )}
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Length</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Length</span>
                                          <span className="block text-xs text-gray-400">
                                            (centimetres)
                                          </span>
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                )}
                                {product?.mappedCategories[0]?.categoryName ==
                                  'Fluid Casual Tank Tops' && (
                                  <thead>
                                    <tr>
                                      <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                        <span>Size</span>
                                      </th>
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Chest</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Chest</span>
                                          <span className="block text-xs text-gray-400">
                                            (centimetres)
                                          </span>
                                        </th>
                                      )}
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">Length</span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                      {!isSizeChange && (
                                        <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                          <span className="block">
                                            Across Shoulder
                                          </span>
                                          <span className="block text-xs text-gray-400">
                                            (inches)
                                          </span>
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                )}
                                <tbody>
                                  {SizeChart?.Innerwear.map(
                                    (chart: any, chid: number) =>
                                      chart.Sizes.map(
                                        (data: any, did: number) =>
                                          matchStrings(
                                            data.CategoryName,
                                            product?.mappedCategories[0]
                                              .categoryName,
                                            true
                                          ) && (
                                            <>
                                              {(product?.mappedCategories[0]
                                                ?.categoryName ==
                                                'Boxer Brief' ||
                                                product?.mappedCategories[0]
                                                  ?.categoryName ==
                                                  'Deo Soft Trunk' ||
                                                product?.mappedCategories[0]
                                                  ?.categoryName ==
                                                  'Deo Soft Boxer Brief' ||
                                                product?.mappedCategories[0]
                                                  ?.categoryName ==
                                                  'Deo Soft Brief' ||
                                                product?.mappedCategories[0]
                                                  ?.categoryName ==
                                                  'Brief') && (
                                                <tr key={did}>
                                                  <td
                                                    align="left"
                                                    className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md"
                                                  >
                                                    <input
                                                      onClick={() =>
                                                        handleChange(
                                                          handleChangeFromSizeChart(
                                                            data.Size
                                                          )
                                                        )
                                                      }
                                                      type="radio"
                                                      id={`size_${data.Size}`}
                                                      className="bg-gray-100"
                                                      value="S"
                                                      name="size"
                                                    />
                                                    <label
                                                      htmlFor={`size_${data.Size}`}
                                                      className="relative pl-4 text-md"
                                                    >
                                                      {data.Size}
                                                    </label>
                                                  </td>
                                                  {!isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.WaistInches}
                                                      </span>
                                                    </td>
                                                  )}
                                                  {isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.WaistCms}
                                                      </span>
                                                    </td>
                                                  )}
                                                </tr>
                                              )}
                                              {(product?.mappedCategories[0]
                                                ?.categoryName ==
                                                'Breeeze Ultra-light Inner Boxers' ||
                                                product?.mappedCategories[0]
                                                  ?.categoryName ==
                                                  'Breeeze Ultra-light Boxer Shorts') && (
                                                <tr key={did}>
                                                  <td
                                                    align="left"
                                                    className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md"
                                                  >
                                                    <input
                                                      onClick={() =>
                                                        handleChange(
                                                          handleChangeFromSizeChart(
                                                            data.Size
                                                          )
                                                        )
                                                      }
                                                      type="radio"
                                                      id={`size_${data.Size}`}
                                                      className="bg-gray-100"
                                                      value="S"
                                                      name="size"
                                                    />
                                                    <label
                                                      htmlFor={`size_${data.Size}`}
                                                      className="relative pl-4 text-md"
                                                    >
                                                      {data.Size}
                                                    </label>
                                                  </td>
                                                  {!isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.WaistInches}
                                                      </span>
                                                    </td>
                                                  )}
                                                  {isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.WaistCms}
                                                      </span>
                                                    </td>
                                                  )}
                                                  {!isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.LengthInches}
                                                      </span>
                                                    </td>
                                                  )}
                                                  {isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.LengthCms}
                                                      </span>
                                                    </td>
                                                  )}
                                                </tr>
                                              )}
                                              {(product?.mappedCategories[0]
                                                ?.categoryName ==
                                                'Neo Skin Bamboo Vest' ||
                                                product?.mappedCategories[0]
                                                  ?.categoryName ==
                                                  'Neo-Cotton Ribbed Vest') && (
                                                <tr key={did}>
                                                  <td
                                                    align="left"
                                                    className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md"
                                                  >
                                                    <input
                                                      onClick={() =>
                                                        handleChange(
                                                          handleChangeFromSizeChart(
                                                            data.Size
                                                          )
                                                        )
                                                      }
                                                      type="radio"
                                                      id={`size_${data.Size}`}
                                                      className="bg-gray-100"
                                                      value="S"
                                                      name="size"
                                                    />
                                                    <label
                                                      htmlFor={`size_${data.Size}`}
                                                      className="relative pl-4 text-md"
                                                    >
                                                      {data.Size}
                                                    </label>
                                                  </td>
                                                  {!isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.ChestInches}
                                                      </span>
                                                    </td>
                                                  )}
                                                  {isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.ChestCms}
                                                      </span>
                                                    </td>
                                                  )}
                                                  {!isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.LengthInches}
                                                      </span>
                                                    </td>
                                                  )}
                                                  {isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.LengthCms}
                                                      </span>
                                                    </td>
                                                  )}
                                                </tr>
                                              )}
                                              {product?.mappedCategories[0]
                                                ?.categoryName ==
                                                'Fluid Casual Tank Tops' && (
                                                <tr key={did}>
                                                  <td
                                                    align="left"
                                                    className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md"
                                                  >
                                                    <input
                                                      onClick={() =>
                                                        handleChange(
                                                          handleChangeFromSizeChart(
                                                            data.Size
                                                          )
                                                        )
                                                      }
                                                      type="radio"
                                                      id={`size_${data.Size}`}
                                                      className="bg-gray-100"
                                                      value="S"
                                                      name="size"
                                                    />
                                                    <label
                                                      htmlFor={`size_${data.Size}`}
                                                      className="relative pl-4 text-md"
                                                    >
                                                      {data.Size}
                                                    </label>
                                                  </td>
                                                  {!isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.ChestInches}
                                                      </span>
                                                    </td>
                                                  )}
                                                  {isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.ChestCms}
                                                      </span>
                                                    </td>
                                                  )}
                                                  {!isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {data?.LengthInches}
                                                      </span>
                                                    </td>
                                                  )}
                                                  {!isSizeChange && (
                                                    <td className="py-3 text-sm font-medium text-center text-black">
                                                      <span>
                                                        {
                                                          data?.AcrossShoulderInches
                                                        }
                                                      </span>
                                                    </td>
                                                  )}
                                                </tr>
                                              )}
                                            </>
                                          )
                                      )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                        <div className="sticky bottom-0 z-10 flex flex-col w-full pt-2 pb-4 bg-white border-t border-gray-200">
                          <div className="flex justify-between px-4 pt-2 sm:pt-6 sm:px-12">
                            <div className="item-left">
                              {/* <h3 className="text-xs font-medium text-black uppercase">{product.stockCode}</h3> */}
                              <div className="flex item-left">
                                {attrGroup['clothing.size']?.map(
                                  (size: any, ldx: number) => (
                                    <div
                                      key={ldx}
                                      className="flex justify-around text-brown-light text-12"
                                    >
                                      <span className="font-semibold uppercase">
                                        {size?.value}
                                      </span>
                                    </div>
                                  )
                                )}
                                <span className="flex justify-around mx-1 text-brown-light text-12">
                                  {' '}
                                  •{' '}
                                </span>
                                {attrGroup['global.colour']?.map(
                                  (color: any, ldx: number) => (
                                    <div
                                      key={ldx}
                                      className="flex justify-around w-32 truncate text-ellipsis sm:w-20 text-brown-light text-12"
                                    >
                                      {color?.fieldText}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <div className="item-right">
                              <p className="font-semibold text-black text-14 sm:text-md">
                                {selected.price?.formatted?.withTax}
                                {selected.listPrice?.raw.tax > 0 ? (
                                  <>
                                    <span className="px-2 font-normal text-gray-500 line-through text-14">
                                      {product.listPrice.formatted.withTax}
                                    </span>
                                    <span className="font-normal text-emerald-500 text-14">
                                      {discount}% off
                                    </span>
                                  </>
                                ) : null}
                              </p>
                            </div>
                          </div>
                          <div className="flex px-4 mt-2 sm:px-12">
                            <button
                              type="button"
                              className="flex items-center justify-center px-4 py-3 -mr-0.5 text-black bg-white border-2 border-black rounded-sm hover:bg-gray-800 hover:text-whitesm:px-6 hover:border-gray-900"
                            >
                              <HeartIcon className="flex-shrink-0 w-6 h-6" />
                              <span className="sr-only">
                                {BTN_ADD_TO_FAVORITES}
                              </span>
                            </button>
                            <Button
                              title={callToAction.title}
                              action={callToAction.action}
                              buttonType={callToAction.type || 'cart'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
