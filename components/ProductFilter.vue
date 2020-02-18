<template>
  <div class="product-filter">
    <h4>{{ $t(filterIndex + '_filter') }}</h4>

    <div v-if="filterIndex==='color'">
      <color-selector
        context="category"
        code="color"
        v-for="(color, index) in filter"
        :key="index"
        :variant="color"
        :selected-filters="selectedFilters"
        @change="$emit('changeFilter', $event)"
      />
    </div>
    <div v-else-if="filterIndex==='price'">
      <price-slider
        context="category"
        code="price"
        id="price"
        :price-range="filter"
        content="Price "
        label="Price Label"
        :selected-filters="selectedFilters"
        @change="$emit('changeFilter', $event)"
      />
    </div>
    <div v-else class="filter-option"
      :class="{'filter-options': showFilterExpander(), 'filter-expanded': filterExpand}"
      :style="{'max-height': setMaxHeight }" 
    >
      <selector
        context="category"
        :code="filterIndex"
        v-for="(option, index) in filter"
        :key="index"
        :variant="option"
        :selected-filters="selectedFilters"
        @change="$emit('changeFilter', $event)"
      />
      <div class="filter-expander" v-show="showFilterExpander()">
        <span
          class="filter-expand"
          @click="filterExpander()"
        >
          <div class="plus-minus">
            <div class="horizontal" />
            <div class="vertical" />
          </div>
          <span class="label">
            {{ filterExpanderMessage }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import rootStore from '@vue-storefront/core/store'
import ColorSelector from './FilterTypes/ColorSelector'
import Selector from './FilterTypes/Selector'
import PriceSlider from './FilterTypes/PriceSlider'
import i18n from '@vue-storefront/i18n'
import pickBy from 'lodash-es/pickBy'

export default {
  name: 'ProductFilter',
  props: {
    filterIndex: {
      type: String,
      required: true
    },
    filter: {
      type: Array,
      required: true
    },
    selectedFilters: {
      type: Object,
      default: () => ({})
    },
    limit: {
      type: Number,
      required: false,
      default: 10
    }
  },
    data () {
    return {
      filterExpand: false
    }
  },
  components: {
    ColorSelector,
    Selector,
    PriceSlider
  },
  computed: {
    ...mapGetters(
      'category', ['getCurrentCategory', 'getActiveCategoryFilters', 'getCurrentCategoryProductQuery', 'getAvailableCategoryFilters']
    ),
    availableFilterOptions () {
      return this.filter.length
    },
    filterOptionElHeight () {
      return this.$store.state.config.layeredNavigation.filterOptionElHeight
    },
    remainingFilterOptions () {
      return this.availableFilterOptions - this.limit
    },
    filterExpanderMessage () {
      return (this.filterExpand) ? i18n.t('Show less filter options') : i18n.t('Show more filter options ({remainingFilterOptions})', { remainingFilterOptions: this.remainingFilterOptions })
    },
    setMaxHeight () {
      return (!this.filterExpand) ? (this.filterOptionElHeight * this.limit) + 'px' : (this.filterOptionElHeight * this.availableFilterOptions) + 'px'
    }
  },
  methods: {
    showFilterExpander () {
      return this.availableFilterOptions > this.limit
    },
    filterExpander () {
      this.filterExpand = !this.filterExpand
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$primary-color: color(primary, $colors-theme);
$puerto-rico-color: color(puerto-rico);
$white-color: color(white);
$white-smoke-color: color(white-smoke);

h4 {
  margin-bottom: 10px;
}

.filter-options {
  max-height: 300px;
  transition: max-height .3s ease-in;
  overflow: hidden;
  padding-bottom: 30px;
  position: relative;
  .filter-expander {
    height: 30px;
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: #fff;
    span {
      line-height: 30px;
      cursor: pointer;
      &.label {
        padding-left: 5px;
        text-decoration: underline;
        font-weight: 700;
        font-size: 14px;
        color: $puerto-rico-color;
      }
    }
  }
  &.filter-expanded {
    max-height: 10000px;
  }
}

.plus-minus {
  position: relative;
  display: inline-block;
  width: 10px;
  height: 10px;
  top: 0;
  .vertical {
    transition: all 0.2s ease-in-out;
    transform: rotate(-90deg);
  }
  .horizontal {
    transition: all 0.2s ease-in-out;
    transform: rotate(-90deg);
    opacity: 1;
  }
}
.plus-minus .horizontal {
  position: absolute;
  background-color: $puerto-rico-color;
  width: 10px;
  height: 2px;
  left: 50%;
  margin-left: -5px;
  top: 50%;
  margin-top: -1px;
}
.plus-minus .vertical {
  position: absolute;
  background-color: $puerto-rico-color;
  width: 2px;
  height: 10px;
  left: 50%;
  margin-left: -1px;
  top: 50%;
  margin-top: -5px;
}
.filter-expanded {
  opacity: 1;
  .vertical {
    transition: all 0.2s ease-in-out;
    transform: rotate(90deg);
  }
  .horizontal {
    transition: all 0.2s ease-in-out;
    transform: rotate(90deg);
    opacity: 0;
  }
}
</style>
