export const setItem = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export const getItem = (key: string) => {
  let item: string | null = null
  if (typeof window !== 'undefined') {
    item = localStorage.getItem(key)
  }
  return item ? JSON.parse(item) : null
}

export const removeItem = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}
