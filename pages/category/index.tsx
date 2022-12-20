import type { GetStaticPropsContext } from 'next'
import { getAllCategories } from '@framework/category'
import Link from 'next/link'
import Image from 'next/image'
import { Layout } from '@components/common'
import {
  IMG_PLACEHOLDER,
  SHOP_BY_CATEGORY,
} from '@components/utils/textVariables'
export default function CategoryList(props: any) {
  return (
    <main className="w-full px-4 mx-auto sm:pt-4 sm:px-0 md:w-4/5 lg:px-0">
      <section aria-labelledby="products-heading ">
        <h2 className="pb-4 text-2xl font-bold tracking-tight text-center text-gray-900">
          {SHOP_BY_CATEGORY}
        </h2>
        {props?.data.length > 0 &&
          <div className="flow-root mt-1 sm:mt-0 ">
            <div className="my-0">
              <div className="box-content relative px-3">
                <div className="grid grid-cols-1 sm:p-3 sm:gap-y-2 gap-y-2 md:grid-cols-3 md:gap-x-28 sm:grid-cols-2 gap-x-0 lg:grid-cols-4 xl:gap-x-6">
                  {props?.data?.map((category: any, key: number) => (
                    <Link key={key} href={`/${category.link}`}>
                      <a
                        key={category.id}
                        href={`/${category.link}`}
                        className="relative flex flex-col w-screen overflow-hidden category-landing-image h-60 hover:opacity-75 xl:w-auto"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-screen opacity-90 "
                        />

                        <span aria-hidden="true" className="absolute inset-1">
                          {category?.image ? (
                            <div className='image-container'>
                              <Image
                                src={`${category?.image}?fm=webp&h=800&w=400` || IMG_PLACEHOLDER}
                                alt={category.name}
                                className="object-cover object-center w-full h-full group-hover:opacity-75 image"
                                layout="fill"
                              ></Image>
                            </div>
                          ) : (
                            <Image
                              src={IMG_PLACEHOLDER}
                              alt={category.name}
                              className="object-cover object-center w-full h-full group-hover:opacity-75 image"
                              layout="fill"
                            ></Image>
                          )}
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-4 h-1/3 opacity-40"
                        />
                        <span className="relative mt-auto text-sm font-bold text-center text-white uppercase bottom-6 sm:text-lg">
                          {category.name}
                        </span>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
        {props?.data.length == 0 &&
          <>
            <div className='flex flex-col py-32 text-center'>
              <h2 className='w-full mx-auto text-4xl font-bold text-gray-200'>No Category Available</h2>
            </div>
          </>
        }
      </section>
    </main>
  )
}

CategoryList.Layout = Layout

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const data = await getAllCategories()
  return {
    props: {
      data,
    },
    revalidate: 200,
  }
}
