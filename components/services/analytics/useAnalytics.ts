import { useState, useEffect, useLayoutEffect } from 'react'
import eventDispatcher from './eventDispatcher'
import { useUI } from '@components/ui/context'
declare global {
  interface window {
    dataLayer: any
  }
}

export default function useAnalytics(
  event: string,
  data: any,
  ipAddress?: string
) {
  // const windowClone: any = typeof window !== 'undefined' ? window : {}
  const dataLayer =
    typeof window !== 'undefined' &&
    (<any>window).dataLayer &&
    (<any>window).dataLayer[0].ipAddress

  useEffect(() => {
    //console.count(`inside use effect ${dataLayer}`)
    if (dataLayer) eventDispatcher(event, data)
  }, [dataLayer])
}
