import axios from 'axios'

const url =
  'https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.10/json3.ws'

const retrieveUrl =
  'https://services.postcodeanywhere.co.uk/Capture/Interactive/Retrieve/v1.00/json3.ws'

export default function loqateAddress() {
  return async function handler({ postCode, country }: any) {
    const findAddressUrl =
      url +
      `?Key=${process.env.LOQATE_KEY}&Text=${postCode}&Countries=${country}`
    try {
      const response: any = await axios.post(findAddressUrl)
      console.log(response.data.Items)
      if (
        response.data.Items.length == 1 &&
        typeof response.data.Items[0].Error != 'undefined'
      ) {
        // Show the error message
        // throw new Error(response.data.Items[0].Description)
      } else {
        if (response.data.Items.length == 0) {
          return { response: { message: 'No items found', data: [] } }
        } else {
          return {
            response: {
              message: '',
              data: response.data.Items.filter(
                (i: any) => i.Type === 'Address'
              ),
            },
          }
        }
      }
    } catch (error: any) {
      console.log(error, 'err')
      // throw new Error(error.message)
    }
  }
}

export const retrieveAddress = () => {
  return async function handler(id: string, cookies?: any) {
    try {
      const retrieveAddress =
        retrieveUrl +
        `?Key=${process.env.LOQATE_KEY}&Id=${encodeURIComponent(id)}`
      const address: any = await axios.post(retrieveAddress)
      return { response: { message: '', data: address.data.Items } }
    } catch (error: any) {
      console.log(error)
      throw new Error(error.message)
    }
  }
}
