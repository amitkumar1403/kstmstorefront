interface abc{
  data:string
}
const ColorDiv = ({data}:abc) => {
  return (
    <>
    <div className='border border-gray p-5 hover:border-black  '>
      <img src={data} 
      className='w-8 m-auto'/>
    </div>
    </>
   
  )
}

export default ColorDiv