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
      loader={null}
      endMessage={
        <p
        //  className="py-5"
        // className='flex justify-center pt-6'
        style={{ display: 'flex' , justifyContent:"center" ,paddingTop: "1.5rem" }}>
          {/* <b>You have seen it all</b> */}
          <button
          // onChange={()=>setshow(false)}
          onClick={()=>(currentNumber<total?
          (  setshow(true),setTimeout(() => {
            setshow(false)
          }, 1000))
            :setshow(false))}
          className='border border-black py-2 px-8 text-gray-700 hover:text-white hover:bg-black font'>Load more</button>
        </p>
      }
    >
      {component}
    </InfiniteScroll>
  )
}
