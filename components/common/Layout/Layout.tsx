import cn from 'classnames'
import React, { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { CommerceProvider } from '@framework'
import { useUI } from '@components/ui/context'
import type { Page } from '@commerce/types/page'
import { Navbar, Footer } from '@components/common'
import type { Category } from '@commerce/types/site'
const ShippingView = dynamic(() => import('@components/checkout/ShippingView'))
const CartSidebarView = dynamic(() => import('@components/cart/CartSidebarView'))
const PaymentMethodView = dynamic(() => import('@components/checkout/PaymentMethodView'))
const CheckoutSidebarView = dynamic(() => import('@components/checkout/CheckoutSidebarView'))
const NotifyUserPopup = dynamic(() => import('@components/ui/NotifyPopup'))
const SearchWrapper = dynamic(() => import('@components/search/index'))
const ProgressBar = dynamic(() => import('@components/ui/ProgressBar'))
import { WishlistSidebarView } from '@components/wishlist'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import { Sidebar, Button, Modal, LoadingDots } from '@components/ui'
import s from './Layout.module.css'
import { getData } from '../../utils/clientFetcher'
import { setItem, getItem } from '../../utils/localStorage'
import Script from 'next/script'
import { NEXT_GET_NAVIGATION } from '@components/utils/constants'
import Router from 'next/router'
import {
  BTN_ACCEPT_COOKIE,
  GENERAL_COOKIE_TEXT,
} from '@components/utils/textVariables'
const Loading = () => (
  <div className="w-80 h-80 flex items-center text-center fixed z-50 justify-center p-3">
    <LoadingDots />
  </div>
)

const dynamicProps = {
  loading: Loading,
}

const FeatureBar = dynamic(() => import('@components/common/FeatureBar'), {
  ...dynamicProps,
})

interface Props {
  pageProps: {
    pages?: Page[]
    categories: Category[]
  }
  nav: []
  footer: []
  isLocationLoaded: boolean
  config: any
  keywords: []
}

const ModalView: FC<{ modalView: string; closeModal(): any }> = ({
  modalView,
  closeModal,
}) => {
  return (
    <Modal onClose={closeModal}>{modalView === 'NOTIFY_USER' && null}</Modal>
  )
}

const ModalUI: FC = () => {
  const { displayModal, closeModal, modalView, notifyUser, productId } = useUI()
  if (notifyUser) return <NotifyUserPopup />
  if (displayModal)
    return <ModalView modalView={modalView} closeModal={closeModal} />
  return null
}

const SidebarView: FC<{ sidebarView: string; closeSidebar(): any }> = ({
  sidebarView,
  closeSidebar,
}) => {
  return (
    <Sidebar onClose={closeSidebar}>
      {sidebarView === 'CART_VIEW' && <CartSidebarView />}
      {sidebarView === 'WISHLIST_VIEW' && <WishlistSidebarView />}
      {sidebarView === 'CHECKOUT_VIEW' && <CheckoutSidebarView />}
      {sidebarView === 'PAYMENT_VIEW' && <PaymentMethodView />}
      {sidebarView === 'SHIPPING_VIEW' && <ShippingView />}
    </Sidebar>
  )
}

const SidebarUI: FC = () => {
  const { displaySidebar, closeSidebar, sidebarView } = useUI()
  return displaySidebar ? (
    <SidebarView sidebarView={sidebarView} closeSidebar={closeSidebar} />
  ) : null
}

interface LayoutProps {
  nav: []
  footer: []
}

const Layout: FC<Props> = ({
  children,
  config,
  pageProps: { categories = [], ...pageProps },
  keywords,
  isLocationLoaded,
}) => {
  const navTreeFromLocalStorage = getItem('navTree') || { nav: [], footer: [] }
  const [isLoading, setIsLoading] = useState(false)
  const { showSearchBar, setShowSearchBar } = useUI()
  const [data, setData] = useState(navTreeFromLocalStorage)

  const { appConfig, setAppConfig } = useUI()

  //check if nav data is avaialbel in LocalStorage, then dont fetch from Server/API
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const response: any = await getData(NEXT_GET_NAVIGATION)
        setData(response)
        setItem('navTree', response)
      } catch (error) {
        console.log(error, 'error')
      }
    }
    fetchLayout()
    setAppConfig(config)
  }, [])

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setIsLoading(true))
    Router.events.on('routeChangeComplete', () => setIsLoading(false))

    if (!document.title) {
      document.title = document.location.host;
    }

    return () => {
      Router.events.off('routeChangeStart', () => {
      });
      Router.events.off('routeChangeComplete', () => {
      });
    }
  }, [])

  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
  const { locale = 'en-US', ...rest } = useRouter()

  const sortedData = data.nav?.sort(
    (a: any, b: any) => a.displayOrder - b.displayOrder
  )
  return (
    <CommerceProvider locale={locale}>
      {/* <Script
        src="https://engage-asset.bettercommerce.io/_plugins/min/bc/v1/js/ch.js"
        strategy="beforeInteractive"
      /> */}

      {isLoading && <ProgressBar />}
      <div className={cn(s.root)}>
        {showSearchBar && (
          <SearchWrapper
            keywords={keywords}
            closeWrapper={() => setShowSearchBar(false)}
          />
        )}
        <Navbar
          currencies={config?.currencies}
          config={sortedData}
          languages={config?.languages}
        />
        <main className="fit pt-16">{children}</main>
        <Footer config={data.footer} />
        <ModalUI />
        <SidebarUI />
        <FeatureBar
          title={GENERAL_COOKIE_TEXT}
          hide={acceptedCookies}
          action={
            <Button className="mx-5" onClick={() => onAcceptCookies()}>
              {BTN_ACCEPT_COOKIE}
            </Button>
          }
        />
      </div>
    </CommerceProvider>
  )
}

export default Layout
