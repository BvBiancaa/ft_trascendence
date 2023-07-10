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

const currentUserStore = useCurrentUserStore();
const router = useRouter();
const checkAuthentication = () => {
  if (currentUserStore.authenticated == true) {
    router.push("/welcome");
  }
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const id = urlParams.get("id");
  if (token && id) {
    getUserFromDb(token);
  }
};

const getUserFromDb = async (token: string) => {
  const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getself/`;
  axios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((data) => currentUserStore.setUser(data.data, token))
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
watch(
  () => currentUserStore.authenticated,
  (authenticated) => {
    if (authenticated == true) {
      router.push("/welcome");
    }
  }
);

onMounted(() => {
  if (currentUserStore.authenticated == true) {
    router.push("/welcome");
  }
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
