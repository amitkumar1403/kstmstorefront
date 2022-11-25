import { FC, memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SearchIcon } from '@heroicons/react/outline'
import { Transition } from '@headlessui/react'
import { BTN_SEARCH } from '@components/utils/textVariables'
interface Props {
  id?: string
  onClick: any
}

const Searchbar: FC<Props> = ({ id = 'search', onClick }) => {
  return (
    <div className="flex flex-row sm:mr-8 sm:pr-2 sm:bg-gray-100 sm:border rounded-sm">
      <button
        onClick={onClick}
        className="sm:p-1 sm:pl-3 sm:pr-16 pr-3 text-gray-400 hover:text-gray-500 relative" aria-label="Search"
      >
        <span className="sr-only" aria-label="Search">{BTN_SEARCH}</span>       
        <span className='text-black pr-2 font-normal text-sm sm:inline-block pr-32 hidden'>Search</span>
        <SearchIcon className="sm:w-4 sm:h-4 w-6 h-6 sm:absolute sm:top-2 sm:right-0 sm:text-gray-400 text-black" aria-hidden="true" aria-label="Search" />
      </button>
    </div>
  )
}

export default memo(Searchbar)
