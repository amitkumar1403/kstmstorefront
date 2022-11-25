import { FC } from 'react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import { BTN_SEE_EVERYTHING, IMG_PLACEHOLDER } from '@components/utils/textVariables'

SwiperCore.use([Navigation])

interface Props {
  config: {
    title?: string
    products?: Array<[]>
    paragraph?: string
    buttonText?: string
    subTitle?: string
  }
}

const ProductSlider: FC<Props> = ({ config }) => {
  var settings = {
    fade: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    centerMode: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-8 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h2 className="sm:text-6xl text-4xl font-extrabold text-center tracking-tight text-gray-900">
            {config?.title}
          </h2>
          <h2 className="sm:py-5 py-3 sm:text-4xl text-xl text-center font-bold tracking-tight text-gray-900">
            {config?.subTitle}
          </h2>
          <p className="sm:py-5 py-3 sm:text-xl text-md tracking-tight text-center sm:max-w-40p text-gray-900">
            {config?.paragraph}
          </p>
        </div>

        <div className="mt-8 relative">
          <div className="relative w-full overflow-x-auto">
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              navigation={true}
              loop={true}

              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 4,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
            >
              <div
                role="list"
                className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-8"
              >
                {config?.products?.map((product?: any) => (
                  <SwiperSlide className="px-5" key={product?.slug}>
                    <Link href={product?.slug}>
                      <div
                        key={product?.id}
                        className="cursor-pointer w-64 inline-flex flex-col text-center lg:w-auto"
                      >
                        <div className="group relative">
                          <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                            <Image priority
                              src={product?.image || IMG_PLACEHOLDER}
                              alt={product?.name}
                              layout="responsive"
                              width={257}
                              height={362}
                              className="w-full h-full object-center object-cover group-hover:opacity-75"></Image>
                          </div>
                          <div className="mt-6">
                            <p className="text-sm text-gray-500">
                              {product?.color}
                            </p>
                            <h3 className="mt-1 font-semibold text-gray-900">
                              <span className="absolute inset-0" />
                              {product?.name}
                            </h3>
                            <p className="mt-1 text-gray-900">
                              {product?.price?.formatted?.withTax}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductSlider
