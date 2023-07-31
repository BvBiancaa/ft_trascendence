<template>
  <Login />
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCurrentUserStore } from "../utils/currentUserStore";
import Login from "./Login.vue";

const { URLSearchParams } = window;

const currentUserStore = useCurrentUserStore();
const router = useRouter();
const checkAuthentication = () => {
  if (currentUserStore.authenticated == true) {
    router.push("/welcome");
  }
  const urlParams = new URLSearchParams(window.location.search);
  const pwd = urlParams.get("ablm");
  const token = urlParams.get("token");
  const id = urlParams.get("id");
  const email = urlParams.get("email");
  if (token && id) {
    getUserFromDb(token);
  } else if (email && pwd) {
    const code = prompt("2fa needed");
    if (code) {
      currentUserStore.loginUsr2fa(email, pwd, code);
    }
  }
};

const getUserFromDb = async (token: string) => {
  currentUserStore.getUserFromDb(token).then(() => router.push("/welcome"));
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
.main {
  border: 1px solid black;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
