import Vue from "nativescript-vue";
import VueCompositionAPI from "@vue/composition-api";
import CanvasSVG from '@nativescript-community/ui-svg/vue';
import VueDevtools from 'nativescript-vue-devtools'

Vue.use(VueCompositionAPI);
Vue.use(CanvasSVG);

Vue.use(VueDevtools, {host: '192.168.1.14'});

import Home from "./components/Home";

new Vue({
  render: h => h("frame", [h(Home)])
}).$start();