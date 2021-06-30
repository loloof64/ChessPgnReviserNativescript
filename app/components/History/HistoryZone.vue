<template>
  <ScrollView ref="root" orientation="vertical" backgroundColor="transparent">
    <WrapLayout orientation="horizontal">
      <template v-for="(item, index) in items">
        <Button
          v-if="hasPosition(index)"
          ref="itemsRefs"
          :key="index"
          :text="item.text"
          @tap="() => handleItemClick(index)"
          :backgroundColor="getBackground(index)"
          margin="0px"
          fontSize="26.3em"
        />
        <Label
          v-else
          ref="itemsRefs"
          :key="index"
          :text="item.text"
          fontSize="30em"
        />
      </template>
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
    selectedIndex: {
      type: Number,
      required: true,
    },
  },
  methods: {
    handleItemClick: function (index) {
      const selectedItem = this.items[index];
      if (selectedItem.fenAfterMove) {
        context.emit("position-request", {
          ...selectedItem,
          index,
        });
      }
    },

    hasPosition: function (index) {
      return this.items[index].fenAfterMove !== undefined;
    },

    getBackground: function (index) {
      return this.selectedIndex === index ? "lightgreen" : "transparent";
    },

    scrollToItemAt: function (index) {
      const matchingItem = this.$refs.itemsRefs[index];
      const absoluteTop = matchingItem.nativeView.getLocationOnScreen().y;
      const root = this.$refs.root;
      const rootTop = root.nativeView.getLocationOnScreen().y;

      const localTop = absoluteTop - rootTop;
      root.nativeView.scrollToVerticalOffset(localTop, false);
    },
  },
};
</script>

<style scoped>
Label {
  font-size: 28;
}
</style>