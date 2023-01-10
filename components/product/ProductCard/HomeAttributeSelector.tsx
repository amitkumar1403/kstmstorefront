import { attr } from 'dom7'
import Link from 'next/link'

interface Attribute {
  fieldCode: string
  fieldName: string
  fieldValues: []
}

interface Attributes {
  attributes: [Attribute]
  onChange: any
  link?: string
}

const ColorSelector = ({ attr, onChange, link }: any) => {
  return (
    <div id="color-swatches-wrapper" className="absolute top-5 right-3 flex flex-col lg:max-w-xs m-auto cursor-pointer">
      {attr.fieldValues.map((item: any, idx: number) => {
        return (
          <div
              key={idx}     
              title={item.fieldLabel || 'null'}
              className="color-swatch-item md:h-2 md:w-2 sm:h-3 sm:w-3 rounded-full m-1 shadow-md drop-shadow-md"
              style={{ backgroundColor: item.fieldValue }}
            />
        )
      })}
    </div>
  )
}

ColorSelector.displayName = 'ColorSelector'

const getAttributeComponent = (type: string) => {
  switch (type) {
    case 'global.colour':
      return (props: any) => <ColorSelector {...props} />
    default:
      return () => null
  }
}

export default function AttributeSelector({
  attributes,
  onChange = {},
  link,
}: Attributes) {
  return (
    <>
      {attributes.map((attr: Attribute, idx: number) => {
        const Component = getAttributeComponent(attr.fieldCode)
        // return <>{({ attr, onChange, link })}</>
        return (
          <Component attr={attr} key={idx} onChange={onChange} link={link} />
        )
      })}
    </>
  )
}
