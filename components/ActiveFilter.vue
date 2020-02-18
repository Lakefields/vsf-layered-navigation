<template>
  <div>
    <span
      v-for="(variant, index) in attributes"
      :key="index"
      class="active active-filter-label"
      :aria-label="$t('Select ' + variant.label)"
    >
      {{ getVariantInfo(variant) }}
      <i
        class="material-icons"
        @click="$emit('changeFilter', variant)">
        close
      </i>
    </span>
  </div>
</template>

<script>
import config from 'config'

export default {
  name: 'ActiveFilter',
  props: {
    attributes: {
      type: Array,
      required: true,
      default: () => false
    }
  },
  methods: {
    getVariantInfo (variant) {
      let variant_label
      if (variant.attribute_code === 'price') {
        const currencySign = config.i18n.currencySign
        const price_range = variant[Object.keys(variant)[0]].split('-')
        variant_label = currencySign + " " + price_range[0] + " - " + currencySign + " " + price_range[1]
      } else {
        variant_label = variant.label
      }
      return variant_label
    }
  }
}
</script>

<style lang="scss">
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-puerto-rico: color(puerto-rico);
  $color-white: color(white);

  span.active-filter-label {
    height: 30px;
    line-height: 30px;
    color: $color-white;
    display: inline-block;
    background-color: $color-puerto-rico;
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
