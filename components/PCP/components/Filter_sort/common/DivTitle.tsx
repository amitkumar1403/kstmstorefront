type data=
{
  heading:string
}

const DivTitile = ({heading}:data) => {
  return (
    <h1 className="m-2 font-bold">{heading}</h1>
  )
}

export default DivTitile