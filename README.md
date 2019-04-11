# Layered Navigation Module
Multiselect filters in Vue Storefront

# Support
This module is build to enable multiple filter options per attribute in mind.
Use at your own responsibility in your project. This module is tested on Vue Storefront 1.9.
For any support installing, using or request features for this module in Vue Storefront, please contact us at http://www.getnoticed.nl/contact

# Installation
Clone this git repository and add config properties to your local.json config file.
Run yarn to install vue slider component for the price silder filter type. 

```shell
git clone git@github.com:GetNoticedNL/vsf-layered-navigation.git vue-storefront/src/modules/layered-navigation
```

```
"layeredNavigation": {
  "enableProductsLeftCounter": true,
  "pagePortionSize": 200
},
```

This is experimental, with the 'productsleftcounter' enabled, the results of a filteroption is added in the filters sidebar. If the filter option should result in an empty product list, the filter option is faded and not clickable.

This can result in a performance hit with large productlists, keep this in mind.

To take full advantage of this layered navigation module, please run the indexing for your catalog including these changes in Mage2Vuestorefront https://github.com/DivanteLtd/mage2vuestorefront/pull/70

# Module registeration - extend catalog core module
Open `src/modules/index.ts`

Uncomment `import { extendModule } from '@vue-storefront/core/lib/module'`

And add:

```js
...
import catalogCategoryExtendedModule from './layered-navigation/store'

const catalogCategoryExtend = {
  key: 'catalog',
  store: { modules: [{ key: 'category', module: catalogCategoryExtendedModule }] }
} 
extendModule(catalogCategoryExtend)
```

# Integration to theme
Open `src/themes/default/pages/Category.vue`

```js
<template>
<active-filters :filters="filters.available" />

<sidebar :filters="filters.available" />

</template>

<script>
...
import Vue from 'vue'
import { buildFilterProductsQueryByFilterArray } from 'src/modules/layered-navigation/helpers'
import Sidebar from 'src/modules/layered-navigation/components/Sidebar'
import ActiveFilters from 'src/modules/layered-navigation/components/ActiveFilters'

export default {
  components: {
    ...,
    ActiveFilters
  },
  preAsyncData ({ store, route }) {
    store.dispatch('category/setSearchOptions', {
      populateAggregations: true,
      store: store,
      route: route,
      current: 0,
      perPage: store.state.config.layeredNavigation.pagePortionSize,
      sort: store.state.config.entities.productList.sort,
      filters: store.state.config.products.defaultFilters,
      includeFields: store.state.config.entities.optimize && Vue.prototype.$isServer ? store.state.config.entities.productList.includeFields : null,
      excludeFields: store.state.config.entities.optimize && Vue.prototype.$isServer ? store.state.config.entities.productList.excludeFields : null,
      append: false
    })
  },
  methods: {
    onFilterChanged (filterOption) {
      this.pagination.current = 0
      let filterData = []
      let filter = filterOption.attribute_code
      let OptionId = filterOption.id

      filterData = Object.assign([], this.filters.chosen[filter])

      if (filterData.filter(option => option.id === OptionId).length === 0) {
        filterData.push(filterOption)
      } else {
        let index = filterData.map((option) => option.id).indexOf(OptionId)
        if (index > -1) {
          filterData.splice(index, 1)
        }
      }
      this.filters.chosen[filter] = filterData
      let filterQr = buildFilterProductsQueryByFilterArray(this.category, this.filters.chosen)

      const fsC = Object.assign({}, this.filters.chosen) // create a copy because it will be used asynchronously (take a look below)
      this.$store.state.category.current_product_query = Object.assign(this.$store.state.category.current_product_query, {
        populateAggregations: false,
        searchProductQuery: filterQr,
        current: this.pagination.current,
        perPage: this.$store.state.config.layeredNavigation.pagePortionSize,
        configuration: fsC,
        append: false
      })
      this.$store.dispatch('category/products', this.$store.state.category.current_product_query).then((res) => {
      }) // because already aggregated
    }
  }
  ...
}
</script>
```

# Passive listeners warning
Remove `import '@vue-storefront/core/lib/passive-listeners'` from `src/themes/default/index.js` 

# License
This module is completely free and released under the MIT License.
