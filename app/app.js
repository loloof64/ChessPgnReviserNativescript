import Vue from "nativescript-vue";
import VueCompositionAPI from "@vue/composition-api";
import CanvasSVG from '@nativescript-community/ui-svg/vue';

Vue.use(VueCompositionAPI);
Vue.use(CanvasSVG);

import Home from "./components/Home";

new Vue({
  render: h => h("frame", [h(Home)])
}).$start();
