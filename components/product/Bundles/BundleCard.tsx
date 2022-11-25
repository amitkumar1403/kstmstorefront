import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { 
  BTN_SEE_MORE_DETAILS, 
  GENERAL_CLOSE, 
  PRODUCT_DESCRIPTION, 
  PRODUCT_INFORMATION, 
  PRODUCT_OPTIONS 
} from '@components/utils/textVariables'

export default function BundleCard({ productData, closeModal }: any) {
  const [activeImage, setActiveImage] = useState(
    productData.image || productData.images[0]?.image
  )
  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={closeModal}
      >
        <div
          className="flex min-h-screen text-center md:block md:px-2 lg:px-4"
          style={{ fontSize: 0 }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            enterTo="opacity-100 translate-y-0 md:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 md:scale-100"
            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          >
            <div className="flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
              <div className="w-full rounded-xl relative flex items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                  onClick={closeModal}
                >
                  <span className="sr-only">{GENERAL_CLOSE}</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <div className="w-full grid grid-cols-1 gap-y-8 gap-x-6 items-start sm:grid-cols-12 lg:gap-x-8">
                  <div className="aspect-w-2 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden sm:col-span-4 lg:col-span-5">
                    <img
                      src={activeImage}
                      alt={productData.images[0]?.alt || ''}
                      className="object-center object-cover"
                    />
                  </div>
                  <div className="sm:col-span-8 lg:col-span-7">
                  <div className='flex flex-col'>
                    <h3 className='text-xs font-semibold text-gray-400'>{productData.brand}</h3>
                    <h3 className='text-2xl font-semibold text-gray-900 sm:pr-12'>{productData.name}</h3>   
                    <h4 className='text-sm mt-1'>
                        <span className='uppercase text-xs font-bold  tex-black inline-block'>SKU:</span>
                        <span className='text-gray-600 inline-block pl-1'>{productData.stockCode}</span>
                    </h4>
                    <h4 className='text-sm text-black mt-2'>
                      <span className='inline-block font-semibold'>{productData.price.formatted.withoutTax}</span>
                      <span className='inline-block pl-3 text-red-400 text-xs font-semibold line-through'>{productData.listPrice.formatted.withoutTax}</span>
                    </h4>
                  </div>

                    <section
                      aria-labelledby="information-heading"
                      className="mt-2"
                    >
                      <h3 id="information-heading" className="sr-only">
                        {PRODUCT_INFORMATION}
                      </h3>
                    </section>
                    <div className="mt-6">
                      <h3 className="sr-only">{PRODUCT_DESCRIPTION}</h3>

                      <div
                        className="text-gray-700 text-sm space-y-6"
                        dangerouslySetInnerHTML={{
                          __html: productData.description,
                        }}
                      />
                    </div>
                    <section
                      aria-labelledby="options-heading"
                      className="mt-6"
                    >
                      <h3 id="options-heading" className="sr-only">
                        {PRODUCT_OPTIONS}
                      </h3>
                      <div className="flex justify-between w-1/2">
                        {productData.images.map(
                          (image: any, imageIdx: number) => {
                            return (
                              <img
                                key={imageIdx}
                                className="h-16 w-16 object-center object-cover border p-1 rounded-md"
                                src={image.image}
                                onClick={() => setActiveImage(image.image)}
                              />
                            )
                          }
                        )}
                      </div>
                      <form>
                        <Link href={`/${productData.slug}`}>
                          <button
                            type="submit"
                            className="mt-6 w-full text-white bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {BTN_SEE_MORE_DETAILS}
                          </button>
                        </Link>
                      </form>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
