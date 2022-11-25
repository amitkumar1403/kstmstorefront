export default function Video({ heading, name }: any) {
  return (
    <div className="w-full flex flex-col justify-center items-center py-y">
      <h1 className="text-gray-900 text-center font-bold text-4xl py-5 ">
        {heading}
      </h1>
      <iframe
        width="560"
        height="315"
        src={name}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
