<template>
  <div class="modal">
    <div class="modal-content">
      <div class="top">
        <h1># {{ currentUserStore.chanSettingsModal }}settings</h1>
        <span class="close" @click="currentUserStore.setChanModal('')"
          >&times;</span
        >
      </div>
      <div class="settings">
        <h3>Settings</h3>
        <div>
          <label for="private">private: </label>
          <button v-if="!chan?.isPrivate" @click="setRoomPrivate">
            make room private
          </button>
          <button v-else @click="setRoomPublic">make room public</button>
        </div>
        <div><label for="password">password:</label> <input type="text" /></div>

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
import { useCurrentUserStore } from "../utils/currentUserStore";
import { useJoinedChansStore } from "../utils/joinedChanStore";
import { useOnlineSocketStore } from "../utils/onlineSocketStore";

const currentUserStore = useCurrentUserStore();
const joinedChansStore = useJoinedChansStore();
const socket = useOnlineSocketStore().socket;

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
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  background-color: #fefefe;
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
