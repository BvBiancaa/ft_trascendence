<template>
  <div class="chatroom">
    <div class="room">
      <h1>
        current channel: {{ currentChan?.name }}
        <button
          v-if="
            currentChan?.ops.findIndex((op) => op.id == currentUserStore.id) !=
            -1
          "
          @click="changeChanSettingsModal(props.chan)"
        >
          settings
        </button>
      </h1>
      <div class="messages">
        <ul>
          <li v-for="message in currentChan?.messages" :key="message.timestamp">
            &lt;{{ message.timestamp }}&gt; {{ message.user }} :
            {{ message.msg }}
          </li>
        </ul>
      </div>
      <form @submit.prevent="sendMsg">
        <label>msg:</label>
        <input v-model="msg" type="text" />
        <button type="submit">send</button>
      </form>
    </div>
    <div class="users">
      <p>users</p>
      <ul>
        <li v-for="user in currentChan?.users" :key="user.id">
          <span v-if="currentChan?.ops.find((usr) => usr.id == user.id)"
            >@</span
          >
          {{ user.nickName }}
          <button
            v-if="
              currentChan?.ops.find((user) => user.id == currentUserStore.id) &&
              user.id != currentUserStore.id &&
              !currentChan.ops.find((op) => op.id == user.id)
            "
            @click="() => kickUsr(user.id)"
          >
            K
          </button>
          <button
            v-if="
              currentChan?.ops.find((user) => user.id == currentUserStore.id) &&
              user.id != currentUserStore.id &&
              !currentChan.ops.find((op) => op.id == user.id)
            "
            @click="() => opUsr(user.id)"
          >
            +O
          </button>
          <button
            v-if="
              currentChan?.ops.find((user) => user.id == currentUserStore.id) &&
              user.id != currentUserStore.id &&
              currentChan.ops.find((op) => op.id == user.id)
            "
            @click="() => deOpUsr(user.id)"
          >
            -O
          </button>
          <button
            v-if="
              currentChan?.ops.find((user) => user.id == currentUserStore.id) &&
              user.id != currentUserStore.id &&
              !currentChan.ops.find((op) => op.id == user.id)
            "
            @click="() => banUsr(user.id)"
          >
            BAN
          </button>
          <button
            v-if="
              currentChan?.ops.find((user) => user.id == currentUserStore.id) &&
              user.id != currentUserStore.id &&
              !currentChan.ops.find((op) => op.id == user.id) &&
              !currentChan.mutedUsers.find((muted) => muted.id == user.id)
            "
            @click="() => muteUsr(user.id)"
          >
            MUTE
          </button>
          <button @click="currentUserStore.setModal(user.id)">profile</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Ref } from "vue";
import { useCurrentUserStore } from "../utils/currentUserStore";
import { JoinedChan, ChanMessage } from "../utils/interfaces";
import { useJoinedChansStore } from "../utils/joinedChanStore";
import { useOnlineSocketStore } from "../utils/onlineSocketStore";

const props = defineProps<{
  chan: string;
}>();

const msg: Ref<string> = ref("");
const joinedChansStore = useJoinedChansStore();
const socket = useOnlineSocketStore().socket;
const currentChan: Ref<JoinedChan | undefined> = ref(
  joinedChansStore.getChan(props.chan)
);
const currentUserStore = useCurrentUserStore();

const changeChanSettingsModal = (chan: string) => {
  currentUserStore.setChanModal(chan);
};

const banUsr = (id: number) => {
  socket?.emit("banUsr", {
    name: props.chan,
    user: id,
    from: currentUserStore.id,
  });
};

const sendMsg = () => {
  if (msg.value != "") {
    if (socket != null) {
      const newMsg: ChanMessage = {
        chan: props.chan,
        msg: msg.value,
        timestamp: Date.now().toLocaleString(),
      };
      socket.emit("chanMsg", newMsg);
      msg.value = "";
    }
  }
};

const kickUsr = (id: number) => {
  socket?.emit("kickUsr", {
    name: currentChan.value?.name,
    user: id,
    from: currentUserStore.id,
  });
};

const opUsr = (id: number) => {
  socket?.emit("opUsr", {
    name: currentChan.value?.name,
    user: id,
    from: currentUserStore.id,
  });
};

const deOpUsr = (id: number) => {
  socket?.emit("deOpUsr", {
    name: currentChan.value?.name,
    user: id,
    from: currentUserStore.id,
  });
};

const muteUsr = (id: number) => {
  const time = prompt("how long? (in seconds)");
  socket?.emit("muteUsr", {
    name: currentChan.value?.name,
    user: id,
    from: currentUserStore.id,
    time: time,
  });
};

watch(props, (prop) => {
  currentChan.value = joinedChansStore.getChan(prop.chan);
});
</script>

<style scoped>
.messages {
  border: 1px solid black;
  height: 590px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.room {
  height: 600px;
  width: 800px;
  display: flex;
  flex-direction: column;
}

.chatroom {
  display: flex;
  border: 1px solid black;
}

.users {
  width: 200px;
  border: 1px solid black;
}

input {
  width: 600px;
}

li {
  text-decoration: none;
  margin-top: auto;
}

ul {
  display: flex;
  justify-content: end;
  flex-direction: column-reverse;
}
</style>
