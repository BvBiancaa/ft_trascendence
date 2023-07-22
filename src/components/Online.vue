<template>
  <div class="online">
    <h4>Friends</h4>
    <div class="user" v-for="user in friends" :key="user.id">
      <div
        @click="() => currentUserStore.setModal(user.id)"
        v-if="
          onlineUsersStore.onlineUsers.findIndex((usr) => usr.id == user.id) !=
          -1
        "
      >
        {{ user.nick }}
        <span>🟢</span>
      </div>
      <div @click="() => currentUserStore.setModal(user.id)" v-else>
        {{ user.nick }}
        <span>🔴</span>
      </div>
    </div>
    <div class="conversations">
      <h4>Conversations</h4>
      <div
        class="user"
        v-for="conversation in conversationsStore.conversations"
        :key="conversation.id"
      >
        <div @click="() => openModalAndSetRead(conversation.id)">
          {{ conversation.nick }} <span v-if="conversation.updated">💬</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOnlineUsersStore } from "../utils/onlineUsersStore";
import { useCurrentUserStore } from "../utils/currentUserStore";
import { useOnlineSocketStore } from "../utils/onlineSocketStore";
import { Message, OnlineUser } from "../utils/interfaces";
import { ref, Ref, onMounted, watchEffect } from "vue";
import { useConversationsStore } from "../utils/conversationsStore";
import { io } from "socket.io-client";
const conversationsStore = useConversationsStore();
const onlineUsersStore = useOnlineUsersStore();
const currentUserStore = useCurrentUserStore();
const onlineSocketStore = useOnlineSocketStore();
const friends: Ref<{ nick: string; id: number }[]> = ref([]);

if (onlineSocketStore.socket == null) {
  console.log("attivo socket");
  onlineSocketStore.setSocket(
    io(import.meta.env.VITE_BACK_BASE_URL, {
      auth: {
        token: currentUserStore.currentToken,
        id: currentUserStore.id,
      },
    })
  );
}
onlineSocketStore.socket?.on("whosonline", (data: OnlineUser[]) => {
  onlineUsersStore.setUsers(data);
});
onlineSocketStore.socket?.on("nickChanged", (data) => {
  if (currentUserStore.friends.includes(data.id)) {
    const idx = currentUserStore.friends.indexOf(data.id);
    currentUserStore.friends.splice(idx, 1);
    currentUserStore.friends.push(data.id);
  }
});
if (!conversationsStore.fetched) {
  onlineSocketStore.socket?.emit("getMyPrivMsgs");
  conversationsStore.fetched = true;
}

onlineSocketStore.socket?.on("yourPrivmsg", (data: Message[]) => {
  console.log("ricevo tutti i messaggi");
  data.map((msg: Message) => {
    if (msg.senderId != currentUserStore.id) {
      const conv = conversationsStore.getOrCreateConvWithUsr(msg.senderId);
      conv.nick = msg.fromNick;
      conv.messages.push(msg);
    } else {
      const conv = conversationsStore.getOrCreateConvWithUsr(msg.receiverId);
      conv.messages.push(msg);
    }
  });
  conversationsStore.checkIfUpdated(currentUserStore.lastOnline);
});
onlineSocketStore.socket?.on("privmsg", (msg) => {
  if (msg.success == false) {
    console.log("bloccato!");
  } else {
    if (msg.senderId != currentUserStore.id) {
      const conv = conversationsStore.getOrCreateConvWithUsr(msg.senderId);
      if (currentUserStore.modalOpen != conv.id) {
        conv.updated = true;
      }
      conv.nick = msg.fromNick;
      conv.messages.push(msg);
    } else {
      const conv = conversationsStore.getOrCreateConvWithUsr(msg.receiverId);
      conv.messages.push(msg);
    }
  }
});

const openModalAndSetRead = (id: number) => {
  currentUserStore.setModal(id);
  const conv = conversationsStore.conversations.find((conv) => conv.id == id);
  if (conv && conv.updated) {
    conv.updated = false;
  }
};

onMounted(async () => {
  friends.value = await currentUserStore.getFriends();
}),
  watchEffect(async () => {
    friends.value = await currentUserStore.getFriends();
  });
</script>

<style scoped>
.online {
  margin-left: 10px;
}

.user {
  margin-top: 10px;
}
</style>
