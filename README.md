# Layered Navigation Module
Multiselect filters in Vue Storefront with Price Slider

![vsf-layered-navigation-priceSlider](https://user-images.githubusercontent.com/26965893/55967045-e38d5780-5c79-11e9-83f1-c983e90ec46a.png)

![vsf-layered-navigation-demo](https://user-images.githubusercontent.com/26965893/55967046-e425ee00-5c79-11e9-9113-d4f6b0fce609.png)

# Support
This module is built to enable multiple filter options per attribute in mind.\
Use at your own responsibility in your project. This module is tested on Vue Storefront 1.9.\
For any support installing, using or request features for this module, please contact us at http://www.getnoticed.nl/contact

# Purpose
We created this module to make searching the catalog a better experience, there are a lot more features to come and we'll add these features to this module when we finished development on them.\
Are you missing features you need, please feel free to contact us or open a pull request of course.

# Installation
Follow these steps to install this module.\

1. Clone this git repository and add config properties to your local.json config file.
1. **Run yarn to install vue slider component** for the price silder filter type. (if you have a VSF instance running in development mode, stop it first to run `yarn`)
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

# License
This module is completely free and released under the MIT License.
