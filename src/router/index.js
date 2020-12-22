import Vue from "vue";
import VueRouter from "vue-router";
import Page from "../views";
import Screen from '@/views/Screen'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {path: "/", redirect: "/login"},
    {path: "/login", component: Page.Login},
    {path: "/home", component: Page.Home},
    {path: "/video/:id", component: Page.Video},
    {
      path: '/index',
      component: Screen,
      children: [{
        path: '/index',
        component: () => import('@/views/Screen/index'),
        name: 'index'
      }]
    }
  ]
});
