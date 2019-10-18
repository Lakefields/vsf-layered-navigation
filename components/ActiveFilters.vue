<template>
  <div class="active-filters">
    <div
      v-for="(attributes, filter) in activeFilters"
      :key="filter"
    >
      <span class="block pb10 weight-700">{{ $t(filter + '_filter') }}</span>
      <active-filter :attributes="attributes" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ActiveFilter from './ActiveFilter'

export default {
  name: 'ActiveFilters',
  computed: {
    ...mapGetters('category', ['getActiveCategoryFilters']),
    activeFilters () {
      return this.getActiveCategoryFilters
    }
  },
  components: {
    ActiveFilter
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
