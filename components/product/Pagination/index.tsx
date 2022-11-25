// @ts-ignore
import ReactPaginate from 'react-paginate'
import { FC } from 'react'

interface Props {
  currentPage?: string | number
  onPageChange?: Function
  pageCount?: string | number
}
const Pagination: FC<Props> = ({
  currentPage = '1',
  onPageChange = () => {},
  pageCount = 20,
}) => {
  return (
    <>
      <ReactPaginate
        previousLabel={'Previous'}
        previousClassName="py-1 mr-40 inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
        nextClassName="py-1 ml-40 inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'inline-flex items-center text-gray-500 px-1.5 h-10'}
        pageCount={Number(pageCount)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={5}
        initialPage={Number(currentPage) - 1}
        disableInitialCallback={true}
        pageClassName="px-2 py-1"
        activeLinkClassName="inline-flex items-center px-4 h-10 border border-indigo-600 ring-1 ring-indigo-600 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
        pageLinkClassName={
          'inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25'
        }
        onPageChange={onPageChange}
        containerClassName={
          'max-w-7xl mx-auto px-4 mt-6 flex justify-between text-sm font-medium text-gray-700 sm:px-6 lg:px-8'
        }
      />
    </>
  )
}

export default Pagination
