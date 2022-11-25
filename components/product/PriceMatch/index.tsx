import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XIcon } from '@heroicons/react/outline'
import Form from './form'
import axios from 'axios'
import { NEXT_API_PRICE_MATCH_ENDPOINT } from '@components/utils/constants'

export default function PriceMatch({
  show,
  onClose,
  productImage,
  productId,
  stockCode,
  productName,
  ourCost,
  ourDeliveryCost,
  rrp,
}: any) {
  const submitContactForm = (values: any) => {
    const priceMatch = {
      productId: productId,
      stockCode: stockCode,
      productName: productName,
      ourCost: ourCost,
      ourDeliveryCost: ourDeliveryCost,
      webSiteName: values.webSiteName,
      directLinkUrl: values.websiteLink,
      competitorCost: values.costOfProduct,
      competitorDeliveryCost: values.competitorDeliveryCost,
      competitorTotalCost: values.totalCost,
      customerName: values.name,
      customerEmail: values.email,
      customerTelephone: values.phone,
      isValid: true,
      email: values.email,
      rrp: rrp,
    }
    const submitContactFormAsync = async () => {
      await axios.post(NEXT_API_PRICE_MATCH_ENDPOINT, priceMatch)
      onClose(false)
    }
    submitContactFormAsync()
  }

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => onClose(false)}
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
              <div className="w-full relative flex items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                  onClick={() => onClose(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                {/* <div className="text-gray-900">hello</div>  */}
                <section className="flex py-10">
                  <div className="w-1/2 bg-gray-50 p-2">
                    <p className="py-5 text-black font-bold text-justify">
                      Find it cheaper & we'll match the price plus 15% of the
                      difference! terms apply Like the reasurrance of buying
                      from one of the largest independent retailers in the
                      country but don't like the idea of paying too much? Not a
                      problem! We work hard every day to bring you the best
                      possible prices. But sometimes, somewhere, someone is
                      selling the item you want for less. Let us help!
                    </p>
                    <img
                      src={productImage}
                      className="h-96 w-96 object-cover object-top"
                    />
                    <p className="text-black font-bold text-center py-5">
                      {productName}
                    </p>
                  </div>
                  <div className="px-5 w-1/2">
                    <p className="text-black center font-bold text-lg text-center py-5">
                      Contact
                    </p>
                    <Form submitContactForm={submitContactForm} />
                  </div>
                </section>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
