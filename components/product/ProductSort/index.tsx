import classNames from '@components/utils/classNames'
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GENERAL_FILTER_TITLE, GENERAL_SORT } from '@components/utils/textVariables'
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
    <>
    <div>

    <div className=" px-0 pt-2 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            {GENERAL_FILTER_TITLE}
          </h2>
        </div>

      <div className='pb-6 mt-3'>
        {/* Search bar in every filter category */}
      {/* {getCustomComponent(sectionKey)({ ...PROPS_LIST[sectionKey] })} */}
      <div className="grid grid-cols-3">
       {products.sortList.length ?
             ( 
              products.sortList.map((option: any) =>{ 
               return (
                 <div className='border-gray-200 border py-3 hover:border-black' key={option.value}>
                  <span className='font-bold text-gray-500 justify-center flex  '>
                    {/* {option.value} */}
                    <Link
                        href={{
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            sortBy: option.key,
                          },
                        }}
                        passHref
                          onClick={() => action(option.key)}
                          className={classNames(
                            'text-gray-500 hover:bg-gray-100',
                            currentOption?.key === option.key
                              ? 'bg-gray-100'
                              : '',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          {option.value.length>15? (option.value.substring(0,15) +`...`):option.value }
                         
                      </Link>
                    </span>
                 </div>
                 )}
               
               )
             ):null
               
               }
      </div>
    </div>

    {/* --------------------------------------------------------------- */}
    </div>
    </>
  )
}

{/* <FilterItem
sectionKey={sectionKey}
option={option}
onSelect={handleFilters}
optionIdx={optionIdx}
key={optionIdx}
isChecked={isChecked}
closeSidebar={closeSidebar}
{...PROPS_LIST[sectionKey]}
/> */}