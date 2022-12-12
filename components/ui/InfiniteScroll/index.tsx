import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function InfiniteScrollComponent({
  component,
  total,
  fetchData,
  currentNumber,
}: any)

{
  console.log(currentNumber>total)
  const [show, setshow] = useState(false)
  return (
    <InfiniteScroll
      dataLength={total} //This is important field to render the next data
      next={fetchData}
      hasMore={show}
      // loader={<h3 className='flex justify-center pt-6 border border-black py-2 px-8 text-gray-700 hover:text-white hover:bg-black' >Loading...</h3>}
      // loader={<h3 className=''>Loading . . .</h3>}
      loader={null}

      endMessage={
        <p
        className='flex justify-center pt-6'
       >
          <button
          onClick={()=>(currentNumber<total?
          (  setshow(true),setTimeout(() => {
            setshow(false)
          }, 500))
            :null)}                                                                                                 //12<70
          className={`border border-black py-2 px-8 text-gray-700 hover:text-white hover:bg-black }`}>
          {!(currentNumber<total)?`Loading ...`:`Load More`}</button>
        </p>
      }
    >
      {component}
    </InfiniteScroll>
  )
}
