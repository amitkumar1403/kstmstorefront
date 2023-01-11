import axios from 'axios'
import { useState } from 'react'
import { useUI } from '@components/ui/context'
import { NEXT_APPLY_PROMOTION } from '@components/utils/constants'
import { PROMO_ERROR } from '@components/utils/textVariables'
import { TrashIcon } from '@heroicons/react/outline'
import Button from '@components/ui/IndigoButton'
import {
  APPLY_PROMOTION,
  APPLY_PROMOTION_SUCCESS_MESSAGE,
  GENERAL_APPLY_TEXT
} from '@components/utils/textVariables'

export default function PromotionInput() {
  const [error, setError] = useState(false)
  const { basketId, setCartItems, cartItems } = useUI()

  const [value, setValue] = useState('')

  const handleChange = (e: any) => {
    setValue(e.target.value)
  }

  const handleSubmit = async (
    method: string = 'apply',
    promoCode: string = value
  ) => {
    try {
      const { data }: any = await axios.post(NEXT_APPLY_PROMOTION, {
        basketId,
        promoCode,
        method,
      })
      if (data.result) {
        setError(data.result.isValid)
        setCartItems(data.result.basket)
      } else setError(!data.isValid)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex items-center">
      <form 
        onSubmit={() => {
          handleSubmit('apply')
        }}
        className="w-full"
      >
        {/* <label className="text-gray-900 capitalize font-semibold text-xs">{APPLY_PROMOTION}</label> */}
        <div className="flex flex-col">
          <div className="flex justify-start flex-col sm:my-0 my-0">
            {cartItems.promotionsApplied?.length
              ? cartItems.promotionsApplied.map((promo: any, key: number) => {
                  return (
                    <div className="flex items-center py-2" key={promo.name}>
                      <span className="text-gray-900">
                        <span className='text-gray-900 p-1 rounded-full border bg-gray-50 text-sm px-4 font-bold'>{promo.name}</span> {' '}{APPLY_PROMOTION_SUCCESS_MESSAGE}
                      </span>
                      <TrashIcon
                        className="ml-5 cursor-pointer text-red-500 hover:text-red-700 max-w-xs h-5"
                        onClick={() => handleSubmit('remove', promo.promoCode)}
                      />
                    </div>
                  )
                })
              : null}
          </div>

          <div className="flex mb-3 gap-3 justify-between items-center">
            <input
              name={'promotion-code'}
              placeholder={APPLY_PROMOTION}
              onChange={handleChange}
              value={value}
              className="text-md appearance-none min-w-0 w-full border border-gray-300 py-1 px-3 placeholder-gray-200 focus:outline-none focus:border-black"
              required
            />
            <button
              type='submit'
              className='py-1 px-3 flex items-center justify-center bg-green hover:opacity-75 text-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green w-16 md:w-32 lg:w-48'
            >
              {GENERAL_APPLY_TEXT}
            </button>
          </div>
        </div>
        {error ? (
          <div className="text-red-400 text-xs capitalize mb-2">
            {PROMO_ERROR}
          </div>
        ) : null}
      </form>
    </div>
  )
}
