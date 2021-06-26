import Vue from "nativescript-vue";
import VueCompositionAPI from "@vue/composition-api";
import VueDevtools from "nativescript-vue-devtools";
import {SVGImage} from "@sergeymell/nativescript-svg";

Vue.use(VueCompositionAPI);
Vue.use(VueDevtools, { host: "192.168.1.14" });
Vue.registerElement('SVGImage', () => SVGImage);

import Home from "./components/Home";

new Vue({
  render: h => h("frame", [h(Home)])
}).$start();
