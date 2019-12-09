<template>
  <div class="sidebar">
    <h4 class="sidebar__header relative mt35 mb20 flex">
      <span> {{ $t('Filter') }} </span>
      <span
        class="weight-400 sidebar__header__clear pointer sans-serif flex lh25"
        @click="resetAllFilters"
        v-show="hasActiveFilters"
      >
        <i class="material-icons cl-accent mr5">
          cancel
        </i>
        {{ $t('Clear filters') }}
      </span>
    </h4>
    <div
      v-for="(filter, filterIndex) in availableFilters"
      :key="filterIndex"
    >
      <product-filter
        :filter-index="filterIndex"
        :filter="filter"
        :limit="filterOptionDisplayLimit"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { buildFilterProductsQueryByFilterArray } from 'src/modules/vsf-layered-navigation/helpers/productsQueryByFilter'
import pickBy from 'lodash-es/pickBy'
import map from 'lodash-es/map'
import ProductFilter from './ProductFilter'

export default {
  name: 'CategorySidebar',
  components: {
    ProductFilter
  },
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectorFilterTypes: ['select', 'multiselect'],
      filterExpand: false
    }
  },
  mounted () {
    this.$bus.$emit('product-list-updated')
    this.resetAllFilters()
  },
  computed: {
    ...mapGetters('category', ['getCurrentCategory', 'getActiveCategoryFilters', 'getCurrentCategoryProductQuery']),
    category () {
      return this.getCurrentCategory
    },
    availableFilters () {
      return pickBy(this.filters, (filter) => { return (filter.options.length) })
    },
    currentProductList () {
      return this.$store.getters['product/list']
    },
    activeFilters () {
      return this.getActiveCategoryFilters
    },
    filterOptionDisplayLimit () {
      return this.$store.state.config.layeredNavigation.filterOptionsDisplayLimit
    },
    hasActiveFilters () {
      return Object.keys(this.activeFilters).length !== 0
    },
    activeFiltersCount () {
      return pickBy(this.activeFilters, (activeFilter) => { return (activeFilter.length) })
    }
  },
  methods: {
    sortById (filters) {
      return [...filters].sort((a, b) => { return a.id - b.id })
    },
    resetAllFilters () {
      if (this.hasActiveFilters) {
        this.$bus.$emit('filter-reset')
        this.$store.dispatch('category/resetFilters')
        this.$store.dispatch('category/searchProductQuery', {})
        this.$store.dispatch('category/mergeSearchOptions', {
          searchProductQuery: buildFilterProductsQueryByFilterArray(this.category, this.activeFilters)
        })
        this.$store.dispatch('category/products', this.getCurrentCategoryProductQuery).then((res) => {
          this.$bus.$emit('product-list-updated')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  &__header {
    justify-content: space-between;
    min-height: 47px;
    flex-wrap: wrap;
    &__clear {
      font-size: .8em;
      min-width: 102px;
      @media only screen and (min-width: 768px) and (max-width: 770px) {
        margin-top: 20px;
      }
    }
  }
}
</style>
