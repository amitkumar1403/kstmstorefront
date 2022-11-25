import { Modal } from '@components/ui'
import { Formik, Field, Form } from 'formik'
import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios'
import { NEXT_GET_RETURN_DATA } from '@components/utils/constants'
import LoadingDots from '@components/ui/LoadingDots'
import { BTN_SUBMIT } from '@components/utils/textVariables'
import * as Yup from 'yup'

export default function ReturnModal({
  handleClose,
  returnData,
  handlePostReturn,
}: any) {
  const [isOpen, setIsOpen] = useState(false)
  const [orderReturnData, setOrderReturnData] = useState(null)

  useEffect(() => {
    if (!isOpen && returnData.order.id) handleClose()
  }, [isOpen])

  const getReturnData = async () => {
    if (!orderReturnData)
      try {
        let { data }: any = await axios.post(NEXT_GET_RETURN_DATA, {
          orderId: returnData.order.id,
        })
        setOrderReturnData(data.response.result)
      } catch (error) {
        console.log(error)
      }
  }
  useEffect(() => {
    if (returnData.order.id && !isOpen) {
      setIsOpen(true)
    }
    if (returnData.order.id) {
      getReturnData()
    }
  }, [returnData])

  const onClose = () => {
    setIsOpen(false)
    setOrderReturnData(null)
  }

  if (!isOpen) return null

  const validationSchema = Yup.object({
    comment: Yup.string().min(5).required('Please leave a comment'),
    reasonsForReturn: Yup.string().required(),
    requiredActions: Yup.string().required(),
  })

  const config = [
    {
      placeholder: 'Reason',
      label: 'Select reason',
      as: 'select',
      name: 'reasonsForReturn',
    },
    {
      placeholder: 'Required action',
      label: 'Select action',
      as: 'select',
      name: 'requiredActions',
    },
    {
      placeholder: 'Comment',
      label: 'Leave a comment',
      as: 'text',
      name: 'comment',
    },
  ]

  let isLoading = isOpen && !orderReturnData

  const handleDataSubmit = (data: any) => {
    const isCreated = handlePostReturn({
      ...data,
      faultReason: (orderReturnData as any).faultReason,
      uploadFileUrls: (orderReturnData as any).uploadFileUrls,
    })
    setOrderReturnData(null)
    if (isCreated) onClose()
  }

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={onClose}
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
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex justify-center items-center flex-col">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Create return
                    </Dialog.Title>
                    <div className="mt-2 flex justify-center items-center text-gray-900">
                      {isLoading ? (
                        <LoadingDots />
                      ) : (
                        <Formik
                          validationSchema={validationSchema}
                          initialValues={{
                            reasonsForReturn: (orderReturnData as any)
                              .reasonsForReturn[0].itemValue,
                            requiredActions: (orderReturnData as any)
                              .requiredActions[0].itemValue,
                          }}
                          onSubmit={handleDataSubmit}
                        >
                          {({
                            errors,
                            touched,
                            handleSubmit,
                            values,
                            handleChange,
                            isSubmitting,
                            handleBlur,
                          }: any) => (
                            <Form onSubmit={handleSubmit}>
                              {!!orderReturnData &&
                                config.map((item: any, idx: number) => {
                                  const findItemInOrderData: any = (
                                    orderReturnData as any
                                  )[item.name]
                                  const sortedItems: any =
                                    findItemInOrderData?.sort(
                                      (a: any, b: any) =>
                                        a.displayOrder - b.displayOrder
                                    )
                                  return (
                                    <div key={idx}>
                                      <label className="text-gray-700 text-md font-semibold">
                                        {item.label}
                                      </label>
                                      {item.as === 'select' ? (
                                        <select
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          name={item.name}
                                          value={values[item.name]}
                                          className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
                                        >
                                          {sortedItems.map(
                                            (i: any, sortedIdx: number) => {
                                              return (
                                                <option
                                                  key={sortedIdx + i.itemValue}
                                                  value={i.itemValue}
                                                >
                                                  {i.itemText}
                                                </option>
                                              )
                                            }
                                          )}
                                        </select>
                                      ) : (
                                        <textarea
                                          className="text-gray-900 bg-gray-100 rounded border border-gray-400 leading-normal w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                                          placeholder={item.placeholder}
                                          value={values[item.name]}
                                          name={item.name}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          required
                                        />
                                      )}
                                    </div>
                                  )
                                })}
                              <button
                                type="submit"
                                className="my-4 max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                              >
                                {isSubmitting ? <LoadingDots /> : BTN_SUBMIT}
                              </button>
                            </Form>
                          )}
                        </Formik>
                      )}
                    </div>
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
