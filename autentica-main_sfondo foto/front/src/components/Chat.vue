<template>
  <div class="chat">
    <div class="chatContainer">
      <div class="messagesContainer">
        <div v-for="message in messages">
          [{{ message.name }}]: {{ message.text }}
        </div>
      </div>
      <div v-if="typingDisplay">{{ typingDisplay }}</div>
      <div class="messageInput">
        <form @submit.prevent="sendMessage">
          <label>message:</label>
          <input v-model="messageText" type="text" @input="emitTyping" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import { onBeforeMount, ref } from "vue";
import { Ref } from "vue";
import { useCurrentUserStore } from "../utils/authStore";
import { useRouter } from "vue-router";

interface Message {
  text: string;
  name: string;
}

const socket = io(import.meta.env.VITE_BACK_BASE_URL);

const messages: Ref<Message[]> = ref([]);
const messageText: Ref<string> = ref("");
const typingDisplay: Ref<string> = ref("");
const currentUserStore = useCurrentUserStore();
const router = useRouter();

onBeforeMount(() => {
  if (!currentUserStore.authenticated) {
    socket.disconnect();
    router.push("/");
  }
  socket.emit("findAllMessages", {}, (response: any) => {
    messages.value = response;
  });
  socket.on("message", (message) => {
    messages.value.push(message);
  });
  socket.on("typing", ({ isTyping }) => {
    if (isTyping) {
      typingDisplay.value = `${currentUserStore.name} is typing...`;
    } else {
      typingDisplay.value = "";
    }
  });
  join();
});

const sendMessage = () => {
  socket.emit("createMessage", { text: messageText.value }, () => {
    messageText.value = "";
  });
};

const join = () => {
  socket.emit("join", { name: currentUserStore.name });
};

const emitTyping = () => {
  socket.emit("typing", { isTyping: true });
  setTimeout(() => {
    socket.emit("typing", { isTyping: false });
  }, 2000);
};
</script>
<style scoped></style>
