import { FC, useState } from 'react'
import Link from 'next/link'
import type { Page } from '@commerce/types/page'
import { Logo } from '@components/ui'
import config from './config'
import { useRouter } from 'next/router'
import { useUI } from '@components/ui';
import {
  BTN_SUBSCRIBE,
  COPYRIGHT_FOOTER_INFO,
  GENERAL_EMAIL_ADDRESS,
  GENERAL_FOOOTER,
  SIGN_UP_FOR_NEWSLETTER,
  CUSTOM,
  SIGN_UP_TEXT,
  QUERY,
  NEW_PRODUCT,
  TOUCH,
} from '@components/utils/textVariables'
import { NEXT_SUBSCRIBE } from '@components/utils/constants'
import axios from 'axios'

interface Props {
  config: []
}

const Footer: FC<Props> = ({ config }) => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [userName, setName] = useState('')
  const [isMessage, setMessage] = useState(false)
  const { setAlert } = useUI();
  const handleRedirect = (path: string) => (path ? router.push(path) : {})
  const handleChange = (e: any) => {
    setValue(e.target.value)
  }

  const handleNameChange = (e: any) => {
    setName(e.target.userName)
  }
  const submitSubscription = async (data: any, fname: any) => {
    await axios.post(NEXT_SUBSCRIBE, {
      email: data,
      firstName: fname,
      notifyByEmail: true,
    })
    setMessage(true);
    setTimeout(() => {
      setMessage(false);
      setValue('')
      setName('')
    }, 3000);


  }

  return (
    <footer aria-labelledby="footer-heading" className="p-2 mt-5 bg-black">
      <h2 id="footer-heading" className="sr-only">
        {GENERAL_FOOOTER}
      </h2>
      {/* <div className="mt-12 md:mt-0 md:row-start-2 md:col-start-3 md:col-span-8 lg:row-start-1 lg:col-start-7 lg:col-span-6"> */}
      <div className="grid grid-cols-2 gap-0 py-3 mt-4">
        <h1 className="pt-5 ml-20 font-bold text-white uppercase lg:text-xl md:text-lg sm:text-md xl:text-2xl">
          {QUERY}
          {/* {SIGN_UP_TEXT} */}
        </h1>
        <div className="flex justify-center mb-8">
          <div className="pt-2 my-auto">
            <form className="flex mt-2 sm:max-w-md">
              <div className="flex-shrink-0 w-48 ml-4 border sm:w-64 md:w-64 lg:w-96 xl:w-96">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-6 py-4 font-medium text-white uppercase bg-black border border-transparent rounded-sm shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  {TOUCH}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <hr className="pt-2 pb-6 text-white" />
      <div className="w-full px-4 sm:mx-auto md:mx-auto lg:ml-20 xl:ml-20 sm:w-4/5 sm:px-0 lg:px-0">
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-x-12">
          {/* Image section */}
          <div className="pb-2 mt-2">
            <p className="text-left text-white lg:text-xl md:text-lg dm:text-lg">
              {CUSTOM}
            </p>
            <span className="text-sm text-left text-white">{NEW_PRODUCT}</span>
            <form>
              <div className="w-full newsletter-form">
                <div className="w-full py-4">
                  <label htmlFor="email-address" className="sr-only">
                    {GENERAL_EMAIL_ADDRESS}
                  </label>
                </div>
                <div className="flex justify-between">
                  <input
                    id="email-address"
                    type="text"
                    autoComplete="email"
                    required
                    onChange={handleChange}
                    name={'email-address'}
                    placeholder="Email Address"
                    value={value}
                    className="h-16 sm:h-10 md:h-12 form-control block w-1/2 px-3 py-1.5 text-md font-bold text-start text-white bg-black border border-solid border-gray-300 transition ease-in-out m-0
                focus:text-white focus:border-blue-600 focus:outline-none"
                  />
                  <label htmlFor="firstname" className="sr-only">
                    {GENERAL_EMAIL_ADDRESS}
                  </label>
                  <input
                    id="firstname"
                    name={'firstname'}
                    type="text"
                    onChange={handleNameChange}
                    value={userName}
                    placeholder="Name"
                    className="h-16 sm:h-10 md:h-12 form-control block w-1/2 px-3 py-1.5 text-md font-bold text-start text-white bg-black border border-solid border-gray-300 transition ease-in-out m-0
                focus:text-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div className="w-full">
                  <button
                    onClick={() => submitSubscription(value, name)}
                    type="button"
                    className="flex items-center justify-center w-full h-16 px-6 py-3 font-bold text-white uppercase bg-black border border-white rounded-sm sm:h-10 md:h-12 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    {BTN_SUBSCRIBE}
                  </button>
                </div>
                {isMessage &&
                  <span className='block w-full p-1 mt-2 text-xs text-white bg-gray-600 rounded'>Newsletter Subscribed Successfully!</span>
                }
              </div>

            </form>
            {/* Sitemap sections */}
          </div>
          <div className="grid grid-cols-1 gap-0 pt-4 pb-8 text-center lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 lg:text-left xl:gap-x-8 lg:gap-x-8 md:gap-x-4">
            {/* {config?.map((item: any, idx: number) => {
              return (
                <div key={`${idx}-footer-item`}>
                  <h3 className="font-medium text-gray-900 text-md">
                    {item.caption}
                  </h3>
                  <ul role="list" className="mt-6 space-y-6">
                    {item.navBlocks.map((navBlock: any) => (
                      <li key={navBlock.boxTitle} className="text-sm">
                        <h3 className="text-sm font-medium text-gray-900">
                          {navBlock.boxTitle}
                        </h3>
                        <ul>
                          {navBlock.navItems.map(
                            (navItem: any, navItemIdx: number) => {
                              return (
                                <li
                                  key={navItemIdx + 'navItem'}
                                  className="text-sm"
                                >
                                  <span className="text-gray-500 hover:text-gray-600 cursor-hand">
                                    {navItem.caption}
                                  </span>
                                </li>
                              )
                            }
                          )}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })} */}
            <div className="pt-4 xl:ml-20 lg:ml-10">
              <strong className="text-white lg:px-6 sm:px-6 md:px-6 lg:text-2xl md:text-lg sm:text-xs xs:text-xs">
                CUSTOMER
              </strong>
              <nav
                aria-label="Footer Services Nav"
                className="flex flex-col mx-6 mt-6 space-y-3 lg-text-md md:text-sm sm:text-xs sm:px-2 md:px-2"
              >
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  My Account
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Our Mission
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Transparency
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Size Guide
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Shipping
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  FAQs
                </a>
              </nav>
            </div>
            <div className="pt-4 xl:ml-20 lg:ml-10 md:ml-10">
              <strong className="text-white lg:px-6 sm:px-6 md:px-6 lg:text-2xl md:text-lg sm:text-xs xs:text-xs">
                {' '}
                KSTM{' '}
              </strong>
              <nav
                aria-label="Footer About Nav"
                className="flex flex-col mx-6 mt-6 space-y-3 lg-text-md md:text-sm sm:text-xs sm:px-2 md:px-2"
              >
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  My Account
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Our Mission
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Transparency
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Size Guide
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Shipping
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  FAQs
                </a>
              </nav>
            </div>
            <div className="pt-4 xl:ml-20 lg:ml-10 md:ml-10">
              <strong className="text-white lg:px-6 sm:px-6 md:px-6 lg:text-2xl md:text-lg sm:text-xs xs:text-xs">
                {' '}
                LEGAL{' '}
              </strong>
              <nav
                aria-label="Footer Support Nav"
                className="flex flex-col mx-6 mt-6 space-y-3 lg-text-md md:text-sm sm:text-xs"
              >
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Terms
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Privacy
                </a>
                <a
                  className="text-white transition hover:text-gray-700/75"
                  href="#"
                >
                  Consent
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2 pb-2 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-0 mr-14">
          <div className="mx-14">
            {' '}
            <p className="mt-0 text-white sm:mx-auto sm:text-md md:text-xl lg:text-2xl xl:text-2xl font-heading mx-14">
              &copy; {COPYRIGHT_FOOTER_INFO}
            </p>
          </div>
          <div className="mx-auto">
            <Logo />
          </div>
          <div className="flex flex-wrap mx-auto text-xl sm:text-sm md:text-lg">
            <ul className="flex items-center justify-center social-icon sm:justify-between">
              <li className="inline-block mr-1 align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.facebook.com"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-fb"></i>
                </a>
              </li>
              <li className="inline-block mr-1 align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://twitter.com"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-twitter"></i>
                </a>
              </li>
              <li className="inline-block mr-1 align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.instagram.com"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-insta"></i>
                </a>
              </li>
              <li className="inline-block mr-1 align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="#"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-tic"></i>
                </a>
              </li>
              <li className="inline-block align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.shopify.com"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-shopify"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
{
  /* <p className="text-sm text-gray-500">&copy; {COPYRIGHT_FOOTER_INFO}</p> */
}
