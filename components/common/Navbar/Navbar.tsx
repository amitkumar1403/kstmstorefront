import dynamic from 'next/dynamic'

import { FC, Fragment, useState, useRef } from 'react'
import { classNames } from '../../utils'
import { Popover, Transition, Dialog, Tab } from '@headlessui/react'
import { Searchbar } from '@components/common'
import { Logo } from '@components/ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUI } from '@components/ui'
import axios from 'axios'
import { NEXT_SET_CONFIG } from '@components/utils/constants'
import Router from 'next/router'
import Cookies from 'js-cookie'
import { MenuIcon, SearchIcon, XIcon, ShoppingCartIcon, ShoppingBagIcon, HeartIcon, UserIcon } from '@heroicons/react/outline'
const Account = dynamic(() => import('./AccountDropdown'))
const CurrencySwitcher = dynamic(() => import('./CurrencySwitcher'))
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'))
import {
  BTN_SIGN_OUT,
  GENERAL_LOGIN,
  GENERAL_MY_ORDERS,
  GENERAL_RECENTLY_VIEWED,
  GENERAL_REGISTER,
  MY_ACCOUNT_TITLE,
  GENERAL_WORKFLOW_TITLE,
  SELECT_CURRENCY,
  SELECT_LANGUAGE,
  GENERAL_ITEM_IN_CART,
} from '@components/utils/textVariables'

interface Props {
  config: []
  currencies: []
  languages: []
}

const accountDropDownConfigUnauthorized: any = [
  {
    href: '/my-account/login',
    title: GENERAL_LOGIN,
    className:
      'mt-5 max-w-xs flex-1 bg-gray-300 border font-semibold border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full',
  },
  {
    href: '/my-account/register',
    title: GENERAL_REGISTER,
    className:
      'mt-5 max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md op-75 py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full',
  },
]

