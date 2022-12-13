import { useEffect, useState } from "react"

const Sale = () => {
    const [click, setclick] = useState(false)
    const handleClick=()=>{
     
       console.log("clicked")
       setclick(true)
    }
    useEffect(() => {
      setclick(false)
    }, [])
    
  return (
   <>
      {!click?
    (
      <div
      className="relative justify-center w-full px-10 py-1 text-center bg-black align-center "
      style={{ display: "block" }}
    >
      <h4 className="text-xs font-semibold text-white uppercase sm:text-sm">
      SIGN UP TO OUR NEWSLETTER TO HEAR ABOUT NEW STUFF
        <span className="absolute close-icon top-2/4 right-4 -translate-y-2/4">
          <a className="cursor-pointer">
            <img src="/assets/icons/close-icon-img.svg" alt="Close Icon" onClick={handleClick}/>
          </a>
        </span>
      </h4>
    </div>
    ):null
    }
   </>
  )
}


export default Sale