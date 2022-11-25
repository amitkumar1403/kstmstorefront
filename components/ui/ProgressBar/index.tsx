import { useState, useEffect } from 'react'

export default function ProgressBar() {
  const [progressPercent, setProgressPercent] = useState(0)

  useEffect(() => {
    let count = setInterval(() => {
      setProgressPercent((c: number) => c + 1)
    })
    return () => clearInterval(count)
  }, [])

  return (
    <div className="fixed top-0 w-full z-9999">
      <div className="overflow-hidden h-1 text-xs flex bg-gray-50">
        <div
          style={{
            transition: 'width 1s ease-in-out',
            width: `${progressPercent}%`,
          }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black"
        ></div>
      </div>
    </div>
  )
}
