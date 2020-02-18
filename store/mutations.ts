import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<any> = {
  [types.SET_PRICE_RANGE_CURRENT_CATEGORY] (state, {category, price_range}) {
    state.priceRange[category.id] = price_range
  }
}
