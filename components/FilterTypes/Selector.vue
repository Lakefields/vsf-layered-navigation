<template>
  <div
    :class="{'filter-label': true}"
  >
    <span
      :class="{'active': isActive, 'filter-label': true}"
      @click="$emit('change', variant)"
      :aria-label="$t('Select ' + variant.label)"
    >
      {{ variant.label }}
    </span>
  </div>
</template>

<script>
import filterMixin from 'src/modules/vsf-layered-navigation/mixins/filterMixin'

export default {
  mixins: [filterMixin]
}
</script>

<style lang="scss">
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-primary: color(primary);
  $color-tertiary: color(tertiary);
  $color-secondary: color(secondary);
  $color-white: color(white);
  $color-dim-gray: color(dim-gray);
  $color-persian-red: color(persian-red);
  $bg-secondary: color(secondary, $colors-background);
  $border-secondary: color(secondary, $colors-border);

  .filter-label {
    line-height: 30px;
    font-size: 16px;
    opacity: 1;
    transition: opacity .2s;
    &.no-products-left {
      opacity: .3;
      cursor: not-allowed;
      span.filter-label {
        cursor: not-allowed;
      }
    }
    span.filter-label {
      cursor: pointer;
      position: relative;
      &:before {
        content: '';
        position: relative;
        top: 1px;
        margin-right: 10px;
        display: inline-block;
        vertical-align: text-top;
        width: 14px;
        height: 14px;
        background: $color-white;
        border: 1px solid $border-secondary;
      }
      &:hover {
        &:before {
          background: $bg-secondary;
        }
      }
      &.active {
        &::before {
          background: $color-primary;
          border-color: $color-primary;
        }
        &:after {
          content: '';
          position: absolute;
          left: 3px;
          top: 8px;
          background: white;
          width: 2px;
          height: 2px;
          box-shadow:
            2px 0 0 white,
            4px 0 0 white,
            4px -2px 0 white,
            4px -4px 0 white,
            4px -6px 0 white,
            4px -8px 0 white;
          transform: rotate(45deg);
        }
      }

    }
    span.product-counter {
      float: right;
      opacity: .2;
    }
  }
</style>
