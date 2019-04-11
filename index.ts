import catalogCategoryExtendedModule from './store/category/actions'
import catalogProductExtendedModule from './store/product/actions'

const KEY = 'catalog'
export const layeredNavigationModule = {
  key: KEY,
  store: { 
    modules: [
    { key: 'category', module: catalogCategoryExtendedModule },
    { key: 'product', module: catalogProductExtendedModule },
    ] 
  }
} 
