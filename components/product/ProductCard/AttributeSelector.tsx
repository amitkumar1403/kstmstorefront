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
    <div className="mb-1 grid grid-cols-10 lg:max-w-xs m-auto lg:px-10">
      {attr.fieldValues.map((item: any, idx: number) => {
        return (
          <span
              key={idx}            
              className="sm:h-5 sm:w-5 h-5 w-5 inline-block rounded-full sm:mr-2 mr-1 mt-2 border border-gray-200 shadow-md drop-shadow-md"
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
