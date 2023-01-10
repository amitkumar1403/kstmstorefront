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
import NewsletterForm from './NewsLetterForm'

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

  const submitSubscription = async (data: any) => {
    try {
      // show successful message
      setMessage(true);
      
      // hide the message after 3s
      setTimeout(() => {
        setMessage(false)
      }, 3000);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <footer aria-labelledby="footer-heading">
      <hr />
      <h2 id="footer-heading" className="sr-only">
        {GENERAL_FOOOTER}
      </h2>
      {/* <div className="mt-12 md:mt-0 md:row-start-2 md:col-start-3 md:col-span-8 lg:row-start-1 lg:col-start-7 lg:col-span-6"> */}
      <div className="flex items-center justify-between py-10 px-20">
        <h1 className="text-customBlack-50 lg:text-xl md:text-md sm:text-md xl:text-2xl">
          {QUERY}
          {/* {SIGN_UP_TEXT} */}
        </h1>
        <div className="flex justify-center">
          <div>
            <form className="flex sm:max-w-md">
              <div className="flex-shrink-0 w-48 ml-4 border sm:w-64 md:w-64 lg:w-96 xl:w-96">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-6 py-4 font-medium text-gray-50 uppercase bg-black border border-transparent rounded-sm shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  {TOUCH}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <hr />
      <div className="py-10 px-4 sm:mx-auto md:mx-auto lg:ml-20 xl:mx-20 sm:px-0 lg:px-0">
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-x-40">
          {/* Image section */}
          <div>
            <p className="text-left text-black lg:text-xl md:text-lg dm:text-lg">
              {CUSTOM}
            </p>
            <span className="text-sm text-left text-black">{NEW_PRODUCT}</span>
            <NewsletterForm submitSubscription={submitSubscription} isMessage={isMessage} />
            {/* Sitemap sections */}
          </div>
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 lg:text-left xl:gap-x-8 lg:gap-x-8 md:gap-x-4">
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
            <div className="justify-self-end">
              <p className="font-normal lg:text-ms md:text-lg sm:text-xs xs:text-xs">
                Customer
              </p>
              <nav
                aria-label="Footer Services Nav"
                className="flex flex-col mt-1 gap-y-1 flex-wrap mt-0 sm:px-0 md:px-0"
              >
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="/my-account/login"
                >
                  My Account
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  Our Mission
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  Transparency
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  Size Guide
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  Shipping
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  FAQs
                </a>
              </nav>
            </div>
            <div className="justify-self-end">
              <p className="font-normal lg:text-ms md:text-lg sm:text-xs xs:text-xs">
                KSTM
              </p>
              <nav
                aria-label="Footer Services Nav"
                className="flex flex-col mt-1 gap-y-1 flex-wrap mt-0 sm:px-0 md:px-0"
              >
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="/my-account/login"
                >
                  My Account
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  Our Mission
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  Transparency
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  Size Guide
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  Shipping
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  FAQs
                </a>
              </nav>
            </div>
            <div className="justify-self-end">
              <p className="font-normal lg:text-ms md:text-lg sm:text-xs xs:text-xs">
                Legal
              </p>
              <nav
                aria-label="Footer Services Nav"
                className="flex flex-col mt-1 gap-y-1 flex-wrap mt-0 sm:px-0 md:px-0"
              >
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="/my-account/login"
                >
                  Terms
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  Privacy
                </a>
                <a
                  className="transition lg:text-ms sm:text-xs xs:text-xs text-gray-600 hover:text-black hover:underline underline-offset inline-block"
                  href="#"
                >
                  Consent
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="px-20">
        <div className="grid grid-cols-3 items-center">
          <div className="">
            <p className="mt-0 sm:mx-auto sm:text-sm sm:text-sm lg:text-sm xl:text-sm font-heading mx-14">
              &copy; {COPYRIGHT_FOOTER_INFO}
            </p>
          </div>
          <div className="w-auto mx-auto">
            <Logo />
          </div>
          <div className="flex flex-wrap justify-end">
            <ul className="flex items-center gap-1 justify-center social-icon sm:justify-between">
              <li className="inline-block align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.facebook.com"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-fb w-5"></i>
                </a>
              </li>
              <li className="inline-block align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://twitter.com"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-twitter"></i>
                </a>
              </li>
              <li className="inline-block align-middle">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.instagram.com"
                  className="inline-block"
                >
                  <i className="sprite-icon sprite-insta"></i>
                </a>
              </li>
              <li className="inline-block align-middle">
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
