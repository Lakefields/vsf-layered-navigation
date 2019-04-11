import rootStore from '@vue-storefront/core/store'
import { baseFilterProductsQuery } from '@vue-storefront/core/helpers'

export function buildFilterProductsQueryByFilterArray (currentCategory, chosenFilters, defaultFilters = null) {
  let filterQr = baseFilterProductsQuery(currentCategory, defaultFilters == null ? rootStore.state.config.products.defaultFilters : defaultFilters)

  for (let attributeCode of Object.keys(chosenFilters)) {
    const filter = chosenFilters[attributeCode]
    if (attributeCode !== 'price') {
      for (let filterOption of filter) {
        filterQr = filterQr.applyFilter({key: attributeCode, value: {'in': filterOption.id}, scope: 'catalog'})
      }
    } else {
      const rangeqr = {}
      for (let filterOption of filter) {
        if (filterOption.from) {
          rangeqr['gte'] = filterOption.from
        }
        if (filterOption.to) {
          rangeqr['lte'] = filterOption.to
        }
      }
      filterQr = filterQr.applyFilter({key: attributeCode, value: rangeqr, scope: 'catalog'})
    }
  }

  return filterQr
}
