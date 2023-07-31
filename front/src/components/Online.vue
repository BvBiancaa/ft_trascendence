<template>
  <div class="button">
    <button class="show" @click="openpanel"></button>
  </div>
  <div class="online">
    <h4 class="title" :style="coloreScritte">Friends</h4>
    <div class="user" v-for="user in friends" :key="user.id">
      <div
        @click="() => currentUserStore.setModal(user.id, false)"
        v-if="
          onlineUsersStore.onlineUsers &&
          onlineUsersStore.onlineUsers.findIndex((usr) => usr.id == user.id) !=
            -1
        "
        :style="coloreScritte"
      >
        {{ user.nick }}
        <span
          v-if="
            onlineUsersStore.onlineUsers.find((u) => u.id == user.id)
              ?.playing == false
          "
          >🟢</span
        >
        <span
          v-if="
            onlineUsersStore.onlineUsers.find((u) => u.id == user.id)
              ?.playing == true
          "
          >🕹️</span
        >
      </div>
      <div
        @click="() => currentUserStore.setModal(user.id, false)"
        :style="coloreScritte"
        v-else
      >
        {{ user.nick }}
        <span>🔴</span>
      </div>
    </div>
    <div class="conversations">
      <h4 class="title" :style="coloreScritte">Chat</h4>
      <div
        class="user"
        v-for="conversation in conversationsStore.conversations"
        :key="conversation.id"
        :style="coloreScritte"
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
import { ref, Ref, onMounted, watchEffect, watch } from "vue";
import { useConversationsStore } from "../utils/conversationsStore";
import { io } from "socket.io-client";
import { useRouter, RouteLocationNormalized } from "vue-router";
const conversationsStore = useConversationsStore();
const onlineUsersStore = useOnlineUsersStore();
const currentUserStore = useCurrentUserStore();
const onlineSocketStore = useOnlineSocketStore();
const friends: Ref<{ nick: string; id: number }[]> = ref([]);
const router = useRouter();
const coloreScritte = ref("color: white;");

function openpanel(): void {
  const a: HTMLElement | null = document.querySelector(".online");
  const b: HTMLElement | null = document.querySelector(".show");
  if (a) {
    if (a.style.display == "none" || a.style.display == "") {
      a.style.display = "block";
      if (b) {
        b.style.backgroundImage = "url('../../public/gif/hide.svg')";
        b.style.left = "76vw";
      }
    } else {
      a.style.display = "none";
      if (b) {
        b.style.backgroundImage = "url('../../public/gif/show.svg')";
        b.style.backgroundRepeat = "no-repeat";
        b.style.backgroundSize = "cover";
        b.style.left = "95vw";
      }
    }
  }
}

function checkPage(route: RouteLocationNormalized): void {
  if (route.path == "/profile" || route.path == "/waitingroom") {
    coloreScritte.value = "color: black;";
  } else {
    coloreScritte.value = "color: white;";
  }
}

if (onlineSocketStore.socket == null) {
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

onlineSocketStore.socket?.on("gameRoomReady", (data) => {
  currentUserStore.gameRoomName = data.name;
  currentUserStore.modalOpen = { id: 0, chat: false };
  if (data.p1 == currentUserStore.id) {
    router.push(`/game?player=1`);
  } else if (data.p2 == currentUserStore.id) {
    router.push(`/game?player=2`);
  }
});

onlineSocketStore.socket?.on("challenged", (data: any) => {
  const resp = confirm(
    `user ${onlineUsersStore.getNickFromId(data.id)?.nickName} challenged you`
  );
  if (resp) {
    onlineSocketStore.socket?.emit("challengeAccepted", {
      otherId: data.id,
    });
  } else {
    onlineSocketStore.socket?.emit("challengeDeclined", {
      otherId: data.id,
    });
  }
});

onlineSocketStore.socket?.on("nickChanged", (data) => {
  if (currentUserStore.friends.includes(data.id)) {
    const idx = currentUserStore.friends.indexOf(data.id);
    currentUserStore.friends.splice(idx, 1);
    currentUserStore.friends.push(data.id);
  }
  conversationsStore.updateConvNick(data.id, data.newNick);
});
if (!conversationsStore.fetched) {
  onlineSocketStore.socket?.emit("getMyPrivMsgs");
  conversationsStore.fetched = true;
}

onlineSocketStore.socket?.on("yourPrivmsg", async (data: Message[]) => {
  await data.map(async (msg: Message) => {
    if (msg.senderId != currentUserStore.id) {
      const conv = conversationsStore.getOrCreateConvWithUsr(msg.senderId);
      conv.nick = msg.fromNick;
      conv.messages.push(msg);
    } else {
      const conv = conversationsStore.getOrCreateConvWithUsr(msg.receiverId);
      conv.messages.push(msg);
      conv.nick = msg.toNick;
    }
  });
  conversationsStore.checkIfUpdated(currentUserStore.lastOnline);
});
onlineSocketStore.socket?.on("privmsg", (msg) => {
  if (msg.success == false) {
  } else {
    if (msg.senderId != currentUserStore.id) {
      const conv = conversationsStore.getOrCreateConvWithUsr(msg.senderId);
      if (currentUserStore.modalOpen.id != conv.id) {
        conv.updated = true;
      }
      conv.nick = msg.fromNick;
      conv.messages.push(msg);
    } else {
      const conv = conversationsStore.getOrCreateConvWithUsr(msg.receiverId);
      conv.nick = msg.toNick;
      conv.messages.push(msg);
    }
  }
});

const openModalAndSetRead = (id: number) => {
  currentUserStore.setModal(id, true);
  const conv = conversationsStore.conversations.find((conv) => conv.id == id);
  if (conv && conv.updated) {
    conv.updated = false;
  }
};

onMounted(async () => {
  friends.value = await currentUserStore.getFriends();
  (route: RouteLocationNormalized) => checkPage(route);
}),
  watchEffect(async () => {
    friends.value = await currentUserStore.getFriends();
  });
watch(
  () => router.currentRoute.value,
  (route: RouteLocationNormalized) => {
    checkPage(route);
  }
);
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/varino");
.online {
  font-family: "Varino", sans-serif;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 40px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  margin: auto;
  height: 100%;
  width: 100%;
  top: 0%;
  right: 0%;
  width: 20vw;
  height: 100vh;
  color: white;
  position: fixed;
  display: none;
}
.title {
  margin-left: 2vw;
  font-size: calc((3vw + 1vh) / 2);
  margin-top: 2vh;
  color: white;
}
.user {
  margin-left: 2vw;
  margin-top: 2%;
  z-index: 6;
}

.user:first-of-type {
  margin-top: 2vh;
}

.show {
  display: block;
  width: calc((4vw + 5vh) / 2);
  height: calc((4vw + 5vh) / 2);
  border-radius: 40px;
  background-image: url("../../public/gif/show.svg");
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 100;
  position: fixed;
  top: 1vh;
  left: 95vw;
}
</style>
