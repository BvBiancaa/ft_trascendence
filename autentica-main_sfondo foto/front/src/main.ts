import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Home from "./components/Home.vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import Welcome from "./components/Welcome.vue";
import Userlist from "./components/Userlist.vue";
import Chat from "./components/Chat.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/welcome",
    component: Welcome,
  },
  {
    path: "/userlist",
    component: Userlist,
  },
  {
    path: "/chat",
    component: Chat,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount("#app");
