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
        :selected-filters="getCurrentFilters"
        @changeFilter="changeFilter"
      />
    </div>
  </div>
</template>

<script>
import ProductFilter from 'src/modules/vsf-layered-navigation/components/ProductFilter'
import pickBy from 'lodash-es/pickBy'

export default {
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
    hasActiveFilters () {
      return this.$store.getters['category-next/hasActiveFilters']
    },
    getCurrentFilters () {
      return this.$store.getters['category-next/getCurrentFilters']
    },
    availableFilters () {
      return pickBy(this.filters, (filter, filterType) => { return (filter.length && !this.$store.getters['category-next/getSystemFilterNames'].includes(filterType)) })
    },
    filterOptionDisplayLimit () {
      return this.$store.state.config.layeredNavigation.filterOptionsDisplayLimit
    }
  },
  methods: {
    resetAllFilters () {
      this.$store.dispatch('category-next/resetSearchFilters')
    },
    changeFilter (variant) {
      this.$emit('changeFilter', variant)
    },
    sortById (filters) {
      return [...filters].sort((a, b) => { return a.id - b.id })
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

  &__inline-selecors {
    display: flex;
  }
}
</style>
