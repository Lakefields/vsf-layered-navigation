<template>
  <span
    v-if="active"
    :class="{'active': !active, 'active-filter-label': true}"
    :aria-label="$t('Select ' + label)"
  >
    {{ label }}
    <i
      class="material-icons"
      @click="switchFilter(id, label)">
      close
    </i>
  </span>
</template>

<script>
import GenericSelector from '@vue-storefront/core/compatibility/components/GenericSelector'

export default {
  name: 'ActiveFilter',
  props: {
    label: {
      type: String,
      required: false,
      default: () => false
    },
    id: {
      type: null,
      required: false,
      default: () => false
    },
    code: {
      type: null,
      required: false,
      default: () => false
    },
    context: {
      type: null,
      required: false,
      default: () => false
    }
  },
  data () {
    return {
      active: false,
      productsLeft: true
    }
  },
  computed: {
    chosenFilters () {
      return this.$store.state.category.filters.chosen
    },
    availableFilters () {
      return this.$store.state.category.filters.available
    }
  },
  mounted () {
    for (let attributeCode in this.chosenFilters) {
      if (attributeCode === this.code) {
        let chosenFilters = this.chosenFilters[attributeCode]
        if (chosenFilters.filter(option => option.id === this.id).length === 0) {
          this.active = false
        } else {
          this.active = true
        }
      }
    }
  },
  methods: {
    filterChanged (filterOption) {
      let attributeCode = filterOption.attribute_code
      if (attributeCode === this.code) {
        let chosenFilters = this.chosenFilters[attributeCode]
        if (chosenFilters.filter(option => option.id === this.id).length === 0) {
          this.active = false
        } else {
          this.active = true
        }
      }
    }
  },
  mixins: [GenericSelector]
}
</script>

<style lang="scss">
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-silver: color(silver);
  $color-white: color(white);

  span.active-filter-label {
    height: 30px;
    line-height: 30px;
    color: $color-white;
    display: inline-block;
    background-color: $color-silver;
    margin: 0px 10px 0px 0px;
    padding: 0px 15px;
    i {
      cursor: pointer;
      margin-left: 5px;
      font-size: 16px;
      position: relative;
      top: 3px;
      font-weight: 600;
    }
  }
</style>
