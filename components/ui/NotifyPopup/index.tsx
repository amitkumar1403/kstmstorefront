import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { useUI } from '@components/ui/context'
import axios from 'axios'
import { NEXT_API_NOTIFY_ME_ENDPOINT } from '@components/utils/constants'
import { validate } from 'email-validator'

export default function NotifyUserPopup() {
  const [email, setEmailAddress] = useState('')
  const [isPostedMessage, setIsPosted] = useState('')

  const cancelButtonRef = useRef(null)

  const { closeNotifyUser, productId } = useUI()

  const isValidEmail = validate(email)

  const handleModal = () => {
    const postEmail = async () => {
      const result = await axios.post(
        `${NEXT_API_NOTIFY_ME_ENDPOINT}?email=${email}&productId=${productId}`
      )
      if (result.data) {
        setIsPosted('Success')
        setTimeout(() => {
          closeNotifyUser()
        }, 1500)
      } else {
        setIsPosted('Woops! Something went wrong')
        setTimeout(() => {
          closeNotifyUser()
        }, 1500)
      }
    }
    if (email && isValidEmail) postEmail()
  }

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={closeNotifyUser}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"></div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Notify me
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Be the ﬁrst to know when your size is back in stock
                      </p>
                      {isPostedMessage ? (
                        <div className="text-indigo-600 font-semibold">
                          {isPostedMessage}
                        </div>
                      ) : (
                        <form className="mt-2 py-5 flex sm:max-w-md">
                          <label htmlFor="email-address" className="sr-only">
                            Email address
                          </label>
                          <input
                            id="email-address"
                            type="text"
                            autoComplete="email"
                            onChange={(e) =>
                              setEmailAddress(e.currentTarget.value)
                            }
                            placeholder="Email Address"
                            required
                            className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {isPostedMessage ? null : (
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={!isValidEmail}
                    style={
                      !isValidEmail
                        ? { opacity: '75%', pointerEvents: 'none' }
                        : {}
                    }
                    className="w-full inline-flex justify-center rounded-md bg-indigo-600 border border-transparent shadow-sm px-4 py-2 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleModal()}
                  >
                    Notify me
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeNotifyUser}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
