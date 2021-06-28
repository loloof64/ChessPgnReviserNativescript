<template>
<ScrollView  orientation="vertical">
  <WrapLayout orientation="horizontal">
    <Label
      v-for="(item, index) in items"
      :key="index"
      :text="item.text + ' '"
    />
  </WrapLayout>
</ScrollView>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  setup() {},
};
</script>

<style scoped>
Label {
  font-size: 28;
}
</style>