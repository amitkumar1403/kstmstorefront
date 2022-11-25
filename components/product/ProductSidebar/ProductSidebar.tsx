import s from './ProductSidebar.module.css'
import { useAddItem } from '@framework/cart'
import { FC, useEffect, useState } from 'react'
import { ProductOptions } from '@components/product'
import type { Product } from '@commerce/types/product'
import { Button, Text, Rating, Collapse, useUI } from '@components/ui'
import {
  getProductVariant,
  selectDefaultOptionFromProduct,
  SelectedOptions,
} from '../helpers'
import { GENERAL_ADD_TO_BASKET, GENERAL_CARE_TEXT, GENERAL_DETAILS, GENERAL_DETAILS_TEXT, GENERAL_NOT_AVAILABLE } from '@components/utils/textVariables'

interface ProductSidebarProps {
  product: Product
  className?: string
}

const ProductSidebar: FC<ProductSidebarProps> = ({ product, className }) => {
  const addItem = useAddItem()
  const { openSidebar } = useUI()
  const [loading, setLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  useEffect(() => {
    selectDefaultOptionFromProduct(product, setSelectedOptions)
  }, [product])

  const variant = getProductVariant(product, selectedOptions)
  const addToCart = async () => {}

  return (
    <div className={className}>
      <ProductOptions
        options={product.options}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
      <Text
        className="pb-4 break-words w-full max-w-xl"
        html={product.descriptionHtml || product.description}
      />
      <div className="flex flex-row justify-between items-center">
        <Rating value={4} />
        <div className="text-accent-6 pr-1 font-medium text-sm">36 reviews</div>
      </div>
      <div>
        {process.env.COMMERCE_CART_ENABLED && (
          <Button
            aria-label={GENERAL_ADD_TO_BASKET}
            type="button"
            className={s.button}
            onClick={addToCart}
            loading={loading}
            disabled={variant?.availableForSale === false}
          >
            {variant?.availableForSale === false
              ? GENERAL_NOT_AVAILABLE
              : GENERAL_ADD_TO_BASKET}
          </Button>
        )}
      </div>
      <div className="mt-6">
        <Collapse title={GENERAL_CARE_TEXT}>
          {GENERAL_CARE_TEXT}
        </Collapse>
        <Collapse title={GENERAL_DETAILS}>
          {GENERAL_DETAILS_TEXT}
        </Collapse>
      </div>
    </div>
  )
}

export default ProductSidebar
