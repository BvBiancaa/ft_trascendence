<template>
  <div>
    <div class="room">
      <h1>Messaggi privati con {{ usr }}</h1>
      <div class="messages">
        <ul>
          <li v-for="message in privmsgs">{{ message }}</li>
        </ul>
      </div>
      <form @submit.prevent="sendMsg">
        <label>msg:</label>
        <input v-model="msg" type="text" />
        <button type="submit">send</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useOnlineSocketStore } from "../utils/onlineSocketStore";
import { useOnlineUsersStore } from "../utils/onlineUsersStore";
import { useCurrentUserStore } from "../utils/currentUserStore";
const socket = useOnlineSocketStore().socket;
const currentUserStore = useCurrentUserStore();
const onlineUsersStore = useOnlineUsersStore();
const privmsgs = ref([]);
const msg = ref("");
const props = defineProps<{
  usr: string;
}>();

const sendMsg = () => {
  if (msg.value != "") {
    if (socket != null) {
      const newMsg = {
        receiverId: onlineUsersStore.onlineUsers.find(
          (u) => u.nickName == props.usr
        )?.id,
        senderId: currentUserStore.id,
        content: msg.value,
      };
      socket.emit("privMsg", newMsg);
      msg.value = "";
    }
  }
};

socket?.emit("getPrivMsgs", {
  senderId: currentUserStore.id,
  receiverId: onlineUsersStore.onlineUsers.find((u) => u.nickName == props.usr)
    ?.id,
});
socket?.on("privmsg", (data) => (privmsgs.value = data));
watch(props, (props) => {
  socket?.emit("getPrivMsgs", {
    senderId: currentUserStore.id,
    receiverId: onlineUsersStore.onlineUsers.find(
      (u) => u.nickName == props.usr
    )?.id,
  });
});
</script>

<style scoped>
.room {
  height: 600px;
  width: 800px;
  display: flex;
  flex-direction: column;
}
</style>
../utils/currentUserStore../utils/currentUserStore
