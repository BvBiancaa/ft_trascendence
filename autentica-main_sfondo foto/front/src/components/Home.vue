<template>
  <div>
    <Login />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useCurrentUserStore } from "../utils/authStore";
import Login from "./Login.vue";
const { URLSearchParams } = window;
import { io } from "socket.io-client";

const currentUserStore = useCurrentUserStore();
const router = useRouter();
const socket = io(import.meta.env.VITE_BACK_BASE_URL);
const checkAuthentication = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const uid = urlParams.get("uid");
  if (token && uid) {
    getUserFromDb(uid, token);
  }
};

const getUserFromDb = async (uid: string, token: string) => {
  const url = import.meta.env.VITE_BACK_BASE_URL + `/login/getuser/${uid}`;
  axios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((data) => currentUserStore.setUser(data.data, token))
    .then(() => iMOnline())
    .then(() => router.push("/welcome"));
};
watch(
  () => router.currentRoute.value,
  (route) => {
    if (route.query.token !== undefined) {
      checkAuthentication();
    }
  }
);

const iMOnline = () => {
  socket.emit("online", { id: currentUserStore.uid });
};

onMounted(() => {
  checkAuthentication();
});
</script>

<style scoped>
div {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
