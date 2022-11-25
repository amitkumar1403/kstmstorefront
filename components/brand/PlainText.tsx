export default function PlainText(props: any) {
  return (
    <div className="w-full flex flex-col justify-center items-center py-y">
      <h1 className="text-gray-900 text-center font-bold text-4xl py-5 ">
        {props.heading}
      </h1>
      <div
        dangerouslySetInnerHTML={{
          __html: props.name,
        }}
      />
    </div>
  )
}
