import {  useState ,useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Alert } from "@material-tailwind/react";
import LoadingDots from '../LoadingDots';
import React, { memo } from 'react';

 function InfiniteScrollComponent({
  component,
  total,
  fetchData,
  currentNumber,
}: any)

{
  const [loadMore, setLoadMore] = useState(false)
  const [altertShow, setAlertShow] = useState(false);
  // useEffect(() => {
    
  
  //   return () => {
  //     setLoadMore(false)
  //   }
  // }, [fetchData])
  
  const handleClick=()=>{
    if(currentNumber<total)
    {
      // console.log(":inside If")
        setLoadMore(true)
        console.log("setLoadMore to true ",loadMore)
        setTimeout(() => {
        //  console.log("timeout called")
         setLoadMore(false)
        console.log("setLoadMore to false",loadMore)

        }, 1000)
        return
    }
    //  console.log("else simple return ")
    setAlertShow(true)
    return
   }
  
  return (
    <>
  
    {console.count('counter')}
    <div className='flex justify-end mr-2 mt-2'>
    <div className={`sm:h-16 sm:w-30 fixed -mt-24 z-50 bg-transparent font-medium   px-2 py-1  ${altertShow && `bg-gray-200 `}`} role="alert">
    {/* <Alert>A simple alert for showing message.</Alert> */}
      <Alert
        show={altertShow}
        dismissible={{
          onClose: () => setAlertShow(false),
        }}
      >
      You have seen all the products ✌ ||  Please wait 🥱
      </Alert>
    </div>
    </div>
   
    <InfiniteScroll
      dataLength={total} //This is important field to render the next data
      next={fetchData}
      hasMore={loadMore}
      // loader={<h3 className=''>Loading . . .</h3>}
      loader={<p className='mt-10'>.</p>}
      // loader={null}
      endMessage={
        <p
        className='flex justify-center pt-6'
       >
          <button  
          onClick={handleClick}                                                                                         
          className={`border border-black py-2 px-8 text-gray-700 hover:text-white hover:bg-black ` }   >
            {/* 12<70 */}
            {/* !true */}
                    {/* !(by default false)  when data is fetching or no more page to load then LOADING... */}
          {!(currentNumber<=total)? <LoadingDots />:`Load More`}</button>
                            {/*  if we have more pages to load then LOAD MORE  */}
        </p>                                    
      }
      >
      {component}
    </InfiniteScroll>
     {/* {loadMore && <div className='sm:mt-10'>.</div> } */}
      </>
  )
}
// export default memo(InfiniteScrollComponent);
export default InfiniteScrollComponent;

