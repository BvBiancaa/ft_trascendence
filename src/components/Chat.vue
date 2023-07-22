<template>
  <div class="container">
    <div class="canali">
      <h3>Joined Chans</h3>
      <div
        v-for="channel in joinedChansStore.joinedChans"
        :key="channel.name"
        class="channels"
      >
        <p class="boldit">#{{ channel.name }}</p>
        <button @click="() => leaveChan(channel.name)">leave</button>
        <button
          v-if="channel.name != currentChan"
          @click="() => changeChan(channel.name)"
        >
          open
        </button>
        <button v-else @click="() => changeChan('')">hide</button>
      </div>
    </div>

    <div class="chat">
      <Chatroom
        v-if="currentChan.length > 0 && !currentChan.includes('privmsg')"
        :chan="currentChan"
      />
      <Chanlist
        v-else-if="!currentChan.includes('privmsg')"
        :chanList="channelsAll"
        @changeChan="joinFromOutside"
      />
      <form @submit.prevent="joinChan">
        <label>join or create:</label>
        <input v-model="chanName" type="text" />
        <button type="submit">join</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOnlineSocketStore } from "../utils/onlineSocketStore";
import { useJoinedChansStore } from "../utils/joinedChanStore";
import { onBeforeMount, ref } from "vue";
import { Ref } from "vue";
import { useCurrentUserStore } from "../utils/currentUserStore";
import { useRouter } from "vue-router";
import Chatroom from "./Chatroom.vue";
import Chanlist from "./Chanlist.vue";
import {
  OnlineUser,
  ChannelFromOutside,
  JoinedChan,
  ChanMessage,
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
        (response: {
          name: string;
          list: OnlineUser[];
          ops: OnlineUser[];
          banned: OnlineUser[];
          muted: OnlineUser[];
        }) => {
          updateChanList(
            response.name,
            response.list,
            response.ops,
            response.banned,
            response.muted
          );
        }
      );
      socket.on("chanMsg", (response: ChanMessage) => {
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
      socket.on("banned", (data) => {
        const chan = joinedChansStore.getChan(data.chan);
        const banner = chan?.ops.find((usr) => usr.id == data.from)?.nickName;
        alert(`sei stato bannato dal canale ${data.chan} da ${banner}`);
        const idx = joinedChansStore.joinedChans.findIndex(
          (chan) => chan.name == data.chan
        );
        joinedChansStore.joinedChans.splice(idx, 1);
        currentChan.value = "";
      });
      socket.on("bannedFromChan", (data) => {
        alert(`can not join chan ${data.chan} because you are banned!`);
      });
      socket.on("chanIsPrivate", (data) => {
        alert(`can not join chan ${data.chan} because is private!`);
      });
      socket.on("madePublic", (data) => {
        const chan = joinedChansStore.getChan(data);
        if (chan) {
          chan.isPrivate = false;
        }
      });
      socket.on("madePrivate", (data) => {
        const chan = joinedChansStore.getChan(data);
        if (chan) {
          chan.isPrivate = true;
        }
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
  ops: OnlineUser[],
  banned: OnlineUser[],
  muted: OnlineUser[]
) => {
  joinedChansStore.setUsrList(name, list, ops, banned, muted);
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
