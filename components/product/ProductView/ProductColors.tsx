import { RadioGroup } from '@headlessui/react'
import classNames from '@components/utils/classNames'
import Link from 'next/link'
import { CHOOSE_A_COLOR, IMG_PLACEHOLDER } from '@components/utils/textVariables'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import { useState } from 'react'
import { groupBy } from 'lodash'
import { matchStrings } from '@framework/utils/parse-util'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function ProductColors({
  items = [],
  onChange = () => { },
  label = CHOOSE_A_COLOR,
  fieldCode = '',
  currentAttribute = '',
  generateLink = () => { },
}: any) {
  const [selectedGroupName, setSelectedGroupName] = useState<any>(undefined);
  const handleChange = (key: string, value: any, values?: Array<any>) => {
    if (values?.length) {
      let obj: any = {};
      obj[key] = values?.find((x: any) => matchStrings(x?.fieldValue, value, true))?.fieldLabel;
      setSelectedGroupName({
        //...selectedGroupName || {},
        ...{ ...obj }
      });
    }
    return onChange(fieldCode, value);
  }
  SwiperCore.use([Navigation])
  let settings = {
    fade: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    centerMode: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      }
    ]
  };
  const [isActive, setActive] = useState(0);

  const onTabCick = (id: number) => {
    setActive(id);
  };
  const groups: any = groupBy(items, 'fieldGroupName')
  const groupsLen = Object.entries(groups)?.length;

  let index = 0;
  let defaultFieldLabel = "";
  do {
    const defaultAttributes: any = Object.entries(groups)?.find(([key, values]: any, idx: number) => idx == index);
    if (defaultAttributes?.length) {
      defaultFieldLabel = defaultAttributes[1]?.find((x: any) => matchStrings(x?.fieldValue, currentAttribute, true))?.fieldLabel;
    }

    if (!defaultFieldLabel) {
      index++;
    } else {
      index = groupsLen;
    }
  } while (index <= groupsLen - 1)


  return (
    <>
      <div className="hidden w-full border-t border-gray-200 sm:block">
        {
          Object.entries(groups).map(([key, values]: any, iid: number) => {
            return (
              <>
                <RadioGroup value={'ring-gray-700'} onChange={() => { }} className="px-4 pb-4 my-4 border-b border-gray-200 border-dashed sm:px-0" key={iid}>
                  <RadioGroup.Label className="sr-only">{key}</RadioGroup.Label>
                  <div className="grid content-center grid-cols-1">
                    <div className="flex content-center col-span-1">
                      {key != 'null' &&
                        <h3 className="flex content-center font-semibold text-black capitalize text-16">
                          <span className="text-primary">{key.toLowerCase()}</span>
                          <span className='mr-1'>:</span>
                          {
                            currentAttribute && (
                              <>
                                {
                                  !selectedGroupName
                                    ? values?.find((x: any) => matchStrings(x?.fieldValue, currentAttribute, true))?.fieldLabel
                                    : selectedGroupName && selectedGroupName[key] ? <span className='font-semibold'>{' '}{selectedGroupName[key]}</span> : ""
                                }
                              </>
                            )
                          }
                        </h3>
                      }
                    </div>
                    <div className="col-span-1 mt-2">
                      <div
                        role="list"
                        className="flex flex-wrap color-panel"
                      >

                        {values.map((item: any, idx: any) => {
                          //const path = generateLink(fieldCode, item.fieldValue)
                          return (
                            <>
                              <RadioGroup.Option key={idx} value={item.fieldValue}
                                className={`-m-0.5 relative p-0.5 pdp-color-variant w-16 rounded flex items-center justify-center cursor-pointer`}
                              >
                                <RadioGroup.Label as="div" className="sr-only">
                                  {item.fieldName} {item.value}
                                </RadioGroup.Label>
                                <Link href="javascript:void(0);">
                                  <a aria-hidden="true" onClick={() => handleChange(key, item.fieldValue, values)}
                                    className={classNames(item.fieldvalue,)}>
                                    <img src={item?.fieldValue || IMG_PLACEHOLDER}
                                      className={`${matchStrings(item?.fieldLabel, !selectedGroupName ? defaultFieldLabel : selectedGroupName[key], true) ? "border-gray-800" : "border-gray-200"} rounded border  hover:border-gray-400`}

                                    />
                                  </a>
                                </Link>
                              </RadioGroup.Option>
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </>
            )
          })
        }
      </div>
      <div className="flex-1 px-4 sm:hidden sm:px-0 quick-view-padding-0">
        <ul className="flex justify-start w-full -mb-px overflow-x-auto text-center mobile-h-scroll" role="tablist">
          {Object.entries(groups).map(([key, values]: any, iid: number) => (
            <>
              {key != "null" &&
                <li key={iid} className="flex justify-center text-center capitalize min-w-group">
                  <a
                    className={
                      "py-2 min-w-group font-semibold text-12 text-primary rounded-t-lg capitalize" +
                      (iid == isActive
                        ? " border-blue-600 border-b-2 border-black active dark:text-blue-500 dark:border-blue-500"
                        : " text-blue-600 border-b-2 border-gray-200 bg-white")
                    }
                    onClick={() => onTabCick(iid)}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    {key.toLowerCase()}
                  </a>
                </li>
              }
            </>
          ))}
        </ul>
        <div className="flex-1 mt-3">
          {
            Object.entries(groups).map(([key, values]: any, iid: number) => {
              return (
                <>
                  <RadioGroup value={'ring-gray-700'} onChange={() => { }}
                    className={
                      "px-0 pb-4 mb-4 border-b border-gray-200 border-dashed sm:px-0" +
                      (iid == isActive
                        ? " block"
                        : " hidden")
                    }
                    key={iid}>
                    <RadioGroup.Label className="sr-only">{key}</RadioGroup.Label>
                    <div className="grid content-center grid-cols-1">
                      <div className="flex content-center col-span-1">
                        {key != 'null' &&
                          <h3 className="flex content-center font-semibold text-black capitalize text-12">
                            <span className="text-primary">{key.toLowerCase()}</span>
                            <span className='mr-1'>:</span>
                            {
                              currentAttribute && (
                                <>
                                  {
                                    !selectedGroupName
                                      ? values?.find((x: any) => matchStrings(x?.fieldValue, currentAttribute, true))?.fieldLabel
                                      : selectedGroupName && selectedGroupName[key] ? <span className='font-semibold'>{' '}{selectedGroupName[key]}</span> : ""
                                  }
                                </>
                              )
                            }
                          </h3>
                        }
                      </div>
                      <div className="col-span-1 mt-4 sm:mt-0">
                        <div
                          role="list"
                          className="flex flex-wrap color-panel"
                        >
                          <Swiper
                            slidesPerView={5.5}
                            spaceBetween={10}
                            navigation={true}
                            loop={false}

                            breakpoints={{
                              640: {
                                slidesPerView: 5.5,
                              },
                              768: {
                                slidesPerView: 5.5,
                              },
                              1024: {
                                slidesPerView: 5.5,
                              },
                            }}
                          >
                            <div
                              role="list"
                              className="inline-flex mx-4 space-x-0 sm:mx-0 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-0"
                            >
                              {values.map((item: any, idx: any) => (
                                <SwiperSlide className="px-0" key={`${idx}-slider`}>
                                  <>
                                    <RadioGroup.Option key={idx} value={item.fieldValue}
                                      className={`-m-0.5 relative p-0.5 pdp-color-variant w-16 rounded flex items-center justify-center cursor-pointer`}
                                    >
                                      <RadioGroup.Label as="div" className="sr-only">
                                        {item.fieldName} {item.value}
                                      </RadioGroup.Label>
                                      <Link href="javascript:void(0);">
                                        <a aria-hidden="true" onClick={() => handleChange(key, item.fieldValue, values)}
                                          className={classNames(item.fieldvalue,)}>
                                          <img src={item?.fieldValue || IMG_PLACEHOLDER}
                                            className={`${matchStrings(item?.fieldLabel, !selectedGroupName ? defaultFieldLabel : selectedGroupName[key], true) ? "border-gray-800" : "border-gray-200"} rounded border  hover:border-gray-400`}

                                          />
                                        </a>
                                      </Link>
                                    </RadioGroup.Option>
                                  </>
                                </SwiperSlide>

                              ))}
                            </div>
                          </Swiper>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </>
              )
            })
          }
        </div>
      </div>

    </>
  )
}