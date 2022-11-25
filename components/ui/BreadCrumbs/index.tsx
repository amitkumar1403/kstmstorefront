import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Props {
  items: []
  currentProduct: any
}

export default function BreadCrumbs({ items = [], currentProduct }: Props) {
  const flattenBreadcrumbs = (breadcrumbs: any) => {
    let flattenedItems: [] = []
    const flatten = (items: any, key: string) => {
      items.reduce((acc: any, obj: any) => {
        acc.push(obj[key])
        if (obj[key] && obj[key].childSlug) {
          flatten([{ childSlug: obj[key].childSlug }], 'childSlug')
        }
        return acc
      }, flattenedItems)
    }
    flatten(breadcrumbs, 'slug')
    return flattenedItems
  }

  const createBreadcrumbs = (items: any = []) => {
    const map: any = flattenBreadcrumbs(items)
    const currentCrumb: any = {
      title: currentProduct.name,
      slug: '#',
      isCurrent: true,
    }
    map.push(currentCrumb)
    return map
  }

  //const [flattenedItems, setFlattenedItems] = useState(createBreadcrumbs(items))
  const flattenedItems = createBreadcrumbs(items)
  return (
    <ol role="list" className="flex items-center sm:space-x-0 space-x-0">
      {flattenedItems.map((breadcrumb: any, breadcrumbIdx: number) => (
        <li key={breadcrumbIdx}>
          <div className="flex items-center sm:text-sm text-xs">
            <Link href={`/${breadcrumb.slug}`} passHref>
              <a
                href={breadcrumb.slug}
                className={`font-normal hover:text-gray-900 ${
                  breadcrumb.isCurrent ? 'text-black font-semibold' : 'text-gray-400'
                }`}
              >
                {breadcrumb.title}
              </a>
            </Link>
            {breadcrumbIdx !== flattenedItems.length - 1 ? (
              <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                aria-hidden="true"
                className="sm:ml-0 ml-0 flex-shrink-0 h-4 w-4 text-gray-300"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
