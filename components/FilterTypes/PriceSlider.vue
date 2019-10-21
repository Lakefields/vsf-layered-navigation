<template>
  <div class="price-slider-container">
    <no-ssr placeholder="loading..." placeholader-tag="span">
      <vue-slider
        ref="priceSlider"
        v-model="value"
        v-bind="priceSliderOptions"
        :clickable="false"
        :min="getMin"
        :max="getMax"
        :tooltip-formatter="tooltipContent"
        @drag-end="setPrice"
      />
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import isEqual from 'lodash-es/isEqual'

const PriceSliderComponents = {}

if (process.browser) {
  let VueSlider = require('vue-slider-component')
  PriceSliderComponents['vue-slider'] = VueSlider
}
PriceSliderComponents['no-ssr'] = NoSSR

export default {
  name: 'PriceSlider',
  props: {
    content: {
      type: null,
      default: ''
    },
    id: {
      type: null,
      required: true
    },
    code: {
      type: null,
      required: true
    },
    priceRange: {
      type: Array,
      required: true
    },
    context: {
      type: null,
      default: ''
    }
  },
  beforeMount () {
    this.$bus.$on('filter-reset', this.resetPriceSlider)
    this.$bus.$on('reset-price-slider', this.resetPriceSlider)
    this.$bus.$on('category-after-load', this.resetPriceSlider)
  },
  beforeDestroy () {
    this.$bus.$off('filter-reset', this.resetPriceSlider)
    this.$bus.$off('reset-price-slider', this.resetPriceSlider)
    this.$bus.$off('category-after-load', this.resetPriceSlider)
  },
  data () {
    return {
      active: false,
      remove: false,
      value: this.priceRange,
      currencySign: this.$store.state.config.i18n.currencySign,
      priceSliderConfig: this.$store.state.config.layeredNavigation.priceSliderOptions
    }
  },
  computed: {
    priceSliderOptions () {
      return {...this.priceSliderConfig, ...this.tooltipContent}
    },
    tooltipContent () {
      return { formatter: this.currencySign + ' {value}' }
    },
    getMin () {
      return this.priceRange[0]
    },
    getMax () {
      return this.priceRange[1]
    }
  },
  methods: {
    setPrice: function (e) {
      let val = e.val
      let from = val[0]
      let to = val[1]
      let id = val[1]
      this.remove = isEqual(val, this.priceRange)
      this.switchFilter(id, from, to)
    },
    switchFilter (id, from, to) {
      this.$bus.$emit('filter-changed-' + this.context, { attribute_code: this.code, id: id, from: from, to: to, label: this.currencySign + ' ' + from + ' - ' + this.currencySign + ' ' + to, remove: this.remove })
    },
    resetPriceSlider () {
      if (this.$refs.priceSlider) {
        this.$refs.priceSlider.setValue(this.priceRange)
      }
    }
  },
  components: PriceSliderComponents
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-event: color(tertiary);
  $color-active: color(accent);

  .price-slider-container {
    padding-bottom: 50px;
    position: relative;
    z-index: 1;
  }

  .price-selector {
    width: 20px;
    height: 20px;

    &.active {
      .square {
        background-color: $color-active;
      }
    }
  }

  .square {
    width: 80%;
    height: 80%;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
</style>

<style lang="scss">
.vue-slider-component .vue-slider-dot {
  box-shadow: none;
}
</style>
