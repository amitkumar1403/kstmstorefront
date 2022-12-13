import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Alert, Button } from "@material-tailwind/react";

export default function InfiniteScrollComponent({
  component,
  total,
  fetchData,
  currentNumber,
}: any)

{
  const [show, setshow] = useState(false)
  const [altertShow, setAlertShow] = useState(false);
  useEffect(() => {
    // handleClick()
  
    return () => {
      setshow(false)
    }
  }, [])

  const handleClick=()=>{
    if(currentNumber<total)
    {
      // console.log(":inside If")
        setshow(true)
        setTimeout(() => {
          // console.log("timeout called")
         setshow(false)
        }, 1000)
        return
    }
    // console.log("else simple return ")
    setAlertShow(true)
    return
   }
  
  return (
    <>
    <div className='flex justify-end m-2'>
    <div className={`fixed z-50 bg-transparent border-blue-500 text-blue-700 px-3 py-2  ${altertShow && `bg-gray-200`}`} role="alert">
    {/* <Alert>A simple alert for showing message.</Alert> */}
      <Alert
        show={altertShow}
        dismissible={{
          onClose: () => setAlertShow(false),
        }}
      >
      You have seen all the products ✌ ||  Please wait 🥱
      </Alert>
    {/* <p className="font-bold">Informational message</p>
    <p className="text-sm">Some additional text to explain said message.</p> */}
    </div>
    </div>
    <InfiniteScroll
      dataLength={total} //This is important field to render the next data
      next={fetchData}
      hasMore={show}
      // loader={<h3 className=''>Loading . . .</h3>}
      loader={null}

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
          {!(currentNumber<=total)?`Loading ...`:`Load More`}</button>
                            {/*  if we have more pages to load then LOAD MORE  */}
        </p>                                    
      }
      >
      {component}
    </InfiniteScroll>
      </>
  )
}
