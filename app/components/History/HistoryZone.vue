<template>
  <ScrollView orientation="vertical">
    <WrapLayout orientation="horizontal">
      <template v-for="(item, index) in items">
        <Button
          v-if="hasPosition(index)"
          :key="index"
          :text="item.text"
          @tap="() => handleItemClick(index)"
          backgroundColor="transparent"
          margin="0px"
          fontSize="26.3em"
        />
        <Label v-else :key="index" :text="item.text" fontSize="30em" />
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
  },
  setup(props) {
    function handleItemClick(index) {
      const selectedItem = props.items[index];
      if (selectedItem.fenAfterMove) {
        console.log("Requested position " + selectedItem.fenAfterMove);
      }
    }

    function hasPosition(index) {
      return props.items[index].fenAfterMove !== undefined;
    }

    return {
      handleItemClick,
      hasPosition,
    };
  },
};
</script>

<style scoped>
Label {
  font-size: 28;
}
</style>