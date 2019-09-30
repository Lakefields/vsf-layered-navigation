# Layered Navigation Module
Multiselect filters in Vue Storefront with Price Slider and active filters

![vsf-layered-navigation-demo](https://user-images.githubusercontent.com/26965893/56032629-ee4ff700-5d22-11e9-9795-8b813f3dab55.png)
Image shown above is a demo with the catalog of https://demo.vuestorefront.io/ this module really comes in to play when you integrate it to your custom theme with many more filters for the productlist

# Purpose
We created this module to make searching the catalog a better experience, there are a lot more features to come and we'll add these features to this module when we finished development on them.\
Are you missing features you need, please feel free to contact us via https://www.getnoticed.nl/

# Installation
Follow these steps to install this module.

1. Clone this git repository from within your vue-storefront root folder
1. **Run yarn to install vue slider component** for the price silder filter type
1. Add the config properties

```shell
git clone git@github.com:GetNoticedNL/vsf-layered-navigation.git src/modules/layered-navigation
```

```
"layeredNavigation": {
  "enableProductsLeftCounter": true,
  "pagePortionSize": 200
},
```

Make sure to add your desired defaultFilters in your local config \
**For default theme this is**

```
...
"products": {
  "defaultFilters": ["color", "size", "price", "erin_recommends"],
},
```

Also add these attribute you set in `products.defaultFilters` to `entities.productList.includeFields` and `entities.productListWithChildren.includeFields`

```
...
"entities": {
  ...
  "productList": {
    ...
    "includeFields": { ..., "color", "size", "price", "erin_recommends" }
  },
  "productListWithChildren": {
    ...
    "includeFields": { ..., "color", "size", "price", "erin_recommends" }
  }    
},
```

# Module registration - extend catalog core module
Open `src/modules/index.ts`

**Start with** uncommenting `import { extendModule } from '@vue-storefront/core/lib/module'`

And add:

```js
...
import { layeredNavigationModule } from './layered-navigation'
extendModule(layeredNavigationModule)
```

# Integration to theme
Open `src/themes/default/pages/Category.vue`

And overwrite or add the missing parts from `theme-implementation/pages/Category.vue` in this repository, we've added an example of a theme implementation for the current default theme.
Don't hesitate to contact us to help you with implementing this module in your theme.

The important parts you need to have in your themes `pages/Category.vue` are:
```js
import { buildFilterProductsQueryByFilterArray } from 'src/modules/layered-navigation/helpers/productsQueryByFilter'
import Sidebar from 'src/modules/layered-navigation/components/Sidebar'
import ActiveFilters from 'src/modules/layered-navigation/components/ActiveFilters'
```

Add `ActiveFilters` components:

```js
...
components: {
  ...
  ActiveFilters
}
```

For showing the active filters please add the component to your markup:
```vue
<active-filters :filters="filters.available" />
```

Add the `pagePortionSize` config property from this module to the preSyncData

```js
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
}
```

Make sure to add the onFilterChanged and onSortOrderChanged to your methods, the helper `buildFilterProductsQueryByFilterArray` is used in these methods. This helper takes care to build the query with multiple filteroptions.

```js
...
methods: {
  ...
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

    const filtersConfig = Object.assign({}, this.filters.chosen) // create a copy because it will be used asynchronously (take a look below)
    this.mergeSearchOptions({
      populateAggregations: false,
      searchProductQuery: filterQr,
      current: this.pagination.current,
      perPage: this.$store.state.config.layeredNavigation.pagePortionSize,
      configuration: filtersConfig,
      append: false,
      includeFields: null,
      excludeFields: null
    })
    this.$store.dispatch('category/products', this.getCurrentCategoryProductQuery).then((res) => {
    }) // because already aggregated
  },
  onSortOrderChanged (param) {
    this.pagination.current = 0
    if (param.attribute) {
      const filtersConfig = Object.assign({}, this.filters.chosen) // create a copy because it will be used asynchronously (take a look below)
      let filterQr = buildFilterProductsQueryByFilterArray(this.category, this.filters.chosen)
      this.mergeSearchOptions({
        sort: param.attribute,
        searchProductQuery: filterQr,
        current: this.pagination.current,
        perPage: this.$store.state.config.layeredNavigation.pagePortionSize,
        configuration: filtersConfig,
        append: false,
        includeFields: null,
        excludeFields: null
      })
      this.$store.dispatch('category/products', this.getCurrentCategoryProductQuery).then((res) => {
      })
    } else {
      this.notify()
    }
  },
  pullMoreProducts () {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return
    let current = this.getCurrentCategoryProductQuery.current + this.getCurrentCategoryProductQuery.perPage
    this.mergeSearchOptions({
      append: true,
      route: this.$route,
      store: this.$store,
      current
    })
    this.pagination.current = this.getCurrentCategoryProductQuery.current
    this.pagination.perPage = this.getCurrentCategoryProductQuery.perPage
    if (this.getCurrentCategoryProductQuery.current <= this.productsTotal) {
      this.mergeSearchOptions({
        searchProductQuery: buildFilterProductsQueryByFilterArray(this.category, this.filters.chosen)
      })
      return this.$store.dispatch('category/products', this.getCurrentCategoryProductQuery)
    }
  },
  ...
}
```

# A note about the 'productsLeftCounter'
This is experimental, with the 'productsleftcounter' enabled, the amount of results for a filteroption is added in the filters sidebar. If the filter option should result in an empty product list, the filter option is faded and not clickable.

This can result in a performance hit with large productlists, keep this in mind.

**NB**: Only supports Simple products right now, we are working on a solution to include support for configurable products also. For now, set the config property `enableProductsLeftCounter` to false if you have (a lot of) configurable products in your catalog.

To take full advantage of this layered navigation module, please run the indexing for your catalog including these changes in Mage2Vuestorefront https://github.com/DivanteLtd/mage2vuestorefront/pull/70

# Passive listeners warning
Remove `import '@vue-storefront/core/lib/passive-listeners'` from `src/themes/default/index.js`

# Support
This module is built to enable multiple filter options per attribute in mind.\
Use at your own responsibility in your project. This module is tested on Vue Storefront 1.8.\
Read above about the experimental state of the 'productsleftcounter' option.\
If you need any assistance or want to do feature requests you can turn to these channels:

**NB**: We are busy with support for Vue Storefront 1.9 which was released yesterday

* Create issue on this Github repository
* Add comment on the Vue Storefront Forum - Layered Navigation Module thread: https://forum.vuestorefront.io/t/layered-navigation-module-with-priceslider-component/197
* Join the [Vue Storefront Slack community](https://vuestorefront.slack.com) via [invitation link](https://join.slack.com/t/vuestorefront/shared_invite/enQtMzA4MTM2NTE5NjM2LTI1M2RmOWIyOTk0MzFlMDU3YzJlYzcyYzNiNjUyZWJiMTZjZjc3MjRlYmE5ZWQ1YWRhNTQyM2ZjN2ZkMzZlNTg)

# License
This module is completely free and released under the MIT License.
