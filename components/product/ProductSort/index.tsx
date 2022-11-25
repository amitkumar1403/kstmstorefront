import classNames from '@components/utils/classNames'
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GENERAL_SORT } from '@components/utils/textVariables'
interface Props {
  products: any
  action: any
  routerSortOption: any
}

export default function ProductSort({
  products,
  action,
  routerSortOption,
}: Props) {
  const router = useRouter()

  const currentOption = products.sortList?.filter(
    (item: any) => item.key === routerSortOption
  )[0]
  return (
    <Menu as="div" className="relative inline-block">
      <div className="flex">
        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          {GENERAL_SORT}
          <ChevronDownIcon
            className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-10 origin-top-right text-left absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {products.sortList.length &&
              products.sortList.map((option: any) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <div>
                      <Link
                        href={{
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            sortBy: option.key,
                          },
                        }}
                        passHref
                      >
                        <a
                          href={option.href}
                          onClick={() => action(option.key)}
                          className={classNames(
                            'text-gray-500 hover:bg-gray-100',
                            currentOption?.key === option.key
                              ? 'bg-gray-100'
                              : '',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          {option.value}
                        </a>
                      </Link>
                    </div>
                  )}
                </Menu.Item>
              ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
