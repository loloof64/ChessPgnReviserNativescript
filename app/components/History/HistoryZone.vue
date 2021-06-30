<template>
  <ScrollView orientation="vertical">
    <WrapLayout orientation="horizontal">
      <Button
        v-for="(item, index) in items"
        :key="index"
        :text="item.text"
        @tap="() => handleItemClick(index)"
        backgroundColor="transparent"
        margin="0px"
        fontSize="26.3em"
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
  setup(props) {
    function handleItemClick(index) {
      const selectedItem = props.items[index];
      if (selectedItem.fenAfterMove) {
        console.log("Requested position " + selectedItem.fenAfterMove);
      }
    }

    return {
      handleItemClick,
    };
  },
};
</script>

<style scoped>
Label {
  font-size: 28;
}
</style>