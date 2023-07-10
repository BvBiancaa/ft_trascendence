<template>
  <div>
    <div v-for="user in onlineUsersStore.onlineUsers">
      {{ user.nickName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOnlineUsersStore, useOnlineSocketStore } from "../utils/authStore";
import { onBeforeMount } from "vue";
import { OnlineUser } from "../utils/interfaces";

const onlineUsersStore = useOnlineUsersStore();
const onlineSocketStore = useOnlineSocketStore();

onBeforeMount(() => {
  if (onlineSocketStore.socket != null) {
    onlineSocketStore.socket.on("whosonline", (data: OnlineUser[]) => {
      onlineUsersStore.setUsers(data);
    });
  }
});
</script>

<style scoped></style>
