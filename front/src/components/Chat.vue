<template>
  <div class="body">
    <div class="container">
      <button class="home" @click="() => router.push('/welcome')"></button>
      <div class="canali">
        <div
          v-for="channel in joinedChansStore.joinedChans"
          :key="channel.name"
          class="channels"
        >
          <p class="boldit" @click="() => changeChan(channel.name)">
            #{{ channel.name }}
          </p>
          <img class="leave" @click="() => leaveChan(channel.name)" />
        </div>
      </div>

      <div class="chat">
        <form class="joinchn" @submit.prevent="joinChan">
          <input
            class="custom-input"
            v-model="chanName"
            type="text"
            maxlength="20"
          />
          <button class="joinbtn" type="submit"></button>
        </form>
        <Chatroom
          v-if="currentChan.length > 0 && !currentChan.includes('privmsg')"
          :chan="currentChan"
        />
        <Chanlist
          v-else-if="!currentChan.includes('privmsg')"
          :chanList="channelsAll"
          @changeChan="joinFromOutside"
        />
      </div>
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
import { Input } from "phaser";

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
      socket.on("chanlist", (response: any) => {
        channelsAll.value = response;
      });
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
      socket.on("chanIsNowProtected", (data) => {
        const chan = joinedChansStore.getChan(data);
        if (chan) {
          chan.isProtected = true;
        }
      });
      socket.on("youreMuted", (data: any) => {
        alert(`Can not send msg to chan ${data.chan} cause you are muted!`);
      });
      socket.on("chanIsProtected", (data) => {
        const pwd = prompt(`chan ${data.chan} is protected, insert password`);
        socket.emit("joinProtected", {
          chan: data.chan,
          password: pwd,
        });
      });
      socket.on("invalidPwd", (data) => {
        alert(`wrong password for chan ${data.chan}, try again!`);
      });
      currentUserStore.listenersActive = true;
    }
  }
  if (!currentUserStore.authenticated) {
    router.push("/");
  }
});

const joinChan = () => {
  if (chanName.value != "") {
    if (socket != null && !joinedChansStore.getChan(chanName.value)) {
      socket.emit("join", chanName.value);
    }
    chanName.value = "";
  }
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
    currentChan.value == name
  ) {
    setChan("");
  } else {
    setChan(name);
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
  border-right: 1px solid black;
  width: 13%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home {
  background-image: url("https://static.vecteezy.com/system/resources/previews/008/527/647/original/green-neon-house-icon-with-door-roof-and-chimney-on-a-black-background-illustration-vector.jpg");
  background-repeat: no-repeat;
  background-size: contain;
  width: calc((4vw + 5vh) / 2);
  height: calc((4vw + 5vh) / 2);
  border-radius: 40px;
  border-color: black;
  position: fixed;
  top: 1%;
  left: 1%;
  z-index: 10;
  overflow: hidden;
  color: white;
}
.boldit,
.leave {
  font-weight: bold;
  font-size: calc((1vh + 1vw) / 2);
  margin-top: 20px;
  color: white;
}

.joinbtn {
  background-image: url("../../public/gif/join.svg");
  background-repeat: no-repeat;
  background-size: 2vw 2vh;
  background-color: transparent;
  width: 2vw;
  height: 2vh;
  border: none;
}


.custom-input {
  width: 10vw;
  font-family: "Varino", sans-serif;
}
.boldit:hover {
  color: rgb(94, 190, 94);
}

.container {
  position: fixed;
  display: flex;
  overflow: hidden;
  bottom: 0%;
  height: 92vh;
  font-family: "Varino", sans-serif;
}

.channels {
  display: flex;
  overflow: hidden;
}

.joinchn {
  position: fixed;
  left: 0vw;
  top: 95vh;
}

.chat {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://cdn.akamai.steamstatic.com/steam/apps/1054690/extras/coop_endless_patch_08.gif?t=1606389606");
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
  overflow: hidden;
}
.leave {
  margin-left: 1vw;
  background-image: url("../../public/gif/leave.svg");
  background-size: cover;
  background-repeat: no-repeat;
  border: none;
  background-color: transparent;
  width: calc((1.5vh + 1.5vw) / 2);
  height: calc((1.5vh + 1.5vw) / 2);
}
</style>
