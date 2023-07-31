<template>
  <div class="modal">
    <div class="modal-content">
      <div class="top">
        <h1>#{{ currentUserStore.chanSettingsModal }} settings</h1>
        <span class="close" @click="currentUserStore.setChanModal('')"
          >&times;</span
        >
      </div>
      <br>
      <br>
      <div class="settings">
        <h3>Settings</h3>
        <br>
        <br>
        <div>
          <label for="private">private: </label>
          <button v-if="!chan?.isPrivate" @click="setRoomPrivate">
            make room private
          </button>
          <button v-else @click="setRoomPublic">make room public</button>
        </div>
        <div>
          <br>
        <br>
          <label for="password">password:</label>
          <input type="text" v-model="pwd" />
          <button v-if="chan?.isProtected" @click="setRoomPassword">
            change password
          </button>
          <button v-if="chan?.isProtected" @click="unsetRoomPassword">
            remove pwd
          </button>
          <button v-else @click="setRoomPassword">set password</button>
        </div>

        <div v-if="chan?.bannedUsers && chan?.bannedUsers.length > 0">
          <h4>utenti bannati :</h4>
          <div v-for="item in chan.bannedUsers" :key="item.id">
            {{ item.nickName }}
            <button @click="unBanUsr(item.id)">unban</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { useCurrentUserStore } from "../utils/currentUserStore";
import { useJoinedChansStore } from "../utils/joinedChanStore";
import { useOnlineSocketStore } from "../utils/onlineSocketStore";

const currentUserStore = useCurrentUserStore();
const joinedChansStore = useJoinedChansStore();
const socket = useOnlineSocketStore().socket;

const pwd: Ref<string> = ref("");

const chan = joinedChansStore.getChan(currentUserStore.chanSettingsModal);

const unBanUsr = (id: number) => {
  if (chan) {
    if (chan.ops.find((usr) => usr.id == currentUserStore.id)) {
      socket?.emit("unBanUsr", {
        name: currentUserStore.chanSettingsModal,
        user: id,
        from: currentUserStore.id,
      });
    }
  }
};

const setRoomPrivate = () => {
  if (chan && !chan.isPrivate) {
    socket?.emit("setRoomPrivate", {
      chan: chan.name,
    });
  }
};

const setRoomPublic = () => {
  if (chan && chan.isPrivate) {
    socket?.emit("setRoomPublic", {
      chan: chan.name,
    });
  }
};

const setRoomPassword = () => {
  if (chan && pwd.value.length > 0) {
    socket?.emit("setRoomPassword", {
      chan: chan.name,
      newpwd: pwd.value,
    });
  }
  pwd.value = "";
};

const unsetRoomPassword = () => {
  if (chan && chan.isProtected)
    socket?.emit("unsetRoomPassword", {
      chan: chan.name,
    });
};
</script>

<style scoped>

@import url("https://fonts.cdnfonts.com/css/varino");

button,
input
{
  font-family: "Varino", sans-serif;
}
.modal {
  font-family: "Varino", sans-serif;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.modal-content {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.473),
    rgba(56, 110, 68, 0.562)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
