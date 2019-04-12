<template>
  <div
    :class="{'active': active}"
    class="bg-cl-primary brdr-1 brdr-cl-primary brdr-square h5 cl-tertiary generic-selector mr10 mb10"
    @click="switchFilter(id, label)"
    :aria-label="$t('Select ' + label)"
  >
    {{ label }}
  </div>
</template>

<script>
import GenericSelector from '@vue-storefront/core/compatibility/components/GenericSelector'
export default {
  computed: {
    chosenFilters () {
      return this.$store.state.category.filters.chosen
    }
  },
  mounted () {
    for (let attributeCode in this.chosenFilters) {
      if (attributeCode === this.code) {
        let chosenFilters = this.chosenFilters[attributeCode]
        if (chosenFilters.filter(option => option.id === this.id).length === 0) {
          console.log('active')
          this.active = false
        } else {
          console.log('inactive')
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
          console.log('active')
          this.active = false
        } else {
          console.log('inactive')
          this.active = true
        }
      }
    }
  },
  mixins: [GenericSelector]
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-active: color(secondary);
  $color-disabled: color(secondary, $colors-border);

  .generic-selector {
    height: 40px;
    line-height: 40px;
    display: inline-block;
    min-width: 50px;
    text-align: center;
    box-sizing: border-box;
    padding-left: 8px;
    padding-right: 8px;

    &:hover,
    &:focus {
      border-width: 2px;
    }

    &.active {
      border-color: $color-active;
      border-width: 2px;
      color: $color-active;
    }

    &:disabled {
      border-color: $color-disabled;
      color: $color-disabled;
      cursor: not-allowed;

      &:hover,
      &:after {
        border-width: 1px;
      }
    }
  }
</style>
