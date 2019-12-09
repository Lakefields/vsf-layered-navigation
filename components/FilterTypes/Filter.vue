<script>
import { mapGetters } from 'vuex'
import { ProductCustomOption } from '@vue-storefront/core/modules/catalog/components/ProductCustomOption'

export default {
  mixins: [ProductCustomOption],
  computed: {
    ...mapGetters('category', ['getActiveCategoryFilters', 'getAvailableCategoryFilters']),
    activeFilters () {
      return this.getActiveCategoryFilters
    },
    currentProductList () {
      return this.$store.getters['product/list']
    },
    productLeftCounterEnabled () {
      return this.$store.state.config.layeredNavigation.enableProductsLeftCounter
    },
    productsLeftCounter () {
      let countProducts
      let countProductsByFilter = []
      for (let attributeCode in this.getAvailableCategoryFilters) {
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
    },
    hasYield () {
      return this.productsLeftCounter < this.currentProductList.length
    },
    showFilterOption () {
      return this.active || (this.hasYield && !this.noProductsLeft)
    }
  },
  mounted () {
    for (let attributeCode in this.activeFilters) {
      if (attributeCode === this.code) {
        if (this.activeFilters.hasOwnProperty(attributeCode)) {
          let activeFilters = this.activeFilters[attributeCode]
          if (activeFilters.filter(option => option.id === this.id).length === 0) {
            this.active = false
          } else {
            this.active = true
          }
        } else {
          this.active = false
        }
      }
    }
  },
  methods: {
    filterChanged (filterOption) {
      let attributeCode = filterOption.attribute_code
      if (attributeCode === this.code) {
        if (this.activeFilters.hasOwnProperty(attributeCode)) {
          let activeFilters = this.activeFilters[attributeCode]
          if (activeFilters.filter(option => option.id === this.id).length === 0) {
            this.active = false
          } else {
            this.active = true
          }
        } else {
          this.active = false
        }
      }

    },
    switchFilter (id, label) {
      if (!this.noProductsLeft) {
        this.$bus.$emit('filter-changed-' + this.context, { attribute_code: this.code, id: id, label: label })
      }
    }
  }
}
</script>
