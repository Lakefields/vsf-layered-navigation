import { extendStore } from '@vue-storefront/core/helpers';
import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { mutations } from './store/mutations'
import { actions } from './store/actions'
import { getters } from './store/getters'

const LayeredNavigationStore = {
  namespaced: true
}

const extendedCatalogModule = {
  state: {
    priceRange: {},
    initial_products: []
  },
  mutations,
  actions,
  getters
}

export const LayeredNavigationModule: StorefrontModule = function ({ store }) {
  store.registerModule('layered-navigation', LayeredNavigationStore);
  extendStore('category-next', extendedCatalogModule);
}
