<template>
  <TabView
    androidTabsPosition="bottom"
    :selectedIndex="selectedIndex"
    @selectedIndexChange="indexChange"
  >
    <TabViewItem title="Samples" iconSource="~/pages/bookshelf.png">
      <Frame id="samples">
        <sample-exercises />
      </Frame>
    </TabViewItem>

    <TabViewItem title="Personals" iconSource="~/pages/crayons.png">
      <Frame id="personals">
        <personal-exercises />
      </Frame>
    </TabViewItem>
  </TabView>
</template>

<script>
import { ref } from "@vue/composition-api";
import SampleExercises from "~/pages/SampleExercises.vue";
import PersonalExercises from "~/pages/PersonalExercises.vue";

export default {
  components: {
    SampleExercises,
    PersonalExercises,
  },
  setup() {
    const selectedIndex = ref(0);

    function indexChange(index) {
      selectedIndex.value = index;
    }

    return { selectedIndex, indexChange };
  },
};
</script>

<style scoped lang="scss">

TabView {
  tab-background-color: rgb(182, 57, 57);
  selected-tab-text-color: lightgreen;
  android-selected-tab-highlight-color: lightgreen;
  tab-text-color: white;
}
</style>