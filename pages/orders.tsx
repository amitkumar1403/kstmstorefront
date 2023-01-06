import { useState, useEffect, Fragment } from 'react'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Tab } from '@headlessui/react'
import { config } from '@components/utils/myAccount'
import COMPONENTS_MAP from '@components/account'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'

import React from 'react'
import MyDetails from '@components/account/MyDetails'
import MyOrders from '@components/account/MyOrders'
function MyAccount({ defaultView, isLoggedIn }: any) {
  const [isShow, setShow] = useState(true)
  const [view, setView] = useState(defaultView)
  const router = useRouter()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  useEffect(() => {
    if (router.query.view && view !== router.query.view) {
      setView(router.query.view)
    }
  }, [router.asPath])

  const { user, deleteUser } = useUI()

  let loggedInEventData: any = {
    eventType: CustomerProfileViewed,
  }

  if (user && user.userId) {
    loggedInEventData = {
      ...loggedInEventData,
      entity: JSON.stringify({
        email: user.email,
        dateOfBirth: user.yearOfBirth,
        gender: user.gender,
        id: user.userId,
        name: user.firstName + user.lastName,
        postCode: user.postCode,
      }),
      entityId: user.userId,
      entityName: user.firstName + user.lastName,
      entityType: Customer,
    }
  }
  const [active, setActive] = useState(false)

  const handleClick = () => {
    setActive(!active)
  }
  useAnalytics(CustomerProfileViewed, loggedInEventData)

  return (
    <section className="relative pb-10 text-gray-900">
      <div className="w-full px-0 mx-auto sm:container sm:px-0 lg:px-0">
        <div className="grid w-full grid-cols-12 px-4 pt-16 sm:px-2 sm:pr-0 main-account-grid">
          <div className="col-span-3 border-r border-gray-600 md:pl-12 sm:pl-6 tab-list-sm sm:pt-10 mob-hidden">
            <div className="sticky left-0 z-10 flex flex-col top-36 sm:px-2">
              {config.map((item: any, idx: number) => (
                <>
                  <div
                    key={`my-acc-${idx}`}
                    // href="#"
                    className={`hover:bg-white hover:text-indigo-600 border border-transparent text-md leading-3 font-medium text-gray-900 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"}`}
                  >
                    <span className="pr-2 leading-none align-middle acc-mob-icon-i sm:absolute top-2/4 -translate-y-2/4">
                      <i
                        className={
                          item.text.toLowerCase() + ' ' + 'sprite-icon'
                        }
                      ></i>
                    </span>

                    {item.text == 'My Profile' ? (
                      <>
                        <div
                          key={`my-acc-${idx}`}
                          // href="#"
                          className={`ring-white relative ring-opacity-60 border-b border-slate-300 sm:border-0 cursor-pointer ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2  w-full text-14  leading-5 text-left pl-4 ${
                            item.text == 'My Saved Address'
                              ? 'bg-white border-r-0  sm:border-b-0 sm:border-r-2 sm:border-black font-bold opacity-full'
                              : 'text-primary font-medium opacity-60'
                          }`}
                        >
                          <span className="pr-2 leading-none align-middle acc-mob-icon-i sm:absolute top-2/4 -translate-y-2/4">
                            <i
                              className={
                                item.text.toLowerCase() + ' ' + 'sprite-icon'
                              }
                            ></i>
                          </span>
                          <Link
                            shallow={true}
                            href={item.href}
                            passHref
                            onClick={() => {
                              handleClick
                              setShow(false)
                            }}
                            className="inline-block w-full h-full py-4 text-sm text-primary"
                          >
                            <span className="inline-block sm:hidden">
                              {item.mtext}
                            </span>
                            <span className="hidden text-xs sm:inline-block">
                              {item.text}
                            </span>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link shallow={true} href={item.href} passHref
                            onClick={() => {
                              handleClick
                            }}
                            className="inline-block w-full h-full py-4 text-sm text-primary"
                          >
                            <span className="inline-block sm:hidden">
                              {item.mtext}
                            </span>
                            <span className="hidden sm:inline-block">
                              {item.text}
                            </span>
                        </Link>
                      </>
                    )}
                  </div>
                </>
              ))}
            </div>
          </div>

          <div
            className={`relative col-span-9 lg:col-span-8 md:col-span-8 border-l tabpanel-sm mob-tab-full ${
              isShow ? `mob-hidden` : ''
            }`}
          >
            <div className={'orders bg-white my-2 sm:my-6 pl-12'}>
              <MyOrders />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

MyAccount.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page

export async function getServerSideProps(context: any) {
  const defaultIndex =
    config.findIndex((element: any) => element.props === context.query.view) ||
    0
  return {
    props: { defaultView: defaultIndex }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyAccount), PAGE_TYPE, true)
