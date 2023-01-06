import { FC, useState } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/legacy/image';
import s from './WishlistCard.module.css'
import { Trash } from '@components/icons'
import { Button, Text } from '@components/ui'

import { useUI } from '@components/ui/context'
import type { Product } from '@commerce/types/product'
import usePrice from '@framework/product/use-price'
import useAddItem from '@framework/cart/use-add-item'
import useRemoveItem from '@framework/wishlist/use-remove-item'
import {GENERAL_ADD_TO_BASKET} from '@components/utils/textVariables'

interface Props {
  product: Product
}

const placeholderImg = '/product-img-placeholder.svg'

const WishlistCard: FC<Props> = ({ product }) => {
  const { price } = usePrice({
    amount: product.price?.value,
    baseAmount: product.price?.retailPrice,
    currencyCode: product.price?.currencyCode!,
  })
  // @ts-ignore Wishlist is not always enabled
  const removeItem = useRemoveItem({ wishlist: { includeProducts: true } })
  const [loading, setLoading] = useState(false)
  const [removing, setRemoving] = useState(false)

  // TODO: fix this missing argument issue
  /* @ts-ignore */
  const addItem = useAddItem()
  const { openSidebar } = useUI()

  const handleRemove = async () => {
    setRemoving(true)

    try {
      // If this action succeeds then there's no need to do `setRemoving(true)`
      // because the component will be removed from the view
      await removeItem({ id: product.id! })
    } catch (error) {
      setRemoving(false)
    }
  }
  const addToCart = async () => {}

  return (
    <div className={cn(s.root, { 'opacity-75 pointer-events-none': removing })}>
      <div className={`col-span-3 ${s.productBg}`}>
        <Image
          src={product.images[0]?.url || placeholderImg}
          width={400}
          height={400}
          alt={product.images[0]?.alt || 'Product Image'}
        />
      </div>

      <div className="col-span-7">
        <h3 className="text-2xl mb-2">
          <Link href={`/product${product.path}`}>
            {product.name}
          </Link>
        </h3>
        <div className="mb-4">
          <Text html={product.description} />
        </div>
        <Button
          aria-label={GENERAL_ADD_TO_BASKET}
          type="button"
          className={
            'py-1 px-3 border border-secondary rounded-md shadow-sm hover:bg-primary-hover'
          }
          onClick={addToCart}
          loading={loading}
        >
          {GENERAL_ADD_TO_BASKET}
        </Button>
      </div>
      <div className="col-span-2 flex flex-col justify-between">
        <div className="flex justify-end font-bold">{price}</div>
        <div className="flex justify-end">
          <button onClick={handleRemove}>
            <Trash />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WishlistCard
