import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XIcon } from '@heroicons/react/outline'
import axios from 'axios'
import Form from './form'
import { GENERAL_CLOSE, GENERAL_ENGRAVING, GENERAL_ENGRAVING_PERSONALIZE_BOTTLE } from '@components/utils/textVariables'
import { Product } from '@commerce/types'
import Image from 'next/image'
export default function Engraving({
  onClose = () => { },
  engravingPrice = '£20',
  show = false,
  submitForm,
  product,
  showEngravingModal
}: any) {

  const closeModal = () => {
    showEngravingModal(false);
    window.location.reload();
  }
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => closeModal()}
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
            <Dialog.Overlay className="inset-0 transition-opacity bg-opacity-75 md:block" />
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
            <div className="flex w-full text-base text-left transition transform md:inline-block md:max-w-lg md:px-4 md:my-8 md:align-middle lg:max-w-xl">
              <div className="relative flex items-center w-full px-4 pb-8 overflow-hidden bg-white shadow-2xl pt-14 sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-xl">
                <button
                  type="button"
                  className="absolute text-gray-400 top-4 right-4 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                  // className="absolute w-4 h-4 p-1 text-black border-none rounded-none opacity-50 btn-close top-4 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  onClick={() => closeModal()}
                >
                  <span className="sr-only">{GENERAL_CLOSE}</span>
                  <XIcon className="w-6 h-6 text-black" aria-hidden="true" />
                </button>
                {/* <div className="text-gray-900">hello</div>  */}
                <section className="flex flex-col w-full p-0">
                  <div className="flex flex-col py-0">
                    {/* {JSON.stringify(product)} */}

                    <img src='/KSTMize.jpg' className='w-24 h-4'></img>
                    <span className="py-2 text-gray-500 text-md">
                      {'Personalise with custom embroidery only for '} {engravingPrice}{' '}
                    </span>
                  </div>
                  <div className='flex'>
                    <div className='w-1/2'>
                      {/* {JSON.stringify(product.image)} */}
                      <label className='text-sm font-bold'>{product.name}</label>
                      <Image
                        layout='fixed'
                        width={220}
                        height={300}
                        src={product.image || '/pdp1.png'}
                        className='w-full ' />
                    </div>
                    <div className='w-1/2 p-4'>
                      <Form submitForm={submitForm} />
                    </div>
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
