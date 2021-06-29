import Vue from "nativescript-vue";
import VueCompositionAPI from "@vue/composition-api";
import VueDevtools from "nativescript-vue-devtools";
import { SVGImage } from "@sergeymell/nativescript-svg";
import CanvasPlugin from '@nativescript-community/ui-canvas/vue';

Vue.use(VueCompositionAPI);
Vue.use(CanvasPlugin);
Vue.registerElement("SVGImage", () => SVGImage);
Vue.use(VueDevtools, { host: "192.168.1.14" });

import Home from "./components/Home";

new Vue({
  render: h => h("frame", [h(Home)])
}).$start();
