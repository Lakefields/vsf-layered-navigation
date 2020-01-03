<template>
  <div id="category">
    <header class="bg-cl-secondary py35 pl20">
      <div class="container">
        <breadcrumbs :routes="breadcrumbs.routes" :active-route="category.name" />
        <div class="row middle-sm">
          <h1 class="col-sm-8 category-title mb10">
            {{ category.name }}
          </h1>
          <div class="sorting col-sm-2 align-right mt50">
            <label class="mr10">{{ $t('Columns') }}:</label>
            <columns @change-column="columnChange" />
          </div>
          <div class="sorting col-sm-2 align-right mt50">
            <sort-by :has-label="true" />
          </div>
          <active-filters :filters="filters.available" />
        </div>
      </div>
      <div class="container">
        <div class="row m0">
          <button
            class="col-xs-5 mt25 mr15 p15 mobile-filters-button bg-cl-th-accent brdr-none cl-white h5 sans-serif fs-medium-small"
            @click="openFilters"
          >
            {{ $t('Filters') }}
          </button>
          <div class="mobile-sorting col-xs-6 mt25">
            <sort-by />
          </div>
        </div>
      </div>
    </header>
    <div class="container pb60">
      <div class="row m0 pt15">
        <div class="col-md-3 start-xs category-filters">
          <sidebar :filters="filters.available" />
        </div>
        <div class="col-md-3 start-xs mobile-filters" v-show="mobileFilters">
          <div class="close-container absolute w-100">
            <i class="material-icons p15 close cl-accent" @click="closeFilters">close</i>
          </div>
          <sidebar class="mobile-filters-body" :filters="filters.available" />
          <div class="relative pb20 pt15">
            <div class="brdr-top-1 brdr-cl-primary absolute divider w-100" />
          </div>
          <button-full
            class="mb20 btn__filter"
            @click.native="closeFilters"
          >
            {{ $t('Filter') }}
          </button-full>
        </div>
        <div class="col-md-9 px10 border-box products-list">
          <p class="col-xs-12 end-md m0 pb20 cl-secondary">
            {{ productsTotal }} {{ $t('items') }}
          </p>
          <div v-if="isCategoryEmpty" class="hidden-xs">
            <h4 data-testid="noProductsInfo">
              {{ $t('No products found!') }}
            </h4>
            <p>{{ $t('Please change Your search criteria and try again. If still not finding anything relevant, please visit the Home page and try out some of our bestsellers!') }}</p>
          </div>
          <product-listing :columns="defaultColumn" :products="products" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Category from '@vue-storefront/core/pages/Category'
import Vue from 'vue'
import config from 'config'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import { buildFilterProductsQueryByFilterArray } from 'src/modules/vsf-layered-navigation/helpers/productsQueryByFilter'
import Sidebar from 'src/modules/vsf-layered-navigation/components/Sidebar'
import ActiveFilters from 'src/modules/vsf-layered-navigation/components/ActiveFilters'

// import Sidebar from '../components/core/blocks/Category/Sidebar.vue'
import ProductListing from '../components/core/ProductListing.vue'
import Breadcrumbs from '../components/core/Breadcrumbs.vue'
import SortBy from '../components/core/SortBy.vue'
import Columns from '../components/core/Columns.vue'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
// import builder from 'bodybuilder'

export default {
  components: {
    ButtonFull,
    ProductListing,
    Breadcrumbs,
    Sidebar,
    ActiveFilters,
    SortBy,
    Columns
  },
  data () {
    return {
      mobileFilters: false,
      defaultColumn: 3
    }
  },
  preAsyncData ({ store, route }) {
    Logger.log('preAsyncData query setup')()
    const currentProductQuery = store.getters['category/getCurrentCategoryProductQuery']
    const sort = currentProductQuery && currentProductQuery.sort ? currentProductQuery.sort : config.entities.productList.sort
    store.dispatch('category/setSearchOptions', {
      populateAggregations: true,
      store: store,
      route: route,
      current: 0,
      perPage: store.state.config.layeredNavigation.pagePortionSize,
      sort,
      filters: config.products.defaultFilters,
      includeFields: config.entities.optimize && isServer ? config.entities.productList.includeFields : null,
      excludeFields: config.entities.optimize && isServer ? config.entities.productList.excludeFields : null,
      append: false
    })
  },
  methods: {
    openFilters () {
      this.mobileFilters = true
    },
    closeFilters () {
      this.mobileFilters = false
    },
    notify () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t('Please select the field which You like to sort by'),
        action1: { label: this.$t('OK') }
      })
    },
    columnChange (column) {
      this.defaultColumn = column
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
    onFilterChanged (filterOption) {
      this.pagination.current = 0
      let filterData = []
      let filter = filterOption.attribute_code
      let OptionId = filterOption.id
      if (filter === 'price') {
        if (filterOption.hasOwnProperty('remove') && filterOption.remove) {
          this.$bus.$emit('reset-price-slider')
        } else {
          filterData.push(filterOption)
        }
      } else {
        filterData = Object.assign([], this.filters.chosen[filter])
        if (filterData.filter(option => option.id === OptionId).length === 0) {
          filterData.push(filterOption)
        } else {
          let index = filterData.map((option) => option.id).indexOf(OptionId)
          if (index > -1) {
            filterData.splice(index, 1)
          }
        }
      }
      if (filterData.length === 0) {
        Vue.delete(this.filters.chosen, filter)
      } else {
        Vue.set(this.filters.chosen, filter, filterData)
      }
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
        this.$bus.$emit('product-list-updated')
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
          perPage: this.pagination.perPage,
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
    }
  },
  mixins: [Category]
}
</script>

<style lang="scss" scoped>
  .btn {
    &__filter {
      min-width: 100px;
    }
  }
  .divider {
    width: calc(100vw - 8px);
    bottom: 20px;
    left: -36px;
  }
  .category-filters {
    width: 242px;
  }

  .mobile-filters {
    display: none;
    overflow: auto;
  }

  .mobile-filters-button {
    display: none;
  }

  .mobile-sorting {
    display: none;
  }

  .category-title {
    line-height: 65px;
  }

  .sorting {
    label {
      margin-right: 10px;
    }
  }

  @media (max-width: 64em) {
    .products-list {
      max-width: 530px;
    }
  }

  @media (max-width: 770px) {
    .category-title {
      margin: 0;
      font-size: 36px;
      line-height: 40px;
    }

    .products-list {
      width: 100%;
      max-width: none;
    }

    .mobile-filters {
      display: block;
    }

    .mobile-filters-button {
      display: block;
      height: 45px;
    }

    .sorting {
      display: none;
    }

    .mobile-sorting {
      display: block;
    }

    .category-filters {
      display: none;
    }

    .product-listing {
      justify-content: center;;
    }

    .mobile-filters {
      position: fixed;
      background-color: #F2F2F2;
      z-index: 5;
      padding: 0 40px;
      left: 0;
      width: 100vw;
      height: 100vh;
      top: 0;
      box-sizing: border-box;
    }

    .mobile-filters-body {
      padding-top: 50px;
    }
  }

  .close-container {
    left: 0;
  }

  .close {
    margin-left: auto;
  }
</style>
<style lang="scss">
.product-image {
  max-height: unset !important;
}
</style>
