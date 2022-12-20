import InfiniteScroll from 'react-infinite-scroll-component'
import LoadingDots from '../LoadingDots';

 function InfiniteScrollComponent({
  component,
  total,
  fetchData,
  currentNumber,
}: any)

{
  return (
    <InfiniteScroll
      dataLength={total} 
      next={fetchData}
      hasMore={currentNumber<total}
      loader={null}
      endMessage={
        <p className='flex justify-center pt-6'>
              <button                                                                                 
              className={` py-2 px-8 text-gray-700 hover:text-white hover:bg-black ` }   >
              {!(currentNumber<=total)? <LoadingDots />:`You have seen all !`} </button>
        </p>    }>
      {component}
    </InfiniteScroll>
  )
}
export default InfiniteScrollComponent;

