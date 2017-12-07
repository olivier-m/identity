'use strict';

// import 'normalize.css';
import '../style/main.styl';

import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

//
// Components
//
import 'vue-awesome/icons/minus-square';
import 'vue-awesome/icons/plus-square';
import 'vue-awesome/icons/trash-o';
import 'vue-awesome/icons/unlock';
import 'vue-awesome/icons/lock';
import 'vue-awesome/icons/globe';
import 'vue-awesome/icons/eye';
import 'vue-awesome/icons/firefox';
import Icon from 'vue-awesome/components/Icon.vue';
Vue.component('icon', Icon);

//
// Mixins
//
import Localized from './mixins/Localized';
Vue.mixin(Localized);

//
// Router
//
Vue.use(VueRouter);

import Cookies from './views/Cookies.vue';

const routes = [
  {
    'path': '/',
    'name': 'main',
    'redirect': '/cookies/firefox-default'
  },
  {
    'path': '/cookies/',
    'name': 'cookie-list-default',
    'redirect': '/cookies/firefox-default'
  },
  {
    'path': '/cookies/:storeId?',
    'name': 'cookie-list',
    'component': Cookies
  }
];

const router = new VueRouter({
  routes,
  'linkActiveClass': 'active',
  'linkExactActiveClass': 'active'
});

//
// Load app
//
new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
