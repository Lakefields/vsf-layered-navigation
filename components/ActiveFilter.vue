<template>
  <div>
    <span
      v-for="(attribute, index) in attributes"
      :key="index"
      class="active active-filter-label"
      :aria-label="$t('Select ' + attribute.label)"
    >
      {{ attribute.label }}
      <i
        class="material-icons"
        @click="removeFilter(attribute)">
        close
      </i>
    </span>
  </div>
</template>

<script>

export default {
  name: 'ActiveFilter',
  props: {
    attributes: {
      type: Array,
      required: true,
      default: () => false
    }
  },
  data () {
    return {
      context: 'category',
      active: false
    }
  },
  methods: {
    removeFilter (attribute) {
      this.$bus.$emit('filter-changed-' + this.context, { ...attribute, remove: true })
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
