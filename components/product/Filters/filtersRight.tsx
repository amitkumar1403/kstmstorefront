import FilterList from './FilterList'
import rangeMap from '@lib/range-map'
import { GENERAL_FILTER_TITLE } from '@components/utils/textVariables'

interface Props {
  products: any
  handleFilters: any
  routerFilters: any
}

export default function FiltersRightOpen({
  products = { filters: [] },
  handleFilters,
  routerFilters,
}: Props) {
  return (
    <div className="bg-transparent ">
      {/* Mobile filter dialog */}
      <div className="relative  w-full border-r flex flex-col px-6 overflow-y-scroll max-h-40R bg-gray-100 text-black ">
        <div className="px-0 pt-2 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            {GENERAL_FILTER_TITLE}
          </h2>
        </div>

        {/* Filters */}
        <form className="mt-2 ">

        {!products.filters.length && rangeMap(5,(section: any) => (
          <>
           <div className='h-6 w-16 animate-pulse shadow-magical bg-gray-200 mt-8' ></div>
            <div
              key={section}
              className="grid grid-cols-3 w-full h-20  mx-auto mt-4 animate-pulse  mb-5 border-b-2 border-gray-200 "
            >
              <div className='border border-gray-200 animate-pulse  h-14 py-4'>
                <div className='h-6 w-24 animate-pulse shadow-magical bg-gray-200 m-auto' ></div>
              </div>

              <div className='border border-gray-200 animate-pulse  h-14 py-4'>
                <div className='h-6 w-24 animate-pulse shadow-magical bg-gray-200 m-auto' ></div>
              </div>

              <div className='border border-gray-200 animate-pulse  h-14 py-4'>
                <div className='h-6 w-24 animate-pulse shadow-magical bg-gray-200 m-auto' ></div>
              </div>

            </div>
              </>
          ))}

          {products.filters?.map((section: any) => (
            <div
              key={section.name}
              className=" border-gray-200 sm:pr-4 px-4 sm:px-0 py-6"
            >
              <>
                <h3 className="-mx-2 -my-3">
                  <div className="px-2 py-2  w-full flex items-center justify-between text-md ">
                    <span className="font-medium text-gray-900">
                      {section.name}
                    </span>
                  </div>
                </h3>
                <div className="pt-3">
                  <div >
                    <FilterList
                      handleFilters={handleFilters}
                      sectionKey={section.key}
                      items={section.items}
                      routerFilters={routerFilters}
                    />
                  </div>
                </div>
              </>
            </div>
          ))}
        </form>
      </div>
    </div>
  )
}
