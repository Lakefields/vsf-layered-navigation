import Vue from 'vue'
import * as types from '@vue-storefront/core/modules/catalog/store/product/mutation-types'
import { calculateTaxes } from '@vue-storefront/core/modules/catalog/helpers'
import { configureProductAsync } from '../../helpers/configurableChilds'
import { entityKeyName } from '@vue-storefront/core/store/lib/entities'
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import rootStore from '@vue-storefront/core/store'
import { Logger } from '@vue-storefront/core/lib/logger';

const catalogProductExtendedModule = {
  actions: {
    
    /**
     * Search ElasticSearch catalog of products using simple text query
     * Use bodybuilder to build the query, aggregations etc: http://bodybuilder.js.org/
     * @param {Object} query is the object of searchQuery class
     * @param {Int} start start index
     * @param {Int} size page size
     * @return {Promise}
     */
    list (context, { query, start = 0, size = 50, entityType = 'product', sort = '', cacheByKey = 'sku', prefetchGroupProducts = !Vue.prototype.$isServer, updateState = false, meta = {}, excludeFields = null, includeFields = null, configuration = null, append = false, populateRequestCacheTags = true }) {
      let isCacheable = (includeFields === null && excludeFields === null)
      if (isCacheable) {
        Logger.debug('Entity cache is enabled for productList')()
      } else {
        Logger.debug('Entity cache is disabled for productList')()
      }

      if (rootStore.state.config.entities.optimize) {
        if (excludeFields === null) { // if not set explicitly we do optimize the amount of data by using some default field list; this is cacheable
          excludeFields = rootStore.state.config.entities.product.excludeFields
        }
        if (includeFields === null) { // if not set explicitly we do optimize the amount of data by using some default field list; this is cacheable
          includeFields = rootStore.state.config.entities.product.includeFields
        }
      }
      return quickSearchByQuery({ query, start, size, entityType, sort, excludeFields, includeFields }).then((resp) => {
        if (resp.items && resp.items.length) { // preconfigure products; eg: after filters
          for (let product of resp.items) {
            if (populateRequestCacheTags && Vue.prototype.$ssrRequestContext) {
              Vue.prototype.$ssrRequestContext.output.cacheTags.add(`P${product.id}`)
            }
            product.errors = {} // this is an object to store validation result for custom options and others
            product.info = {}
            if (!product.parentSku) {
              product.parentSku = product.sku
            }
            if (rootStore.state.config.products.setFirstVarianAsDefaultInURL && product.hasOwnProperty('configurable_children') && product.configurable_children.length > 0) {
              product.sku = product.configurable_children[0].sku
            }
            if (configuration) {
              let selectedVariant = configureProductAsync(context, { product: product, configuration: configuration, selectDefaultVariant: false })
              Object.assign(product, selectedVariant)
            }
            if (product.url_path) {
              rootStore.dispatch('url/registerMapping', {
                url: product.url_path,
                routeData: {
                  params: {
                    'parentSku': product.parentSku,
                    'slug': product.slug
                  },
                  'name': product.type_id + '-product'
                }
              }, { root: true })
            }
          }
        }
        return calculateTaxes(resp.items, context).then((updatedProducts) => {
          // handle cache
          const cache = Vue.prototype.$db.elasticCacheCollection
          for (let prod of resp.items) { // we store each product separately in cache to have offline access to products/single method
            if (prod.configurable_children) {
              for (let configurableChild of prod.configurable_children) {
                if (configurableChild.custom_attributes) {
                  for (let opt of configurableChild.custom_attributes) {
                    configurableChild[opt.attribute_code] = opt.value
                  }
                }
              }
            }
            if (!prod[cacheByKey]) {
              cacheByKey = 'id'
            }
            const cacheKey = entityKeyName(cacheByKey, prod[cacheByKey])
            if (isCacheable) { // store cache only for full loads
              cache.setItem(cacheKey, prod)
                .catch((err) => {
                  Logger.error('Cannot store cache for ' + cacheKey, err)()
                })
            }
            if ((prod.type_id === 'grouped' || prod.type_id === 'bundle') && prefetchGroupProducts && !Vue.prototype.$isServer) {
              context.dispatch('setupAssociated', { product: prod })
            }
          }
          // commit update products list mutation
          if (updateState) {
            context.commit(types.CATALOG_UPD_PRODUCTS, { products: resp, append: append })
          }
          Vue.prototype.$bus.$emit('product-after-list', { query: query, start: start, size: size, sort: sort, entityType: entityType, meta: meta, result: resp })
          return resp
        })
      })
    }

  }
}

export default catalogProductExtendedModule