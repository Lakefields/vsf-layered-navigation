import Vue from 'vue'
import rootStore from '@vue-storefront/core/store'
import omit from 'lodash-es/omit'
import toString from 'lodash-es/toString'
import isArray from 'lodash-es/isArray'
import i18n from '@vue-storefront/i18n'
import { Logger } from '@vue-storefront/core/lib/logger'
import { populateProductConfigurationAsync, setConfigurableProductOptionsAsync } from '@vue-storefront/core/modules/catalog/helpers'

function _internalMapOptions (productOption) {
  const optionsMapped = []
  for (let option of productOption.extension_attributes.configurable_item_options) {
    optionsMapped.push({
      label: option.label,
      value: option.value
    })
  }
  productOption.extension_attributes.configurable_item_options = productOption.extension_attributes.configurable_item_options.map((op) => {
    return omit(op, ['label', 'value'])
  })
  return optionsMapped
}

export function findConfigurableChildAsync ({ product, configuration = null, selectDefaultChildren = false, availabilityCheck = true }) {
  let selectedVariant = product.configurable_children.find((configurableChild) => {
    if (availabilityCheck) {
      if (configurableChild.stock && !rootStore.state.config.products.listOutOfStockProducts) {
        if (!configurableChild.stock.is_in_stock) {
          return false
        }
      }
    }
    if (configurableChild.status >= 2/** disabled product */) {
      return false
    }
    if (selectDefaultChildren) {
      return true // return first
    }
    if (configuration.sku) {
      return configurableChild.sku === configuration.sku // by sku or first one
    } else {
      return Object.keys(omit(configuration, ['price'])).every((configProperty) => {
        if (isArray(configuration[configProperty])) {
          return (configuration[configProperty].filter(option => toString(option.id) === toString(configurableChild[configProperty])).length !== 0)
        } else {
          if (!configuration[configProperty] || typeof configuration[configProperty].id === 'undefined') return true // skip empty
          return toString(configurableChild[configProperty]) === toString(configuration[configProperty].id)
        }
      })
    }
  })
  return selectedVariant
}

export function configureProductAsync (context, { product, configuration, selectDefaultVariant = true, fallbackToDefaultWhenNoAvailable = true, setProductErorrs = false }) {
  // use current product if product wasn't passed
  if (product === null) product = context.getters.productCurrent
  const hasConfigurableChildren = (product.configurable_children && product.configurable_children.length > 0)

  if (hasConfigurableChildren) {
    // handle custom_attributes for easier comparing in the future
    product.configurable_children.forEach((child) => {
      let customAttributesAsObject = {}
      if (child.custom_attributes) {
        child.custom_attributes.forEach((attr) => {
          customAttributesAsObject[attr.attribute_code] = attr.value
        })
        // add values from custom_attributes in a different form
        Object.assign(child, customAttributesAsObject)
      }
    })
    // find selected variant
    let desiredProductFound = false
    let selectedVariant = findConfigurableChildAsync({ product, configuration, availabilityCheck: true })
    if (!selectedVariant) {
      if (fallbackToDefaultWhenNoAvailable) {
        selectedVariant = findConfigurableChildAsync({ product, selectDefaultChildren: true, availabilityCheck: true }) // return first available child
        desiredProductFound = false
      } else {
        desiredProductFound = false
      }
    } else {
      desiredProductFound = true
    }

    if (typeof navigator !== 'undefined') {
      if (selectedVariant && !navigator.onLine && context.state.offlineImage) { // this is fix for not preloaded images for offline
        selectedVariant.image = context.state.offlineImage
        Logger.debug('Image offline fallback to ', context.state.offlineImage)()
      }
    }
    if (selectedVariant) {
      if (!desiredProductFound) { // update the configuration
        populateProductConfigurationAsync(context, { product: product, selectedVariant: selectedVariant })
        configuration = context.state.current_configuration
      }
      if (setProductErorrs) {
        product.errors = {} // clear the product errors
      }
      product.is_configured = true

      if (rootStore.state.config.cart.setConfigurableProductOptions && !selectDefaultVariant && !(Object.keys(configuration).length === 1 && configuration.sku)) {
        // the condition above: if selectDefaultVariant - then "setCurrent" is seeting the configurable options; if configuration = { sku: '' } -> this is a special case when not configuring the product but just searching by sku
        const productOption = setConfigurableProductOptionsAsync(context, { product: product, configuration: configuration }) // set the custom options
        if (productOption) {
          selectedVariant.product_option = productOption
          selectedVariant.options = _internalMapOptions(productOption)
        }
      }/* else {
        Logger.debug('Skipping configurable options setup', configuration)()
      } */
      const fieldsToOmit = ['name']
      if (selectedVariant.image === '') fieldsToOmit.push('image')
      selectedVariant = omit(selectedVariant, fieldsToOmit) // We need to send the parent SKU to the Magento cart sync but use the child SKU internally in this case
      // use chosen variant
      if (selectDefaultVariant) {
        context.dispatch('setCurrent', selectedVariant)
      }
      Vue.prototype.$bus.$emit('product-after-configure', { product: product, configuration: configuration, selectedVariant: selectedVariant })
    }
    if (!selectedVariant && setProductErorrs) { // can not find variant anyway, even the default one
      product.errors.variants = i18n.t('No available product variants')
      if (selectDefaultVariant) {
        context.dispatch('setCurrent', product) // without the configuration
      }
    }
    return selectedVariant
  } else {
    if (fallbackToDefaultWhenNoAvailable) {
      return product
    } else {
      return null
    }
  }
}
