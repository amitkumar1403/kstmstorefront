import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'

SwiperCore.use([Navigation])

//temporary for testing purposes
const images = [
  'https://images.unsplash.com/photo-1640562051318-b849e5290551',
  'https://images.unsplash.com/photo-1638864616275-9f0b291a2eb6',
  'https://images.unsplash.com/photo-1640102371408-5fc0c42a8792',
  'https://images.unsplash.com/photo-1640114198747-fa498a232dd7',
  'https://images.unsplash.com/photo-1506830392367-16cbcd8b007c',
  'https://images.unsplash.com/photo-1632494424962-ca0fb15099dc',
]
export default function ImageCollection(props: any) {
  return (
    <div className="w-full flex flex-col justify-center items-center py-y">
      <h1 className="text-gray-900 text-center font-bold text-4xl py-5 ">
        {props.heading}
      </h1>
      <Swiper navigation={true} className="mySwiper">
        {images.map((image: any, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              <img
                src={image}
                alt=""
                className="cursor-pointer w-full h-full object-center object-cover"
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
