# Layered Navigation Module
Multiselect filters in Vue Storefront with Price Slider and active filters

![vsf-layered-navigation-demo](https://user-images.githubusercontent.com/26965893/56032629-ee4ff700-5d22-11e9-9795-8b813f3dab55.png)

# Purpose
We created this module to make searching the catalog a better experience, there are a lot more features to come and we'll add these features to this module when we finished development on them.\
Are you missing features you need, please feel free to contact us via https://www.getnoticed.nl/ or open a pull request.

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

In your markup please add 
```vue
<active-filters :filters="filters.available" />
```
For showing the active filters

```js
...
components: {
  ...
  ActiveFilters
},
preAsyncData {}
methods: {
  onFilterChanged (filterOption) {},
  onSortOrderChanged (param) {}  
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
Use at your own responsibility in your project. This module is tested on Vue Storefront 1.9.\
Read above about the experimental state of the 'productsleftcounter' option.\
If you need any assistance or want to do feature requests you can turn to these channels:

* Create issue on this Github repository
* Add comment on the Vue Storefront Forum - Layered Navigation Module thread: https://forum.vuestorefront.io/t/layered-navigation-module-with-priceslider-component/197
* Join the [Vue Storefront Slack community](https://vuestorefront.slack.com) via [invitation link](https://join.slack.com/t/vuestorefront/shared_invite/enQtMzA4MTM2NTE5NjM2LTI1M2RmOWIyOTk0MzFlMDU3YzJlYzcyYzNiNjUyZWJiMTZjZjc3MjRlYmE5ZWQ1YWRhNTQyM2ZjN2ZkMzZlNTg)

# License
This module is completely free and released under the MIT License.
