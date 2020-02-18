# Layered Navigation Module
Advanced layered navigation module for filtering the catalog in **VSF 1.11.1**

# Better and more complete then before
We created this module last year to make searching the catalog a better experience.

After winning [the Market Place challenge](https://medium.com/the-vue-storefront-journal/winners-of-the-vue-storefront-marketplace-challenge-fa04025c9a34 "the Market Place challenge") last april we kept on developing new features and fix a few bugs we came across. Thank you for creating issues in this repository and adressing bugs or request for new features.

These are the improvements we added for this version.

* Price slider compatible with VSF v1.11.1
* Active filters compatible with VSF v1.11.1
* Filter options list limit with toggle compatible with VSF v1.11.1
* Added every feature of the module, except the productsleftcounter, to be compatible with VSF v1.11.1 - productsleftcounter is left out of this scope because the search is now OR and not longer AND (as a result, the product list can actually become larger if you filter further on options)

# Installation
Follow these steps to install this module.

In your project's `src/modules` folder run:

```shell  
git clone git@github.com:Lakefields/vsf-layered-navigation.git
```

After that add the following config properties to your `config/local.json` file:

```
"layeredNavigation": {
  "filterOptionsDisplayLimit": 8,
  "filterOptionElHeight": 30,
  "priceSliderAttribute": "priceInclTax",
  "priceSliderOptions": {
    "clickable": false,
    "height": 2,
      "bg-style": {
        "backgroundColor": "#f2f2f2"
      },
      "tooltip-dir": ["bottom", "bottom"],
      "formatter": "€ {value}",
      "process-style": {
        "backgroundColor": "#4dba87",
        "fontWeight": 700
      },
      "tooltip-style": {
        "backgroundColor": "#4dba87",
        "color": "#ffffff",
        "border-color": "#4dba87",
        "padding": "7px 10px"
      }
  }
}
```

Run `yarn` to install the 'vue-slider-component' for the priceslider.

Make sure to add your desired defaultFilters in your local config \
**For default theme this is**

```
...
"products": {
  "defaultFilters": ["color", "size", "price", "erin_recommends"],
}
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
}
```

# Module registration - extend catalog core module
Open `src/modules/client.ts`

And add:

```js
...
import { LayeredNavigationModule } from './vsf-layered-navigation'
```

And make sure to also register the module in registerClientModules

```js
...
registerModule(LayeredNavigationModule)
```

# Integration to theme
Open `src/themes/default/pages/Category.vue`

Set the path of the Sidebar component to the one in the module folder and add the ActiveFilters component:

```js
import ActiveFilters from 'src/modules/vsf-layered-navigation/components/ActiveFilters.vue'
import Sidebar from 'src/modules/vsf-layered-navigation/components/Sidebar'
```

Also add the active filter components to your page components object:

```js
...
components: {
  ...
  ActiveFilters
}
```

# Passive listeners warning
Remove `import '@vue-storefront/core/lib/passive-listeners'` from `src/themes/default/index.js`

# Support
This module is tested on Vue Storefront 1.11.1.\
If you need any assistance or want to do feature requests you can turn to these channels:

**NB**: We are busy with support for Vue Storefront 1.9 which was released yesterday

* Create issue on this Github repository
* Add comment on the Vue Storefront Forum - Layered Navigation Module thread: https://forum.vuestorefront.io/t/layered-navigation-module-with-priceslider-component/197
* Join the [Vue Storefront Slack community](https://vuestorefront.slack.com) via [invitation link](https://join.slack.com/t/vuestorefront/shared_invite/enQtOTUwNjQyNjY5MDI0LWFmYzE4NTYxNDBhZDRlMjM5MDUzY2RiMjU0YTRjYWQ3YzdkY2YzZjZhZDZmMDUwMWQyOWRmZjQ3NDgwZGQ3NTk)

# License
This module is completely free and released under the MIT License.
