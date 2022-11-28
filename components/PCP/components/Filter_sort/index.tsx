import React from 'react'
import Btnspan3 from './common/Btnspan3'
import Btnspan6 from './common/Btnspan6'
import Button from './common/Button'
import ButtonBlack from './common/ButtonBlack'
import ColorDiv  from './common/ColorDiv'
import DivTitle from './common/DivTitle'


const Filter_sort = () => {
  return (
   <>
   <div  className='absolute mr-6 right-1 top-44  bg-gray-100 border border-gray min-h-screen  border-b-2 hover:shadow-2xl'>
     
     <DivTitle heading={"Filter & sort"}/>
     <div className='text-right border-b-2'> 
      <button className='px-2 font-bold'>Search</button>
      <button className='px-2 font-bold'>Account 
      <img src='/assets/icons/lock.png' 
      className='w-14 inline pb-2' />
      </button>
     </div>
    

     {/* btns */}
     <div className='grid grid-cols-2 py-7 px-7 border-b-2 '>
     <Button title={'New In'}/>
     <Button title={'Treding'}/>
     <Button title={'Price Low to High'}/>
     <Button title={'Price High to Low'}/>
     </div>

     {/* Product type */}
     <div>
     <DivTitle heading={"Product Type"}/>
     <div className='grid grid-cols-3 py-7 px-7 border-b-2 '>
     <Button title={'Track Pants'}/>
     <Button title={'Trackpants'}/>
     <Button title={'Trousers'}/>
     </div>
    </div>

    {/* size */}
    <div>
      <DivTitle heading={"Size"}/>
        <div className='grid grid-cols-6 py-7 px-7 border-b-2 '>
        <Button title={'XXS'}/>
        <Button title={'XS'}/>
        <Button title={'S'}/>
        <Button title={'M'}/>
        <Button title={'L'}/>
        <Button title={'XL'}/>
        <Btnspan6 title={"All Size"}/>
        </div>
    </div>
 
    {/* color */}

    <div>
    <DivTitle heading={"Color"}/>
    <div className= 'grid grid-cols-6 py-7 px-7 border-b-2'>

    <ColorDiv data={"/assets/icons/black.png"}/>
    <ColorDiv data={"/assets/icons/green.png"}/>
    <ColorDiv data={"/assets/icons/blue.png"}/>
    <ColorDiv data={"/assets/icons/brown.png"}/>
    <ColorDiv data={"/assets/icons/red.png"}/>
    <ColorDiv data={"/assets/icons/pink.png"}/>

    <ColorDiv data={"/assets/icons/cream.png"}/>
    <ColorDiv data={"/assets/icons/orange.png"}/>
    <ColorDiv data={"/assets/icons/violet.png"}/>
    <ColorDiv data={"/assets/icons/yellow.png"}/>
    <ColorDiv data={"/assets/icons/white.png"}/>
    <ColorDiv data={"/assets/icons/gray.png"}/>
    </div>
    </div>

    {/* science */}
    <div>
    <DivTitle heading={"Science"}/>
    <div className='grid grid-cols-3 py-7 px-7 border-b-2 '>
     <Button title={'Biobased'}/>
     <Button title={'Colorifix'}/>
     <Button title={'flowdwn'}/>
     <Btnspan3 title={"All Science"}/>
    </div>
     </div>

     {/* Gender */}
     <div>
     <DivTitle heading={"Gender"}/>
     <div className='grid grid-cols-2 py-7 px-7 border-b-2 '>
     <Button title={'Male'}/>
     <Button title={'Female'}/>
     </div>

     {/* submit */}
     <div>
     <div className='grid grid-cols-2 py-7 px-7 border-b-2 '>
     <Button title={'Clear All'}/>
     <ButtonBlack title={'Apply'}/>
     </div>
     </div>



     </div>

   </div>

  
   </>
  )
}

export default Filter_sort