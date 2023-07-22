<template>
  <Login />
  <!-- <LoginNo42 />
    <CreateUsr /> -->
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCurrentUserStore } from "../utils/currentUserStore";
import Login from "./Login.vue";
// import LoginNo42 from "./LoginNo42.vue";
// import CreateUsr from "./CreateUsr.vue";
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
