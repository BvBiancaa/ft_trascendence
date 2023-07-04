<template>
  <div>
    <div v-for="user in onlineUsersStore.onlineUsers">
      {{ user.displayName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOnlineUsersStore } from "../utils/authStore";
import { io } from "socket.io-client";
import { onBeforeMount } from "vue";

const socket = io(import.meta.env.VITE_BACK_BASE_URL);
const onlineUsersStore = useOnlineUsersStore();

onBeforeMount(() => {
  socket.on("whosonline", (onlineUsers) => {
    onlineUsersStore.setUsers(onlineUsers);
  });
});
</script>

<style scoped></style>
