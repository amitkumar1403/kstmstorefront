import { getCommerceProvider, useCommerce as useCoreCommerce } from '@commerce'
import { betterCommerceProvider, BetterCommerceProvider } from './provider'
import useContentSnippet from './content/use-content-snippet';

export { betterCommerceProvider }
export type { BetterCommerceProvider }

export const CommerceProvider = getCommerceProvider(betterCommerceProvider)

export const useCommerce = () => useCoreCommerce<BetterCommerceProvider>()
export { useContentSnippet };