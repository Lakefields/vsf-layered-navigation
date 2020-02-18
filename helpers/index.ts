import config from 'config'
import { baseFilterProductsQuery } from '@vue-storefront/core/helpers/index'
import FilterVariant from '../types/FilterVariant'
import { getSystemFilterNames } from '@vue-storefront/core/modules/catalog-next/helpers/filterHelpers'
import { Filters } from '@vue-storefront/core/modules/catalog-next/types/Category'

export function buildFilterProductsQuery (currentCategory, chosenFilters = {}, defaultFilters = null) {
  let filterQr = baseFilterProductsQuery(currentCategory, defaultFilters == null ? config.products.defaultFilters : defaultFilters)

  // add choosedn filters
  for (let code of Object.keys(chosenFilters)) {
    const filter = chosenFilters[code]
    const attributeCode = Array.isArray(filter) ? filter[0].attribute_code : filter.attribute_code
    if (Array.isArray(filter) && attributeCode !== 'price') {
      const values = filter.map(filter => filter.id)
      filterQr = filterQr.applyFilter({key: attributeCode, value: {'in': values}, scope: 'catalog'})
    } else if (attributeCode !== 'price') {
      filterQr = filterQr.applyFilter({key: attributeCode, value: {'eq': filter.id}, scope: 'catalog'})
    } else { // multi should be possible filter here?
      const price_obj = filter.shift()
      const price_range = price_obj[Object.keys(price_obj)[0]].split('-')
      const rangeqr = {}
      rangeqr['gte'] = price_range[0]
      rangeqr['lte'] = price_range[1]
      filterQr = filterQr.applyFilter({key: attributeCode, value: rangeqr, scope: 'catalog'})
    }
  }

  return filterQr
}

/**
 * Creates new filtersQuery (based on currentQuery) by modifying specific filter variant.
 */
export const changeFilterQuery = ({currentQuery = {}, filterVariant}: {currentQuery?: any, filterVariant?: FilterVariant} = {}) => {
  const newQuery = JSON.parse(JSON.stringify(currentQuery))
  if (!filterVariant) return newQuery
  if (getSystemFilterNames.includes(filterVariant.type)) {
    if (newQuery[filterVariant.type] && newQuery[filterVariant.type] === filterVariant.id) {
      delete newQuery[filterVariant.type]
    } else {
      newQuery[filterVariant.type] = filterVariant.id
    }
  } else {
    let queryFilter = newQuery[filterVariant.type] || []
    if (!Array.isArray(queryFilter)) queryFilter = [queryFilter]
    if(filterVariant.type === 'price'){
      if(filterVariant.remove) {
        delete newQuery[filterVariant.type]
      } else {
        newQuery[filterVariant.type] = parseInt(filterVariant.from) + '-' + parseInt(filterVariant.to)
      }
    } else {
      if (queryFilter.includes(filterVariant.id)) {      
        queryFilter = queryFilter.filter(value => value !== filterVariant.id)
      } else if (filterVariant.single) {
        queryFilter = [filterVariant.id]
      } else {
        queryFilter.push(filterVariant.id)
      }
      // delete or add filter variant to query
      if (!queryFilter.length) delete newQuery[filterVariant.type]
      else newQuery[filterVariant.type] = queryFilter
    }
  }
  return newQuery
}

export const getFiltersFromQuery = ({filtersQuery = {}, availableFilters = {}} = {}): { filters: Filters } => {
  const searchQuery = {
    filters: {}
  }
  Object.keys(filtersQuery).forEach(filterKey => {
    const filter = availableFilters[filterKey]
    let queryValue = filtersQuery[filterKey]
    if (!filter) return
    // keep original value for system filters - for example sort
    if (getSystemFilterNames.includes(filterKey)) {
      searchQuery[filterKey] = queryValue
    } else {
      queryValue = [].concat(filtersQuery[filterKey])
      queryValue.map(singleValue => {
        const variant = filter.find(filterVariant => filterVariant.id === singleValue)
        if (!variant) return
        if (!Array.isArray(searchQuery.filters[filterKey])) searchQuery.filters[filterKey] = []
        searchQuery.filters[filterKey].push({...variant, attribute_code: filterKey})
      })
      if(filterKey === 'price'){
        const price_range = queryValue[Object.keys(queryValue)[0]].split('-')
        searchQuery.filters[filterKey] = [{...queryValue, id: price_range[0] + "-" + price_range[1], from: price_range[0], to: price_range[1], attribute_code: filterKey}]
      }
    }
  })
  return searchQuery
}
