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
    <>
     
      <SearchIcon onClick={onClick} className="sm:w-4 sm:h-4 w-6 h-6 margin:auto  sm:text-black-400 text-black" aria-hidden="true" aria-label="Search" />
    </>



  )
}

export default memo(Searchbar)
