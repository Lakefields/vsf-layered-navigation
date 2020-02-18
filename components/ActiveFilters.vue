<template>
  <div class="active-filters">
    <div
      v-for="(attributes, filter) in getCurrentFilters"
      :key="filter"
    >
      <span class="block pb10 weight-700">{{ $t(filter + '_filter') }}</span>
      <active-filter :attributes="attributes" @changeFilter="changeFilter" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ActiveFilter from './ActiveFilter'

export default {
  name: 'ActiveFilters',
  computed: {
    ...mapGetters({
      getCurrentFilters: 'category-next/getCurrentFilters'
    })
  },
  components: {
    ActiveFilter
  },
  methods: {
    async changeFilter (filterVariant) {
      const variant = (filterVariant.attribute_code !== 'price') ? filterVariant : {...filterVariant, type: 'price', remove: true}
      this.$store.dispatch('category-next/switchSearchFilters', [variant])
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

.active-filters {
  float: left;
  width: 100%;
  > div {
    float: left;
    margin-bottom: 10px;
  }
}

</style>
