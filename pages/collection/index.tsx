import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import getCollections from '@framework/api/content/getCollections'
import { Layout } from '@components/common'
import Link from 'next/link'
import Image from 'next/image'
import { 
  IMG_PLACEHOLDER, 
  PRODUCTS_AVAILABLE, 
  SHOP_BY_COLLECTION 
} from '@components/utils/textVariables'
export default function CollectionList(props: any) {
  
  return (
    <main className="w-full mx-auto md:w-4/5 px-6 sm:px-0">
      <section aria-labelledby="products-heading" className="mt-8">
        <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-900">
          {SHOP_BY_COLLECTION}
        </h2>
        {props?.data.length > 0 &&
        <div className="py-10 grid grid-cols-2 sm:gap-y-10 gap-y-6 sm:grid-cols-4 gap-x-6 lg:grid-cols-6 xl:gap-x-8">
          {props.data.map((collection: any, key: any) => (
            <Link key={key} href={`/collection/${collection.slug}`}>
              <a
                key={collection.id}
                href={`/collection/${collection.slug}`}
                className="group"
              >
                <div className="relative w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3 bg-gray-100">
                  <div className='image-container'>
                        <Image 
                            src={collection.mainImage || IMG_PLACEHOLDER }
                            alt={collection.name}
                            className="w-full h-full object-center object-cover group-hover:opacity-75 image"
                            layout='fill'
                        ></Image>  
                      </div>
                </div>
                <div className='flex-1'>
                   <h1
                    className="pt-2 text-gray-900 font-medium sm:text-xl text-md flex w-full"
                  >
                    {collection.name}
                  </h1>

                   <h4
                    className="pt-1 text-gray-500 font-normal sm:text-sm text-xs w-full"
                  >
                    {collection.noOfRecords}{' '} <span className='italic'>{PRODUCTS_AVAILABLE}</span>
                  </h4>
                </div>
              </a>
            </Link>
          ))}
        </div>
        }
        {props?.data.length == 0 &&
        <>
          <div className='flex flex-col text-center py-32'>
            <h2 className='text-4xl font-bold text-gray-200 w-full mx-auto'>No Collection Available</h2>
          </div>
        </>
      }
      </section>
    </main>
  )
}

CollectionList.Layout = Layout

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const collectionData = await getCollections()
  return {
    props: {
      data: collectionData,
    },
    revalidate: 200,
  }
}
