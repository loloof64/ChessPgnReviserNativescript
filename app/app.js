import Vue from "nativescript-vue";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);

import Home from "./components/Home";

new Vue({
  render: h => h("frame", [h(Home)])
}).$start();
