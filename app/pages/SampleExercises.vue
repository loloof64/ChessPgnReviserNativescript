<template>
  <Page>
    <ActionBar>
      <Label text="Sample exercises"></Label>
    </ActionBar>

    <ListView for="item in listOfItems" @itemTap="onItemTap">
      <v-template>
        <Label :text="item.text" />
      </v-template>
    </ListView>
  </Page>
</template>

<script>
export default {
  setup() {
    const listOfItems = [
      {
        text: "King+Pawn/King",
      },
    ];

    function onItemTap(event) {}

    return { listOfItems, onItemTap };
  },
};
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles

ActionBar {
  background-color: lightgreen;
}

ActionBar > Label {
  color: white;
}
</style>
