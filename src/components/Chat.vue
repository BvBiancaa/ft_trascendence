<template>
  <div class="container">
    <div class="canali">
      <h3>Canali:</h3>
      <div
        v-for="channel in joinedChansStore.joinedChans"
        :key="channel.name"
        class="channels"
      >
        <p class="boldit" @click="() => changeChan(channel.name)">
          #{{ channel.name }}
        </p>
        <button @click="() => leaveChan(channel.name)">x</button>
      </div>
    </div>

    <div class="chat">
      <Chatroom v-if="currentChan.length > 0" :chan="currentChan" />
      <Chanlist v-else :chanList="channelsAll" @changeChan="joinFromOutside" />
      <form @submit.prevent="joinChan">
        <label>join:</label>
        <input v-model="chanName" type="text" />
        <button type="submit">join</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJoinedChansStore, useOnlineSocketStore } from "../utils/authStore";
import { onBeforeMount, ref } from "vue";
import { Ref } from "vue";
import { useCurrentUserStore } from "../utils/authStore";
import { useRouter } from "vue-router";
import Chatroom from "./Chatroom.vue";
import Chanlist from "./Chanlist.vue";
import {
  OnlineUser,
  ChannelFromOutside,
  JoinedChan,
  Message,
} from "../utils/interfaces";

const chanName: Ref<string> = ref("");
const channelsAll: Ref<ChannelFromOutside[]> = ref([]);
const joinedChansStore = useJoinedChansStore();
const currentChan: Ref<string> = ref("");
const currentUserStore = useCurrentUserStore();
const router = useRouter();
const socket = useOnlineSocketStore().socket;

onBeforeMount(() => {
  if (socket != null) {
    if (!currentUserStore.authenticated) {
      socket.disconnect();
      router.push("/");
    }
    socket.emit("chanlist", (response: any) => (channelsAll.value = response));
    if (!currentUserStore.listenersActive) {
      socket.on("chanlist", (response: any) => (channelsAll.value = response));
      socket.on("joinedChannels", (response: JoinedChan[]) => {
        joinedChansStore.setChans(response);
      });
      socket.on(
        "userlist",
        (response: { name: string; list: OnlineUser[]; ops: OnlineUser[] }) => {
          updateChanList(response.name, response.list, response.ops);
        }
      );
      socket.on("chanMsg", (response: Message) => {
        joinedChansStore.addMsg(response);
      });
      socket.on("kicked", (data) => {
        const chan = joinedChansStore.getChan(data.chan);
        const kicker = chan?.ops.find((usr) => usr.id == data.from)?.nickName;
        alert(`sei stato kickato dal canale ${data.chan} da ${kicker}`);
        const idx = joinedChansStore.joinedChans.findIndex(
          (chan) => chan.name == data.chan
        );
        joinedChansStore.joinedChans.splice(idx, 1);
        currentChan.value = "";
      });
      currentUserStore.listenersActive = true;
    }
  }
  if (!currentUserStore.authenticated) {
    router.push("/");
  }
});

const joinChan = () => {
  if (socket != null && !joinedChansStore.getChan(chanName.value)) {
    socket.emit("join", chanName.value);
  }
  chanName.value = "";
};

const leaveChan = (chan: string) => {
  setChan("");
  if (socket != null) {
    socket.emit("leave", chan);
  }
};

const updateChanList = (
  name: string,
  list: OnlineUser[],
  ops: OnlineUser[]
) => {
  joinedChansStore.setUsrList(name, list, ops);
};

const setChan = (name: string) => {
  if (joinedChansStore.getChan(name) || name == "") {
    currentChan.value = name;
  }
};

const changeChan = (name: string) => {
  if (
    joinedChansStore.getChan(name) != undefined &&
    currentChan.value != name
  ) {
    setChan(name);
  } else {
    setChan("");
  }
};

const joinFromOutside = (chan: string) => {
  if (joinedChansStore.getChan(chan) != undefined) {
    setChan(chan);
  } else {
    chanName.value = chan;
    joinChan();
    setChan(chan);
  }
};
</script>
<style scoped>
.canali {
  border: 1px solid black;
  width: 200px;
  display: flex;
  flex-direction: column;
}
.boldit {
  font-weight: bold;
}

.container {
  display: flex;
}

.channels {
  display: flex;
}
</style>
