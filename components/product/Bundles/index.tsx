import { ChangeEvent, useState } from 'react'
import BundleCard from './BundleCard'

import {
  BUNDLE_TEXT,
  GENERAL_ADD_TO_BASKET,
  //GENERAL_COLOUR,
  //GENERAL_SIZE,
  YOUR_BUNDLE_INCLUDE
} from '@components/utils/textVariables'
import { Guid } from '@commerce/types'
import { ColorFilledSquare } from '@components/ui/ColorFilledSquare'


export default function Bundles({ price = '', products = [], productBundleUpdate = () => { } }: any) {
  const [productData, setProductData] = useState(null)
  const handleProduct = (product: any) => {
    setProductData(product);
    if (productBundleUpdate) {
      productBundleUpdate(product);
    }
  }

  const getSizeSelection = (value: string, product: any) => {
    if (product && product.stockCode) {
      const stockCode = product.stockCode;
      const productSize = stockCode.substring(stockCode.lastIndexOf("-") + 1);
      return (productSize && productSize.toLowerCase() === value.toLowerCase());
    }
    return "";
  };

  const handleSizeChanged = (ev: ChangeEvent<HTMLSelectElement>, product: any) => {
    //debugger
    const target = ev.target;
    if (target && product) {
      const size = target.value;
      if (size && product.stockCode) {
        const stockCode = product.stockCode;
        product.stockCode = `${stockCode.substring(0, stockCode.lastIndexOf("-") + 1)}${size.toUpperCase()}`;
        handleProduct(product);
      }
    }
  };

  const getProductColorHexCode = (product: any) => {
    if (product && product.customAttributes && product.customAttributes.length) {
      const colorAttr = product.customAttributes.find((attr: any) => attr.key === "global.colour");
      if (colorAttr) {
        return colorAttr.value;
      }
    }
    return "#FFF";
  }

  return (
    <section
      aria-labelledby="bundles-heading"
      className="border-t border-gray-200 pt-4 px-4 sm:px-0"
    >
      <h2
        id="bundles-heading"
        className="text-center text-3xl font-bold text-gray-900"
      >
        {YOUR_BUNDLE_INCLUDE}
      </h2>
      <p className="text-center text-sm text-gray-400">
        {BUNDLE_TEXT}
      </p>
      <div className="flex justify-between items-center mt-3">
        <div className="flex py-5 grid md:grid-cols-3 sm:grid-cols-2 xl-grid-cols-3 text-left gap-x-5 align-center content-center ">
          {products.map((product: any, productIdx: number) => {
            return (
              <div key={productIdx} className='grid grid-cols-12 gap-x-2 border p-3 rounded-md align-center content-center border-gray-200 hover:border-indigo-200'>
                {/*JSON.stringify(product)*/}
                <div onClick={() => handleProduct(product)} className='col-span-4 image-container cursor-pointer'>
                  <img
                    className="mx-auto object-center object-cover image rounded-md"
                    src={product.image || product.images[0]?.image}
                  />
                </div>
                <div className='col-span-8'>
                  <div className='flex flex-col'>
                    <h3 className='text-xs font-semibold text-gray-400'>{product.brand}</h3>
                    <h3 onClick={() => handleProduct(product)} className='text-sm text-gray-700 font-semibold hover:text-indigo-600 mt-1 cursor-pointer'>{product.name}</h3>
                    <h4 className='text-sm mt-1'>
                      <span className='uppercase text-xs font-bold  tex-black inline-block'>SKU:</span>
                      <span className='text-gray-600 inline-block pl-1'>{product.stockCode}</span>
                    </h4>
                    <h4 className='text-sm text-black mt-2'>
                      <span className='inline-block font-semibold'>{product.price.formatted.withoutTax}</span>
                      {
                        (product.listPrice.raw.withoutTax > 0) && (
                          <span className='inline-block pl-3 text-red-400 text-xs font-semibold line-through'>{product.listPrice.formatted.withoutTax}</span>
                        )}
                    </h4>
                    <h4 className='text-sm mt-1'>
                      <span className='uppercase text-xs font-bold  tex-black inline-block'>Colour:</span>
                      <span className='text-gray-600 inline-block pl-1'>
                        <ColorFilledSquare width={10} height={10} bgColor={getProductColorHexCode(product)} />
                      </span>
                    </h4>
                  </div>
                  <div className='flex flex-col mt-1'>
                    {product.variantAttributes.map((attribute: any, aid: number) => {
                      if (attribute.fieldName == "Size") {
                        return (
                          <>
                            <div className='flex flex-col mt-1' key={aid}>
                              <label className='font-semibold text-black text-sm'>{attribute.fieldName}:</label>
                              <select className='p-2 border border-gray-400 rounded-sm font-semibold text-sm text-black uppercase' onChange={(ev) => handleSizeChanged(ev, product)}>
                                {/*<option value="">Please Select</option>*/}
                                {attribute.fieldValues.map((size: any, vdx: number) => {
                                  return (<option className='uppercase' key={vdx} value={size.fieldValue} selected={getSizeSelection(size.fieldValue, product)}>{size.fieldValue}</option>)
                                })}
                              </select>
                            </div>
                          </>
                        )
                      }
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col border border-gray-100 rounded-md bg-gray-50 p-3 items-right justify-end">
        <p className="text-md font-semibold text-black flext-col align-right item-right text-right">Bundle Price</p>
        <p className="text-gray-900 text-3xl font-bold flex-col flex align-right item-right pb-2 text-right">{price}</p>
        {/* <button
          type="submit"
          onClick={() => {}}
          className="max-w-xs flex bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex-col ml-auto items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
        >
          {GENERAL_ADD_TO_BASKET}
        </button> */}
      </div>
      {productData && (
        <BundleCard
          closeModal={() => handleProduct(null)}
          productData={productData}
        />

      )}
    </section>
  )
}