<script>
import { mapGetters } from 'vuex'
import { ProductCustomOption } from '@vue-storefront/core/modules/catalog/components/ProductCustomOption'

export default {
  mixins: [ProductCustomOption],
  computed: {
    ...mapGetters('category', ['getActiveCategoryFilters']),
    activeFilters () {
      return this.getActiveCategoryFilters
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
    }
  }
}
</script>
