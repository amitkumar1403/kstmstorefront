import { RadioGroup } from '@headlessui/react'
import classNames from '@components/utils/classNames'
import Link from 'next/link'
import { CHOOSE_A_COLOR } from '@components/utils/textVariables'
import { useState } from 'react'
export default function InlineList({
  items = [],
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
    <div className='flex'>
      <h3 className="text-sm text-black font-bold text-left">{label}</h3>
      {/* <h3 className='px-2' >{color}</h3>
      <div style={{ color: `${color}` }}></div> */}
    </div>
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
                    active && checked ? 'ring ring-offset-1' : '',
                    !active && checked ? 'ring-2' : '',
                    'relative w-full h-16 flex items-center mt-1 justify-center cursor-pointer border border-grey-40 hover:border-black '
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

// import { RadioGroup } from '@headlessui/react'
// import classNames from '@components/utils/classNames'
// import Link from 'next/link'
// import { CHOOSE_A_COLOR } from '@components/utils/textVariables'
// import { CheckIcon } from '@heroicons/react/outline'
// export default function InlineList({
//   items = [],
//   onChange = () => { },
//   label = CHOOSE_A_COLOR,
//   fieldCode = '',
//   currentAttribute = '',
//   generateLink = () => { },
// }: any) {
//   const handleChange = (value: any) => {
//     return onChange(fieldCode, value)
//   }

//   return (
//     <>
//       <h3 className="pt-3 text-sm font-medium text-left text-gray-600 uppercase border-t border-gray-200 border-solid">{label}</h3>
//       <RadioGroup value={'ring-gray-700'} onChange={() => { }} className="mt-4">
//         <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
//         <div className="flex items-center space-x-2 lg-grid lg-grid-cols-8 border border-grey-40">
//           {items.map((item: any, idx: any) => {
//             const path = generateLink(fieldCode, item.fieldValue)
//             return (
//               <RadioGroup.Option
//                 key={idx}
//                 value={item.fieldValue}
//                 style={{ backgroundColor: item.fieldValue }}
//                 className={({ active, checked }) =>
//                   classNames(
//                     currentAttribute == item.fieldValue ? 'border-black' : 'border-gray-400',
//                     '-m-0.5 relative p-0.5 border border-opacity-1 rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
//                   )
//                 }
//               >
//                 <CheckIcon className={classNames(
//                   currentAttribute == item.fieldValue ? 'inline-block' : 'hidden',
//                   'w-5 h-5 text-black absolute'
//                 )}></CheckIcon>
//                 <RadioGroup.Label as="p" className="sr-only">
//                   {item.fieldName} {item.value}
//                 </RadioGroup.Label>
//                 <Link href={`/${path}`} passHref>
//                   <a
//                     aria-hidden="true"
//                     onClick={() => handleChange(item.fieldvalue)}
//                     className={classNames(
//                       item.fieldvalue,
//                       'h-6 w-6 rounded-full'
//                     )}>
//                   {/* <img src='/pngTemplate.jpg' className={"bg-transparent"} /> */}
                    
//                   </a>
                  
//                 </Link>
//               </RadioGroup.Option>
//             )
//           })}
//         </div>
//       </RadioGroup>
//     </>
//   )
// }

