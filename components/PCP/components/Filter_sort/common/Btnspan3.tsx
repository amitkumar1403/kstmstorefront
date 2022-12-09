const Btnspan3 = ({title}) => {
    return (
        <>
        <button className='border border-gray-200 py-6 font-bold px-6 text-gray-500  hover:border-black text-lg col-span-3 '>{title}
        <img src='/assets/icons/downArrow.png' alt="icon" 
        className="h-4 ml-2 inline hover:text-black"
        />
        </button>

        </>
    )
  }
  
  export default Btnspan3