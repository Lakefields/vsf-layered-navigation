<template>
  <div
    :class="{'active': active}"
    class="bg-cl-primary brdr-1 brdr-cl-primary brdr-square h5 cl-tertiary generic-selector"
    @click="switchFilter(id, label)"
    :aria-label="$t('Select ' + label)"
  >
    {{ label }}
  </div>
</template>

<script>
import GenericSelector from '@vue-storefront/core/compatibility/components/GenericSelector'
export default {
  mixins: [GenericSelector]
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-active: color(secondary);
  $color-disabled: color(secondary, $colors-border);

  .generic-selector {
    height: 30px;
    line-height: 30px;
    display: inline-block;
    padding-left: 8px;
    padding-right: 8px;
    margin-right: 5px;

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
