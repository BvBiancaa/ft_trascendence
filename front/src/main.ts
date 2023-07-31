import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Home from "./components/Home.vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import Welcome from "./components/Welcome.vue";
import Userlist from "./components/Userlist.vue";
import Chat from "./components/Chat.vue";
import UserPanel from "./components/UserPanel.vue";
import Game from "./components/game/Game.vue";
import Register from "./components/CreateUsr.vue";
import no42 from "./components/LoginNo42.vue";
import Leaderboard from "./components/Leaderboard.vue";
import EndGame from "./components/EndGame.vue";
import WaitingRoom from "./components/WaitingRoom.vue";

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
  {
    path: "/profile",
    component: UserPanel,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/game",
    component: Game,
  },
  {
    path: "/no42",
    component: no42,
  },
  {
    path: "/leaderboard",
    component: Leaderboard,
  },
  {
    path: "/endGame",
    component: EndGame,
  },
  {
    path: "/waitingroom",
    component: WaitingRoom,
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
