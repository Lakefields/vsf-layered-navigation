<script>
import { ProductCustomOption } from '@vue-storefront/core/modules/catalog/components/ProductCustomOption'

export default {
  mixins: [ProductCustomOption],
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
  }
}
</script>
