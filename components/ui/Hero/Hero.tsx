import React, { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface HeroProps {
  banners?: []
}

interface BannerProps {
  url: string
  link: string
  alt: string
}

// import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper'

// install Swiper modules
SwiperCore.use([Navigation])

const Hero: FC<HeroProps> = ({ banners = [] }) => {

  return (
    <div className="relative bg-gray-900">
      <Swiper navigation={true} loop={true} className="mySwiper">
        {banners.map((banner: BannerProps, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <Link href={banner?.link || '#'}>
                <div className='image-container'>
                  <Image
                    priority
                    src={banner?.url}
                    alt={banner?.alt}
                    layout="fill"
                    className='sm:max-h-screen sm:min-h-screen image banner-Image'></Image>
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default Hero
