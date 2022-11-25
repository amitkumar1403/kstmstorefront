import axios from 'axios'
import { NEXT_GEO_ENDPOINT } from '@components/utils/constants'

export default async function geoData() {
  try {
    const { data }: any = await axios.get(NEXT_GEO_ENDPOINT, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    return data
  } catch (error) {
    console.log(error, 'err')
  }
}
