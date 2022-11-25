import Link from 'next/link'
import { FC } from 'react'
import CartItem from '@components/cart/CartItem'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import useCart from '@framework/cart/use-cart'
import usePrice from '@framework/product/use-price'
import useCheckout from '@framework/checkout/use-checkout'
import ShippingWidget from '../ShippingWidget'
import PaymentWidget from '../PaymentWidget'
import s from './CheckoutSidebarView.module.css'
import { 
  BTN_CONFIRM_PURCHASE, 
  CALCULATED_AT_CHECKOUT, 
  GENERAL_CHECKOUT, 
  GENERAL_FREE, 
  GENERAL_SHIPPING, 
  GENERAL_SUBTOTAL, 
  GENERAL_TAXES, 
  GENERAL_TOTAL 
} from '@components/utils/textVariables'

const CheckoutSidebarView: FC = () => {
  const { setSidebarView, closeSidebar } = useUI()
  const { data: checkoutData, submit: onCheckout } = useCheckout()

  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()

    await onCheckout()

    closeSidebar()
  }

  return (
    <SidebarLayout
      className={s.root}
      handleBack={() => setSidebarView('CART_VIEW')}
    >
      <div className="px-4 sm:px-6 flex-1">
        <Link href="/cart">
          <a>
            <Text variant="sectionHeading">{GENERAL_CHECKOUT}</Text>
          </a>
        </Link>

        <PaymentWidget
          isValid={checkoutData?.hasPayment}
          onClick={() => setSidebarView('PAYMENT_VIEW')}
        />
        <ShippingWidget
          isValid={checkoutData?.hasShipping}
          onClick={() => setSidebarView('SHIPPING_VIEW')}
        />

        <ul className={s.lineItemsList}></ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 px-6 py-6 sm:px-6 sticky z-20 bottom-0 w-full right-0 left-0 bg-accent-0 border-t text-sm"
      >
        <ul className="pb-2">
          <li className="flex justify-between py-1">
            <span>{GENERAL_SUBTOTAL}</span>
          </li>
          <li className="flex justify-between py-1">
            <span>{GENERAL_TAXES}</span>
            <span>{CALCULATED_AT_CHECKOUT}</span>
          </li>
          <li className="flex justify-between py-1">
            <span>{GENERAL_SHIPPING}</span>
            <span className="font-bold tracking-wide">{GENERAL_FREE}</span>
          </li>
        </ul>
        <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-2">
          <span>{GENERAL_TOTAL}</span>
        </div>
        <div>
          {/* Once data is correcly filled */}
          <Button
            type="submit"
            width="100%"
            disabled={!checkoutData?.hasPayment || !checkoutData?.hasShipping}
          >
            {BTN_CONFIRM_PURCHASE}
          </Button>
        </div>
      </form>
    </SidebarLayout>
  )
}

export default CheckoutSidebarView
