import { FC } from 'react'
import dynamic from 'next/dynamic'
import { Dialog } from '@headlessui/react'
import { GENERAL_FILTER_TITLE } from '@components/utils/textVariables'

const ProductFilterRight = dynamic(() => import('@components/product/Filters/filtersRight'))
const ProductFiltersTopBar = dynamic(() => import('@components/product/Filters/FilterTopBar'))

type ProductFilterRightProps = {
    handleFilters: Function,
    products: any,
    routerFilters: any,
}

type ProductFiltersTopBarProps = {
    products: any,
    handleSortBy: Function,
    routerFilters: any,
    routerSortOption: any,
}

type AllProps = ProductFilterRightProps & ProductFiltersTopBarProps

interface FilterDialogProps extends AllProps {
    isOpen: boolean;
    handleToggleFilterDialog: Function;
    handleClearAll: Function;
}

const FilterDialog: FC<FilterDialogProps> = (props) => {
    const {
        isOpen,
        handleToggleFilterDialog,
        handleFilters,
        products,
        routerFilters,
        handleSortBy,
        handleClearAll,
        routerSortOption
    } = props

    return (
        <Dialog
            open={isOpen}
            onClose={() => handleToggleFilterDialog()}
            className="z-999"
        >
            {/* backdrop component */}
            <div
                className="fixed top-0 right-0 inset-0"
                aria-hidden="true"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
            />
    
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <Dialog.Panel className="absolute top-0 right-0 mx-auto w-full max-w-md bg-white p-4">
                        <Dialog.Title>
                            <div className='flex items-center justify-between'>
                                <h4>{GENERAL_FILTER_TITLE}</h4>
                                <span 
                                    onClick={() => handleToggleFilterDialog()}
                                    className='cursor-pointer block py-2 px-4 transition hover:bg-gray-200 select-none'
                                >
                                    X
                                </span>
                            </div>
                        </Dialog.Title>

                        {/* filters */}
                        <ProductFiltersTopBar
                            products={products}
                            handleSortBy={handleSortBy}
                            routerFilters={routerFilters}
                            clearAll={handleClearAll}
                            routerSortOption={routerSortOption}
                        />
                        
                        {/* filters */}
                        <ProductFilterRight
                            handleFilters={handleFilters}
                            products={products}
                            routerFilters={routerFilters}
                        />

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-4 mt-4 text-ms">
                            <button
                                className="col-span-1 py-3 text-gray-700 border border-gray-200 transition hover:opacity-75"
                                type="button"
                                onClick={() => handleClearAll()}
                            >
                                Clear All
                            </button>
                            <button
                                className="col-span-1 py-3 text-gray-200 bg-gray-900 transition hover:opacity-75"
                                type="button"
                                onClick={() => handleToggleFilterDialog()}
                            >
                                Apply
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
  )
}

export default FilterDialog