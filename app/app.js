import Vue from "nativescript-vue";
import VueCompositionAPI from "@vue/composition-api";
import { SVGImage } from "@sergeymell/nativescript-svg";
import CanvasPlugin from '@nativescript-community/ui-canvas/vue';

Vue.use(VueCompositionAPI);
Vue.use(CanvasPlugin);
Vue.registerElement("SVGImage", () => SVGImage);

import Home from "~/pages/Home.vue";

new Vue({
  render: h => h(Home),
}).$start();
