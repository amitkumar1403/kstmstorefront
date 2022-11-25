import {
  NEXT_GET_WISHLIST,
  NEXT_CREATE_WISHLIST,
  NEXT_REMOVE_WISHLIST,
} from '@components/utils/constants'
import axios from 'axios'

export default function wishlistHandler() {
  let accessToken: boolean | any = false

  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('user')
  }

  return {
    addToWishlist: (
      userId: string,
      productId: any,
      insertToLocalWishlist: any
    ) => {
      if (accessToken) {
        const createWishlist = async () => {
          try {
            await axios.post(NEXT_CREATE_WISHLIST, {
              id: userId,
              productId,
              flag: true,
            })
            insertToLocalWishlist()
          } catch (error) {
            console.log(error, 'error')
          }
        }
        createWishlist()
      } else insertToLocalWishlist()
    },
    getWishlist: async (
      userId: string,
      localStorageWishlistItems: any = []
    ) => {
      try {
        if (userId) {
          const postExistingItems = async () => {
            await Promise.all(
              localStorageWishlistItems.map(async (item: any) => {
                try {
                  await axios.post(NEXT_CREATE_WISHLIST, {
                    id: userId,
                    productId: item.recordId,
                    flag: true,
                  })
                } catch (error) {
                  console.log(error)
                }
              })
            )
          }
          await postExistingItems()
          const response: any = await axios.post(NEXT_GET_WISHLIST, {
            id: userId,
            flag: true,
          })

          return response.data
        } else return localStorageWishlistItems
      } catch (error) {
        console.log(error, 'err')
      }
    },
    deleteWishlistItem: async (userId: string, productId: string) => {
      try {
        await axios.post(NEXT_REMOVE_WISHLIST, {
          id: userId,
          productId,
          flag: true,
        })
      } catch (error: any) {
        console.log(error, 'err')
        throw new Error(error)
      }
    },
  }
}
