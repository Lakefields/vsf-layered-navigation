<template>
  <div class="active-filters">
    <div v-for="(filter, filterIndex) in availableFilters"
         :key="filterIndex">
      <active-filter
        context="category"
        :attribute_code="filter.attribute_code"
        :code="filterIndex"
        v-for="(option, index) in filter.options"
        :key="index"
        :id="option.id"
        :label="option.label"
      />
    </div>
  </div>
</template>

<script>
import ActiveFilter from './ActiveFilter'
import pickBy from 'lodash-es/pickBy'

export default {
  name: 'ActiveFilters',
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  computed: {
    availableFilters () {
      return pickBy(this.filters, (filter) => { return (filter.options.length) })
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
  margin: 0;
  padding: 0;
  > div {
    float: left;
    margin-bottom: 10px;
  }
}

</style>
