import { FC } from 'react'
import { useUI } from '@components/ui/context'
import { useState } from 'react'
import { LoadingDots } from '@components/ui'
import { ShoppingBagIcon } from '@heroicons/react/outline'
import Image from 'next/legacy/image';
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


interface Props {
  className?: string
  title?: string
  action: any
  buttonType?: string
  type?: string
  colorScheme?: any
}

const DEFAULT_COLOR_SCHEME = {
  bgColor: 'bg-black',
  hoverBgColor: 'bg-red-400',
  focusRingColor: 'ring-gray-600',
}

const DefaultButton: FC<Props> = ({
  className = '',
  title = 'Add',
  buttonType = 'cart',
  action = () => { },
  colorScheme = DEFAULT_COLOR_SCHEME,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const { openCart } = useUI()

  const handleAction = () => {
    setIsLoading(true)
    if (buttonType === 'cart') {
      action().then(() => {
        setIsLoading(false)
        openCart()
      })
    } else
      action().then(() => {
        setIsLoading(false)
      })
  }

  const { bgColor, hoverBgColor, focusRingColor } = colorScheme

  return (
    <button
      onClick={handleAction}
      type="button"
      className={classNames(
        isLoading 
          ? 'bg-gray-400 border-2 border-gray-400 focus:bg-gray-400 hover:bg-gray-400 border-l-black'
          : `${bgColor} border-2 border-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:${focusRingColor}`,
        `xs:max-w-xs flex-1 btn-basic-property-big rounded-sm sm:py-3 py-1 sm:px-8 px-1 flex items-center justify-center font-medium text-white hover:text-white  sm:w-full ${className}`
      )}      
    >
      <span className="relative pl-1">
        {isLoading ?
          <LoadingDots /> :
          <>
            <span className="relative pr-1 top-1">
              <Image src="/assets/icons/add-to-bag.svg" width={20} height={20} style={{
                          maxWidth: "100%",
                          height: "auto"
                        }} className="relative pr-2 right-2 top-1" />
            </span>
            <span>{title}</span>
          </>
        }
      </span>
    </button>
  )
}

export default DefaultButton
