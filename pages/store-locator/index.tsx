import { useState } from 'react'
import axios from 'axios'
import { Layout } from '@components/common'
import { NEXT_STORE_LOCATOR } from '@components/utils/constants'
import Link from 'next/link'

export default function StoreLocatorPage() {
  const [value, setValue] = useState('')
  const [stores, setStores] = useState([])

  const handleChange = (userInputValue: string) => {
    //fetching
    setValue(userInputValue)
  }

  const handleStoreFind = async () => {
    //fetch
    const response: any = await axios.post(NEXT_STORE_LOCATOR, {
      postCode: value,
    })
    setStores(response.data)
  }

  return (
    <div>
      <input onChange={(e: any) => handleChange(e.target.value)} />
      <button
        className="bg-gray-900 text-white"
        type="button"
        onClick={handleStoreFind}
      >
        Find
      </button>
      {stores.map((store: any, idx: number) => {
        return (
          <div key={idx} className="text-gray-900">
            <Link href={`/store-locator/${store.name}`}>
              <h2>{store.name}</h2>
            </Link>
            <h2>{store.availableToCollectIn}</h2>
            <h2>{store.city}</h2>
            <h2>{store.postCode}</h2>
          </div>
        )
      })}
    </div>
  )
}

StoreLocatorPage.Layout = Layout