const Navbar: FC<Props> = ({ config, currencies, languages }) => {
  const router = useRouter()

  const {
    wishListItems,
    cartItems,
    isGuestUser,
    user,
    deleteUser,
    openCart,
    openWishlist,
    setShowSearchBar,
  } = useUI()

  const accountDropDownConfigAuthorized: any = [
    {
      href: '/my-account',
      title: MY_ACCOUNT_TITLE,
      className: 'text-left p-2 cursor-pointer',
    },
    {
      href: '/my-account?view=orders',
      title: GENERAL_MY_ORDERS,
      className: 'text-left p-2 cursor-pointer',
    },
    {
      href: '/my-account?view=details',
      title: GENERAL_RECENTLY_VIEWED,
      className: 'text-left p-2 cursor-pointer',
    },
    {
      href: '/',
      onClick: () => deleteUser(),
      title: BTN_SIGN_OUT,
      className: 'text-left p-2 cursor-pointer text-red-600',
    },
  ]

  let accountDropdownConfig = accountDropDownConfigUnauthorized
  let title = !isGuestUser ? (user.userId ? `Hi, ${user.firstName}` : 'My account') : ""

  if (!isGuestUser && user.userId) {
    accountDropdownConfig = accountDropDownConfigAuthorized
  }

  const configAction = (pair: any) => {
    const value: any = Object.values(pair)[0]
    const key = Object.keys(pair)[0]
    const { pathname, asPath, query } = Router
    Cookies.set(key, value)
    axios
      .post(NEXT_SET_CONFIG, { obj: pair })
      .then(() => {
        Router.reload()
      })
      .catch((err: any) => console.log(err))
  }

  const hyperlinkHandler = (hyperlink: string) => {
    return hyperlink[0] === '/' ? hyperlink : `/${hyperlink}`
  }

  const [open, setOpen] = useState(false)
  
  const buttonRef = useRef<HTMLButtonElement>(null) // useRef<HTMLButtonElement>(null)
  const [openState, setOpenState] = useState(-1)
  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-999 lg:hidden"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative max-w-xs w-full bg-white shadow-xl pb-12 flex flex-col overflow-y-auto z-9999">
              <div className="px-4 pt-5 pb-2 flex">
                <button
                  type="button"
                  className="-m-2 absolute right-4 top-5 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6 text-black" aria-hidden="true" />
                </button>
              </div>

              {/* Links */}
              <Tab.Group as="div" className="mt-2">
                <div className="border-b border-gray-200">
                  {config?.map((item: any, idx: number) => {
                    return (
                      <>
                        {!item.navBlocks.length ? (
                          <Link
                            href={hyperlinkHandler(item.hyperlink)}
                            passHref
                          >
                            <a
                              onClick={() => setOpen(false)}
                              className="flex flex-col whitespace-nowrap py-4 px-4 text-black border-b text-sm font-bold"
                              href={item.hyperlink}
                            >
                              {item.caption}
                            </a>
                          </Link>
                        ) : (
                          <>
                            <Tab.List className="-mb-px flex flex-col px-0 space-x-0">
                              <Tab
                                key={item.caption}
                                className={({ selected }) =>
                                  classNames(
                                    selected
                                      ? 'text-black'
                                      : 'text-black',
                                    'flex flex-col whitespace-nowrap py-4 px-4 text-black border-b text-sm font-bold'
                                  )
                                }
                              >
                                {item.caption}
                              </Tab>
                            </Tab.List>

                            <Tab.Panels as={Fragment}>
                              <Tab.Panel
                                key={item.caption}
                                className="pt-2 pb-0 px-4 space-y-10"
                              >
                                <div className="space-y-4">
                                  {item.navBlocks.length ? (
                                    <div className="relative bg-white">
                                      <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0">
                                        <div className="grid grid-cols-1 items-start md:grid-cols-1 lg:gap-x-8">
                                          {item.navBlocks.map(
                                            (navBlock: any, navIdx: number) => {
                                              return (
                                                <div
                                                  key={navIdx}
                                                  className="grid grid-cols-1 gap-y-0 gap-x-0 lg:gap-x-0"
                                                >
                                                  <div>
                                                    <p className="font-semibold capitalize text-md text-black p-2">
                                                      {navBlock.boxTitle}
                                                    </p>
                                                    <div className="mt-1 border-t py-2 px-2 border-gray-100 pt-2 sm:grid sm:grid-cols-1 sm:gap-x-6">
                                                      <ul
                                                        role="list"
                                                        aria-labelledby="clothing-heading"
                                                        className="grid grid-cols-1"
                                                      >
                                                        {navBlock.navItems.map(
                                                          (navItem: any) => (
                                                            <li
                                                              key={
                                                                navItem.caption
                                                              }
                                                              className="flex my-1 border-b pb-2"
                                                            >
                                                              <Link
                                                                href={`/${navItem.itemLink}`}
                                                                passHref
                                                              >
                                                                <a
                                                                  onClick={() =>
                                                                    setOpen(
                                                                      false
                                                                    )
                                                                  }
                                                                  className="hover:text-gray-800 text-sm"
                                                                >
                                                                  {
                                                                    navItem.caption
                                                                  }
                                                                </a>
                                                              </Link>
                                                            </li>
                                                          )
                                                        )}
                                                      </ul>
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            }
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </Tab.Panel>
                            </Tab.Panels>
                          </>
                        )}
                      </>
                    )
                  })}
                </div>
              </Tab.Group>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <header className="bg-white shadow-md fixed top-0 right-0 z-999 w-full">
        <nav aria-label="Top" className="w-full md:w-4/5 mx-auto px-4 sm:px-0 lg:px-0">
          <div className="pb-0 sm:px-0 sm:pb-0">
            <div className="h-16 flex items-center justify-between">
              {/* Logo */}
              <button
                type="button"
                className="-ml-2 bg-white py-4 pl-2 pr-2 rounded-md text-gray-400 sm:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6 text-black" aria-hidden="true" />
              </button>

              <Link href="/">
                <div className="w-32 flex cursor-pointer">
                  <span className="sr-only">{GENERAL_WORKFLOW_TITLE}</span>
                  <Logo />
                </div>
              </Link>

              {/* Flyout menus */}
              <Popover.Group className="absolute bottom-0 inset-x-0 sm:static w-full sm:self-stretch sm:block hidden sm:h-16">
                <div className="border-t h-16 px-6 flex space-x-8 overflow-x-auto pb-px sm:h-full sm:border-t-0 sm:justify-left sm:overflow-visible sm:pb-0">
                  {config?.map((item: any, idx: number) => {
                    return (
                      <Popover key={idx} className="flex" 
                          onMouseEnter={() => setOpenState(idx)}
                          onMouseLeave={() => setOpenState(-1)}  >
                        {({ open }) => (
                          <>
                            {!item.navBlocks.length ? (
                              <Link href={`/${item.hyperlink}`} passHref>
                                <a
                                  className="relative flex"
                                  href={item.hyperlink}
                                >
                                  <Popover.Button
                                    className={classNames(
                                      openState == idx
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-black hover:text-black',
                                        'relative z-10 flex items-center sm:h-16 transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px'
                                      )}
                                  >
                                    {item.caption}
                                  </Popover.Button>
                                </a>
                              </Link>
                            ) : (
                              <Popover.Button
                                className={classNames(
                                  openState == idx
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-black hover:text-black',
                                    'relative z-10 flex items-center sm:h-16 transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px'
                                )}
                              >
                                {item.caption}
                              </Popover.Button>
                            )}
                            {item.navBlocks.length ? (
                              <Transition
                                show={openState == idx}
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Popover.Panel className="absolute top-full z-999 inset-x-0 text-gray-500 sm:text-sm">
                                  {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                  <div
                                    className="absolute top-1/2 bg-white shadow"
                                    aria-hidden="true"
                                  />

                                  <div className="relative bg-white">
                                    <div className="w-4/5 mx-auto px-4 sm:px-0 lg:px-0">
                                      <div className="grid grid-cols-1 items-start gap-y-10 gap-x-6 pt-10 pb-12 md:grid-cols-1 lg:gap-x-8">
                                        {item.navBlocks.map(
                                          (navBlock: any, navIdx: number) => {
                                            return (
                                              <div
                                                key={navIdx}
                                                className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8"
                                              >
                                                <div>
                                                  <p className="font-semibold capitalize text-xl text-gray-900">
                                                    {navBlock.boxTitle}
                                                  </p>
                                                  <div className="mt-4 border-t border-gray-100 pt-6 sm:grid sm:grid-cols-1 sm:gap-x-6">
                                                    <ul
                                                      role="list"
                                                      aria-labelledby="clothing-heading"
                                                      className="grid grid-cols-5"
                                                    >
                                                      {navBlock.navItems.map(
                                                        (navItem: any) => (
                                                          <li
                                                            key={
                                                              navItem.caption
                                                            }
                                                            className="flex my-2"
                                                          >
                                                            <Link
                                                              href={`/${navItem.itemLink}`}
                                                              passHref
                                                            >
                                                              <a className="hover:text-gray-800">
                                                                <Popover.Button
                                                                  className={classNames(
                                                                    openState == idx
                                                                      ? ''
                                                                      : 'border-gray-200 text-gray-700 hover:text-gray-800',
                                                                    'relative z-10 flex items-center transition-colors ease-out duration-200 text-md font-normal text-gray-600 hover:text-pink hover:font-semibold -mb-px pt-px'
                                                                  )}
                                                                >
                                                                  {
                                                                    navItem.caption
                                                                  }
                                                                </Popover.Button>
                                                              </a>
                                                            </Link>
                                                          </li>
                                                        )
                                                      )}
                                                    </ul>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            ) : null}
                          </>
                        )}
                      </Popover>
                    )
                  })}
                </div>
              </Popover.Group>
              <div className="flex-1 flex items-center justify-end">
                {/* Search */}
                <Searchbar onClick={setShowSearchBar} />
                {/* account */}
                <Account title={title} config={accountDropdownConfig} />
                {/* currency */}
                <div className="sm:flex hidden">
                  <CurrencySwitcher
                    config={currencies}
                    title={SELECT_CURRENCY}
                    action={configAction}
                  />
                  <LanguageSwitcher
                    title={SELECT_LANGUAGE}
                    action={configAction}
                    config={languages}
                  />
                </div>

                {/* Wishlist*/}

                <div className="px-1 w-10 sm:w-16 flow-root">
                  <button
                    className="relative group grid grid-cols-1 items-center text-center align-center justify-center flex-col mx-auto"
                    onClick={openWishlist}
                  >
                    <HeartIcon
                      className="flex-shrink-0 h-6 w-6 block text-black group-hover:text-red-600 mx-auto"
                      aria-hidden="true" aria-label="Wishlist"
                    />
                    <span className='font-normal hidden text-sm text-black sm:block'>Wishlist</span>
                    {wishListItems.length > 0 &&
                     <span className="ml-2 hidden sm:block absolute top-0 -right-0 w-4 h-4 text-white rounded-full bg-pink text-center text-xs font-medium">                     
                          {wishListItems.length}
                      </span>
                    }
                      <span className="sr-only">{GENERAL_ITEM_IN_CART}</span>                    
                  </button>
                </div>
                {/* Cart */}

                <div className="px-1 sm:w-16 w-10 flow-root">
                  <button
                    className="group grid relative grid-cols-1 items-center text-center align-center justify-center flex-col mx-auto"
                    onClick={openCart}
                  >
                    <ShoppingCartIcon
                      className="flex-shrink-0 h-6 w-6 block text-black group-hover:text-gray-500 mx-auto"
                      aria-hidden="true" aria-label="Add to cart"
                    />
                     <span className='font-normal hidden text-sm text-black sm:block'>Cart</span>
                     {cartItems.lineItems?.length > 0 &&
                        <span className="ml-2 absolute -top-1 -right-2 w-4 h-4 text-white rounded-full bg-gray-500 text-center text-xs font-medium">                     
                      {cartItems.lineItems?.length}
                    </span>
}
                    <span className="sr-only">{GENERAL_ITEM_IN_CART}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
export default Navbar
