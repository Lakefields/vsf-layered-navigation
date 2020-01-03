# Layered Navigation Module
Advanced layered navigation module for filtering the catalog in **VSF 1.10.5**

## Video demo - see it in action
[![Watch the demo!](https://user-images.githubusercontent.com/26965893/71731022-fe28e180-2e43-11ea-9946-d5189862b9ec.png)](https://www.youtube.com/watch?v=vfcg_dQ8zYk)

# Better and more complete then before
We created this module last year to make searching the catalog a better experience.

After winning [the Market Place challenge](https://medium.com/the-vue-storefront-journal/winners-of-the-vue-storefront-marketplace-challenge-fa04025c9a34 "the Market Place challenge") last april we kept on developing new features and fix a few bugs we came across. Thank you for creating issues in this repository and adressing bugs or request for new features.

These are the improvements we added for this version.

* Price slider only filters on drag, not on click anymore (unexpected behaviour)
* Only set 1 price range, not multiple like before
* Define which price attribute you want to use the price slider for
* Add priceslider display options as config properties (see below for details)
* Fix priceslider reset on route changes
* Hide filteroptions without yield, (no filter options with same result as the current product list total)
* Hide filter options with no results
* Hide entire filter if no filteroption would change the current product list
* Fix bug where a filter would stay in the active filters, altough there were no active filter options
* Now the clear all filters button works for all filers
* Add option to order filter options alphabetically
* Add possibility to show a number op filter options, with a toggle feature to show all filter options - for this to work set the height of the filteroption element and the number for initial display

# Installation
Follow these steps to install this module.

In your project's `src/modules` folder run:

```shell  
git clone git@github.com:GetNoticedNL/vsf-layered-navigation.git
```

After that add the following config properties to your `config/local.json` file:

```
"layeredNavigation": {
    "enableProductsLeftCounter": true,
    "filterOptionsDisplayLimit": 8,
    "filterOptionElHeight": 30,
    "pagePortionSize": 75,
    "sortFilterOptionsAlphabetically": true,
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
  },
```

Run `yarn` to install the 'vue-slider-component' for the priceslider.

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
import { layeredNavigationModule } from './vsf-layered-navigation'
extendModule(layeredNavigationModule)
```

# Integration to theme
Open `src/themes/default/pages/Category.vue`

And overwrite or add the missing parts from `theme-implementation/pages/Category.vue` in this repository, we've added an example of a theme implementation for the current default theme.
Don't hesitate to contact us to help you with implementing this module in your theme.

Especially take notice of the Sidebar component, ActiveFilters component and the methods when you implement it in your own themes Category page.


# A note about the 'productsLeftCounter'
This is experimental, with the 'productsleftcounter' enabled, the amount of results for a filteroption is added in the filters sidebar. If the filter option should result in an empty product list, the filter option is faded and not clickable.

This can result in a performance hit with large productlists, keep this in mind.

**NB**: Only supports Simple products right now, we are working on a solution to include support for configurable products also. For now, set the config property `enableProductsLeftCounter` to false if you have (a lot of) configurable products in your catalog.

To take full advantage of this layered navigation module, please run the indexing for your catalog including these changes in Mage2Vuestorefront https://github.com/DivanteLtd/mage2vuestorefront/pull/70

# Passive listeners warning
Remove `import '@vue-storefront/core/lib/passive-listeners'` from `src/themes/default/index.js`

# Support
This module is built to enable multiple filter options per attribute in mind.\
Use at your own responsibility in your project. This module is tested on Vue Storefront 1.10.5.\
The catalog module is practically rewritten in VSF 1.11, right now we are investigating if we can add features of this module for VSF 1.11.\
Read above about the experimental state of the 'productsleftcounter' option.\
If you need any assistance or want to do feature requests you can turn to these channels:

**NB**: We are busy with support for Vue Storefront 1.9 which was released yesterday

* Create issue on this Github repository
* Add comment on the Vue Storefront Forum - Layered Navigation Module thread: https://forum.vuestorefront.io/t/layered-navigation-module-with-priceslider-component/197
* Join the [Vue Storefront Slack community](https://vuestorefront.slack.com) via [invitation link](https://join.slack.com/t/vuestorefront/shared_invite/enQtMzA4MTM2NTE5NjM2LTI1M2RmOWIyOTk0MzFlMDU3YzJlYzcyYzNiNjUyZWJiMTZjZjc3MjRlYmE5ZWQ1YWRhNTQyM2ZjN2ZkMzZlNTg)

# License
This module is completely free and released under the MIT License.
