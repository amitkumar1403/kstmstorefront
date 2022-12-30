import { RadioGroup } from '@headlessui/react'
import classNames from '@components/utils/classNames'
import Link from 'next/link'
import { CHOOSE_A_COLOR } from '@components/utils/textVariables'
import { useState } from 'react'

const defaultColors = [
    {
        "fieldValue": "#00ff00",
        "fieldLabel": "LIME",
        "fieldGroupName": "GREEN",
        "displayOrder": 0
    },
    {
        "fieldValue": "#ffffff",
        "fieldLabel": "CREAMBLK",
        "fieldGroupName": "WHITE",
        "displayOrder": 0
    },
    {
        "fieldValue": "#ffc0cb",
        "fieldLabel": "PINK",
        "fieldGroupName": "PINK",
        "displayOrder": 0
    },
    {
        "fieldValue": "#ffff00",
        "fieldLabel": "YELLOW",
        "fieldGroupName": "YELLOW",
        "displayOrder": 0
    },
    {
        "fieldValue": "#a52a2a",
        "fieldLabel": "MEXICAN RED",
        "fieldGroupName": "BROWN",
        "displayOrder": 0
    },
    {
        "fieldValue": "#000000",
        "fieldLabel": "CAMBLACK",
        "fieldGroupName": "BLACK",
        "displayOrder": 0
    }
]


export default function InlineList({
  items = defaultColors,
  onChange = () => {},
  label = CHOOSE_A_COLOR,
  fieldCode = 'global.colour',
  currentAttribute = 'black',
  generateLink = () => {},
}: any) {
  const [color, setColor] = useState(null) // to display color in the Page
  const handleChange = (value: any) => {
    {setColor(value)}
    return onChange(fieldCode, value)
  }

  return (
    <>
      <RadioGroup value={'ring-gray-700 mt-0'} onChange={handleChange} className="mt-2">
        <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
        <div className="flex items-center">

          {items.map((item: any, idx: any) => {
            const path = generateLink(fieldCode, item.fieldValue)
            return (
              <RadioGroup.Option
                key={idx}
                value={item.fieldValue}
                style={{ backgroundColor: item.fieldValue }}
                className={({ active, checked }) =>
                  classNames(
                    currentAttribute == item.fieldValue ? 'border-black' : 'border-gray-40',
                    'relative w-full h-8 mr-1 flex items-center justify-center cursor-pointer border border-grey-40 hover:border-black focus:border-black '  
                  )
                }
                >
                <RadioGroup.Label as="p" className="sr-only">
                  {item.fieldName}
                </RadioGroup.Label>
                
                <Link href={`/${path}`} passHref>
                  <a
                    aria-hidden="true"
                    onClick={() => { 
                      handleChange(item.fieldvalue)
                    }}
                    className={classNames(
                      item.fieldvalue,
                      ' border shadow-md drop-shadow-md border-black border-opacity-10 '
                    )}
                  />
                </Link>
              </RadioGroup.Option>
            )
          })}
        </div>
      </RadioGroup>
    </>
  )
}
