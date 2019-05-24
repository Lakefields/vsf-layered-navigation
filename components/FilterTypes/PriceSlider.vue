<template>
  <div class="price-slider-container">
    <no-ssr placeholder="loading..." placeholader-tag="span">
      <vue-slider
        v-model="value"
        v-bind="options"
        @drag-end="setPrice"
      />
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import PriceSelector from '@vue-storefront/core/compatibility/components/PriceSelector'

const PriceSliderComponents = {}

if (process.browser) {
  let VueSlider = require('vue-slider-component')
  PriceSliderComponents['vue-slider'] = VueSlider
}
PriceSliderComponents['no-ssr'] = NoSSR

export default {
  name: 'PriceSlider',
  data () {
    return {
      value: [Math.floor(this.from), Math.ceil(this.to)],
      options: {
        min: Math.floor(this.from),
        max: Math.ceil(this.to),
        'clickable': false,
        'height': 2,
        'bg-style': {
          'backgroundColor': '#dddddd'
        },
        'tooltip-dir': ['bottom', 'bottom'],
        'formatter': '€ {value}',
        'process-style': {
          'backgroundColor': '#f9bb2a',
          'fontWeight': 700
        },
        'tooltip-style': {
          'backgroundColor': '#f9bb2a',
          'color': '#4f4f4f',
          'border-color': '#f9bb2a',
          'padding': '7px 10px'
        }
      }
    }
  },
  methods: {
    setPrice: function (e) {
      let val = e.val
      let from = val[0]
      let to = val[1]
      let id = val[1]
      this.switchFilter(id, from, to)
    }
  },
  components: PriceSliderComponents,
  mixins: [PriceSelector]
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-event: color(tertiary);
  $color-active: color(accent);

  .price-slider-container {
    padding-bottom: 50px;
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
