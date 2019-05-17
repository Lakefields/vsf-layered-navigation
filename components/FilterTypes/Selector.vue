<template>
  <div
    :class="{'no-products-left': noProductsLeft, 'filter-label': true}">
    <span
      :class="{'active': active, 'filter-label': true}"
      @click="switchFilter(id, label)"
      :aria-label="$t('Select ') + label"
    >
      {{ label }}
    </span>
    <span v-if="showProductsLeftCounter" class="product-counter">{{ productsLeftCounter }}</span>
  </div>
</template>

<script>
import Filter from './Filter'

export default {
  computed: {
    availableFilters () {
      return this.$store.state.category.filters.available
    },
    currentProductList () {
      return this.$store.state.product.list.items
    },
    productsTotal () {
      return this.$store.state.product.list.total
    },
    productsCounter () {
      return this.currentProductList.length
    },
    productLeftCounterEnabled () {
      return (this.productsTotal <= this.productsCounter) ? this.$store.state.config.layeredNavigation.enableProductsLeftCounter : false
    },
    productsLeftCounter () {
      let countProducts
      for (let attributeCode in this.availableFilters) {
        if (attributeCode === this.code) {
          let attributeId = this.id
          countProducts = this.currentProductList.filter(product => {
            if (product[attributeCode] === null) {
              return false
            }
            return (typeof product[attributeCode] === 'object') ? product[attributeCode].indexOf(attributeId) !== -1 : product[attributeCode] === parseInt(this.id)
          })
        }
      }
      return countProducts.length
    },
    showProductsLeftCounter () {
      return this.productLeftCounterEnabled && this.productsLeftCounter > 0
    },
    noProductsLeft () {
      return this.productLeftCounterEnabled && this.productsLeftCounter === 0
    }
  },
  methods: {
    switchFilter (id, label) {
      if (!this.noProductsLeft) {
        this.$bus.$emit('filter-changed-' + this.context, { attribute_code: this.code, id: id, label: label })
      }
    }
  },
  mixins: [Filter]
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
