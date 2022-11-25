import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { UserIcon } from '@heroicons/react/outline'
import Link from 'next/link'

export default function Account({ config, title }: any) {
  return (
    <Menu as="div" className="relative inline-block text-left px-1 sm:w-16 w-10 flow-root">
      <Menu.Button className="group grid grid-cols-1 items-center text-center align-center justify-center flex-col mx-auto"  aria-label="My Account">
        <UserIcon
          className="flex-shrink-0 h-6 w-6 block text-black group-hover:text-gray-500 mx-auto"
          aria-hidden="true"  aria-label="My Account"
        />
        <span className='font-normal sm:block hidden text-sm text-black'>Profile</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-50 right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 flex flex-col text-gray-900 divide-y divide-gray-100">
            <Menu.Item>
              {({ active }) => {
                return (
                  <>
                    {title && (
                      <h1 className="text-left font-bold p-2">{title}</h1>
                    )}
                    {config.map((item: any, idx: number) => {
                      return (
                        <Link key={idx} passHref href={item.href}>
                          <a
                            className={item.className}
                            onClick={item.onClick || false}
                            href={item.href}
                          >
                            {item.title}
                          </a>
                        </Link>
                      )
                    })}
                  </>
                )
              }}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
