<template>
  <div class="sidebar">
    <div class="filters">
      <h4>
        {{ $t('Filter') }}
      </h4>
      <div
        v-for="(filter, filterIndex) in availableFilters"
        :key="filterIndex"
      >
        <product-filter
          :filter-index="filterIndex"
          :filter="filter"
          :limit="10"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { buildFilterProductsQueryByFilterArray } from 'src/modules/layered-navigation/helpers/productsQueryByFilter'
import { mapGetters } from 'vuex'
import pickBy from 'lodash-es/pickBy'
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
  computed: {
    ...mapGetters(
      'category', ['getCurrentCategory', 'getActiveCategoryFilters', 'getCurrentCategoryProductQuery']
    ),
    category () {
      return this.getCurrentCategory
    },
    availableFilters () {
      return pickBy(this.filters, (filter) => { return (filter.options.length) })
    },
    activeFilters () {
      return this.getActiveCategoryFilters
    }
  },
  methods: {
    sortById (filters) {
      return [...filters].sort((a, b) => { return a.id - b.id })
    },
    resetAllFilters () {
      this.$bus.$emit('filter-reset')
      this.$store.dispatch('category/resetFilters')
      this.$store.dispatch('category/searchProductQuery', buildFilterProductsQueryByFilterArray(this.category, this.activeFilters))
      this.$store.dispatch('category/products', {searchProductQuery: this.getCurrentCategoryProductQuery})
    }
  }
}
</script>
