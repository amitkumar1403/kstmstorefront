import axios from 'axios'

export const getData = (url: string) => axios.get(url).then((res) => res.data)

export const postData = (url: string, body: any) =>
  axios.post(url, body).then((res) => res.data)
