import { ActionTree } from 'vuex'
import { ExtendedCatalogState } from '../types/ExtendedCatalogState'
import FilterVariant from '../types/FilterVariant'
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import { buildFilterProductsQuery, changeFilterQuery } from '../helpers'
import omit from 'lodash-es/omit'
import isEmpty from 'lodash-es/isEmpty'
import cloneDeep from 'lodash-es/cloneDeep'
import { products, entities } from 'config'
import config from 'config'
import has from 'lodash-es/has'
import * as types from './mutation-types'
import * as coretypes from '@vue-storefront/core/modules/catalog-next/store/category/mutation-types'
import { router } from '@vue-storefront/core/app'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

export const actions: ActionTree<ExtendedCatalogState, any> = {
  async loadCategoryProducts ({ commit, getters, dispatch }, { route, category, pageSize = 50 } = {}) {
    const searchCategory = category || getters.getCategoryFrom(route.path) || {}
    const categoryMappedFilters = getters.getFiltersMap[searchCategory.id]
    const areFiltersInQuery = !!Object.keys(route[products.routerFiltersSource]).length
    if (!categoryMappedFilters && areFiltersInQuery) { // loading all filters only when some filters are currently chosen and category has no available filters yet
      await dispatch('loadCategoryFilters', searchCategory)
    }
    const searchQuery = getters.getCurrentFiltersFrom(route[products.routerFiltersSource], categoryMappedFilters)
    let filterQr = buildFilterProductsQuery(searchCategory, searchQuery.filters)
    const {items, perPage, start, total, aggregations} = await quickSearchByQuery({
      query: filterQr,
      sort: searchQuery.sort || `${products.defaultSortBy.attribute}:${products.defaultSortBy.order}`,
      includeFields: entities.productList.includeFields,
      excludeFields: entities.productList.excludeFields,
      size: pageSize
    })

    const categoryPriceRange = getters.getPriceRange
    const priceSliderAttribute = config.layeredNavigation.priceSliderAttribute
    const minPrice = Math.floor(Math.min.apply(Math, items.map((attribute) => { return attribute[priceSliderAttribute] })))
    const maxPrice = Math.ceil(Math.max.apply(Math, items.map((attribute) => { return attribute[priceSliderAttribute] })))
    let price_range = [minPrice, maxPrice]
    if(!has(categoryPriceRange, searchCategory.id)) {
      commit(types.SET_PRICE_RANGE_CURRENT_CATEGORY, { category: searchCategory, price_range: price_range })
    } else {
      const categoryPriceRangeState = getters.getPriceRange[searchCategory.id]
      price_range = [Math.min(categoryPriceRangeState[0], minPrice), Math.max(categoryPriceRangeState[1], maxPrice)]
    }

    await dispatch('loadAvailableFiltersFrom', {aggregations, category: searchCategory, price_range, filters: searchQuery.filters})
    commit(coretypes.CATEGORY_SET_SEARCH_PRODUCTS_STATS, { perPage, start, total })
    const configuredProducts = await dispatch('processCategoryProducts', { products: items, filters: searchQuery.filters })
    commit(coretypes.CATEGORY_SET_PRODUCTS, configuredProducts)

    return items
  },
  async loadAvailableFiltersFrom ({ commit, getters }, {aggregations, category, price_range, filters = {}}) {
    const aggregationFilters = getters.getAvailableFiltersFrom(aggregations)
    const currentCategory = category || getters.getCurrentCategory
    const categoryMappedFilters = getters.getFiltersMap[currentCategory.id]
    let resultFilters = aggregationFilters
    const filtersKeys = Object.keys(filters)
    if (categoryMappedFilters && filtersKeys.length) {
      resultFilters = Object.assign(cloneDeep(categoryMappedFilters), cloneDeep(omit(aggregationFilters, filtersKeys)))
    }
    if(resultFilters.hasOwnProperty('price')){
      resultFilters.price = price_range
    }
    commit(coretypes.CATEGORY_SET_CATEGORY_FILTERS, {category, filters: resultFilters})
  },
  async switchSearchFilters ({ dispatch }, filterVariants: FilterVariant[] = []) {
    let currentQuery = router.currentRoute[products.routerFiltersSource]
    filterVariants.forEach(filterVariant => {
      currentQuery = changeFilterQuery({currentQuery, filterVariant})
    })
    await dispatch('changeRouterFilterParameters', currentQuery)
  },
  async resetSearchFilters ({dispatch}) {
    await dispatch('changeRouterFilterParameters', {})
    EventBus.$emit('reset-filters')
  }
}
