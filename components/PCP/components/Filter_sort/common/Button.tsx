type data=
{
  title:string
}
const Button = ({title}:data) => {
  return (
    <button className='border border-gray-200 py-6 font-bold px-6 text-gray-700 hover:text-black hover:border-black text-lg col-span-1'  >{title}</button>
  )
}

export default Button