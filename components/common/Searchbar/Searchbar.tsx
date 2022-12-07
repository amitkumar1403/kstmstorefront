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
    <div className="flex flex-row sm:pr-2 rounded-sm">
      <button
        onClick={onClick}
        className="sm:p-1 sm:pl-3  pr-3 text-gray-400 hover:text-gray-500 relative"
        aria-label="Search"
      >
        {/* <span className="sr-only" aria-label="Search">{BTN_SEARCH}</span>       
        <span className='text-black pr-2 font-normal text-sm sm:inline-block pr-32 hidden'>Search</span> */}
        <SearchIcon
          className="sm:w-6 sm:h-6 w-6 h-6 sm:top-2 sm:right-0 text-black hover:text-gray-500"
          aria-hidden="true"
          aria-label="Search"
        />
      </button>
    </div>
  )
}

export default memo(Searchbar)
