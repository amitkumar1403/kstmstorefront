import Dropdown from './Dropdown'
import InlineList from './InlineList'
import { useRouter } from 'next/router'
import { useState } from 'react'
import attributesGenerator, {
  getAttributesFromSlug,
  productLookup,
} from '@components/utils/attributesGenerator'
import { cloneDeep } from 'lodash'

const ATTR_COMPONENTS: any = {
  HorizontalList: (props: any) => <InlineList {...props} />,
  Dropdown: (props: any) => <Dropdown {...props} />,
  undefined: () => null,
}

const TEMP_MAP: any = {
  'global.colour': ATTR_COMPONENTS['HorizontalList'],
  'clothing.size': ATTR_COMPONENTS['Dropdown'],
}

export default function AttributesHandler({
  product,
  setSelectedAttrData,
  variant,
}: any) {
  const { attributes, variantAttributes = [], variantProducts } = product

  const router = useRouter()

  const slug = `products/${router.query.slug}`

  const originalAttributes = getAttributesFromSlug(slug, variantProducts)

  const generatedAttrCombination = Object.fromEntries(
    Object.entries(originalAttributes).slice(0, 1)
  )
  const [attrCombination, setAttrCombination] = useState(
    generatedAttrCombination
  )

  const generateLink = (fieldCode: any, value: any) => {
    let slug = ''
    variantProducts.find((item: any) => {
      item.attributes.find((option: any) => {
        const isFieldCode = option.fieldCode === fieldCode
        const isFieldValue = option.fieldValue === value
        if (isFieldCode && isFieldValue) {
          slug = item.slug
        }
      })
    })
    return slug
  }

  const handleChange = (fieldCode: string, value: string) => {
    const slug = generateLink(fieldCode, value)
    if (slug) {
      router.push(`/${slug}`)
    }
  }

  const getStockPerAttribute = (key: string, variant: string) => {
    let productData = {
      stock: 0,
      productId: '',
      isPreOrderEnabled: false,
      sellWithoutInventory: false,
      stockCode: '',
    }
    // const slug = `products/${router.query.slug}`
    variantProducts.find((product: any) => {
      product.attributes.forEach((attr: any) => {
        if (
          key.toLowerCase() === attr.fieldCode.toLowerCase() &&
          attr.fieldValue === variant
          // product.slug === slug
        ) {
          productData.stock = product.currentStock
          productData = { ...productData, ...product }
        }
      })
    })
    return productData
  }

  //temporary until DisplayTemplate is implemented
  const isCustomAttr = product.variantAttributes?.length > 2

  //product.variantAttributes=product.variantAttributes?.reverse();

  const generateOptions = (option: any) => {
    const isInOrder =
      Object.keys(originalAttributes).findIndex(
        (i: string) => i === option.fieldCode
      ) -
      Object.keys(attrCombination).length ===
      0 || Object.keys(attrCombination).includes(option.fieldCode)

    const isLastItem = Object.keys(attrCombination).pop() === option.fieldCode
    if (isInOrder) {
      if (
        isCustomAttr &&
        Object.keys(attrCombination).length > 1 &&
        !isLastItem
      ) {
        const entriesFromCombination = () => {
          return Object.fromEntries(Object.entries(attrCombination).slice(-1))
        }
        const generatedAttributes = attributesGenerator(
          entriesFromCombination(),
          variantProducts
        )
        return generatedAttributes
          .map((item: any) => {
            if (option.fieldCode === item.fieldCode) {
              return item
            }
          })
          .filter((el) => el)
      } else return option.fieldValues
    } else return []
  }

  const handleAttrCombinations = (key: string, value: any) => {
    setAttrCombination((prevValue: any) => {
      let newValue = prevValue
      const existingValueIndex = Object.keys(prevValue).findIndex(
        (i: any) => i === key
      )
      newValue[key] = value
      if (existingValueIndex > -1) {
        newValue = Object.fromEntries(
          Object.entries(newValue).slice(0, existingValueIndex + 1)
        )
        return newValue
      }
      newValue = { ...newValue, [key]: value }
      return newValue
    })
  }

  const handleSelectedAttrData = (value: any) => {
    if (isCustomAttr) {
      if (
        Object.keys(attrCombination).length ===
        Object.keys(originalAttributes).length
      ) {
        const currentProduct = productLookup(
          variantProducts,
          attrCombination
        )[0]

        if (currentProduct) setSelectedAttrData(currentProduct)
      }
    } else setSelectedAttrData(value)
  }

  const DefaultComponent: any = () => null
  const stateAttributes: any = attrCombination

  let a = [];

  const KEY_SIZE = "clothing.size";
  const KEY_COLOR = "global.colour";
  const KEY_ATTRIBUTES = [KEY_SIZE, KEY_COLOR];

  const matchAttributes = variantAttributes && variantAttributes.length ? variantAttributes.filter((x: any) => KEY_ATTRIBUTES.includes(x.fieldCode)) : false;
  const sortAttributes = (matchAttributes && matchAttributes.length === KEY_ATTRIBUTES.length);
  const tempVariantAttrs = variantAttributes?.map((x: any, index: number) => {
    return { ...x, ...{ displayOrder: index + 1 } };
  });

  //JSON?.parse(JSON?.stringify(tempVariantAttrs))
  const newVariantAttrs = sortAttributes
    ? cloneDeep(tempVariantAttrs)?.map((x: any, index: number) => {
      if (x.fieldCode === KEY_SIZE || x.fieldCode === KEY_COLOR) {
        if (x.fieldCode === KEY_SIZE) {
          x.displayOrder = tempVariantAttrs?.find((x: any) => x.fieldCode === KEY_COLOR)?.displayOrder;
        } else if (x.fieldCode === KEY_COLOR) {
          x.displayOrder = tempVariantAttrs?.find((x: any) => x.fieldCode === KEY_SIZE)?.displayOrder;
        }
        return x;
      }
      return x;
    })
    : tempVariantAttrs;

  return (
    <>
      {newVariantAttrs?.sort((first: any, second: any) => {
        return (first.displayOrder - second.displayOrder);
      })?.map((option: any, idx: number) => {
        const optionsToPass = generateOptions(option)
        const originalAttribute = isCustomAttr
          ? stateAttributes[option.fieldCode]
          : originalAttributes[option.fieldCode]
        const Component =
          ATTR_COMPONENTS[option.inputType] ||
          TEMP_MAP[option.fieldCode] ||
          DefaultComponent
        return (
          <div key={idx} className="py-2">
            <Component
              currentAttribute={originalAttribute}
              getStockPerAttribute={getStockPerAttribute}
              items={optionsToPass}
              label={option.fieldName}
              isDisabled={!optionsToPass.length}
              onChange={handleChange}
              setSelectedAttrData={handleSelectedAttrData}
              fieldCode={option.fieldCode}
              productId={product.id}
              setAttrCombination={handleAttrCombinations}
              generateLink={generateLink}
              product={product}
              variant={variant}
            />
          </div>
        )
      })}
    </>
  )
}
