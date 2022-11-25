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
function MyAccount({ defaultView, isLoggedIn }: any) {
  const [view, setView] = useState(defaultView)
  const router = useRouter()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  useEffect(() => {
    if (router.query.view && view !== router.query.view) {
      setView(router.query.view)
    }
  }, [router.asPath])

  const { user } = useUI()

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

  useAnalytics(CustomerProfileViewed, loggedInEventData)

  return (
    <section className="relative py-10 text-gray-900">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between md:flex-row">
          <Tab.Group vertical defaultIndex={defaultView}>
            <Tab.List className="sticky top-0 flex flex-col w-full h-full rounded-lg md:w-1/4 bg-gray-50">
              {config.map((item: any, idx: number) => {
                return (
                  <Tab
                    key={`my-acc-${idx}`}
                    as="div"
                    // href="#"

                    className={({ selected }: any) => {
                      return `${
                        selected
                          ? 'bg-white text-indigo-600 border border-indigo-600'
                          : ''
                      } hover:bg-white hover:text-indigo-600 border border-transparent text-md leading-3 font-medium text-gray-900 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60`
                    }}
                  >
                    <Link
                      key={idx}
                      href={{
                        pathname: router.pathname,
                        query: { ...router.query, view: item.props },
                      }}
                      passHref
                      shallow={true}
                    >
                      <a className="block h-full px-5 py-5">{item.text}</a>
                    </Link>
                  </Tab>
                )
              })}
            </Tab.List>
            <Tab.Panels className="w-3/4">
              {config.map((item: any, idx: any) => {
                let Component = COMPONENTS_MAP[item.props] || null
                return (
                  <Tab.Panel
                    className={item.props + ' ' + 'text-gray-900'}
                    key={idx}
                  >
                    <Component />
                  </Tab.Panel>
                )
              })} 
            </Tab.Panels>
          </Tab.Group>
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

export default withDataLayer(withAuth(MyAccount), PAGE_TYPE)
