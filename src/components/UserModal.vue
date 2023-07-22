<template>
  <div class="modal">
    <div class="modal-content">
      <div class="userdata">
        <div>
          <img :src="otherUser.image" class="avatar" />
          <button
            v-if="!currentUserStore.friends.includes(otherUser.id)"
            @click="() => currentUserStore.addFriend(otherUser.id)"
          >
            add friend
          </button>
          <button
            v-else
            @click="() => currentUserStore.removeFriend(otherUser.id)"
          >
            remove friend
          </button>
          <button
            v-if="!currentUserStore.blockedUsrs.includes(otherUser.id)"
            @click="() => currentUserStore.blockUsr(otherUser.id)"
          >
            block
          </button>
          <button
            v-else
            @click="() => currentUserStore.unblockUsr(otherUser.id)"
          >
            unblock
          </button>
        </div>
        <h2>{{ otherUser.nick }}</h2>
        <span class="close" @click="closeModal">&times;</span>
      </div>
      <div class="userstats">
        <h4><span>game played:</span>{{ otherUser.gamePlayed }}</h4>
        <h4><span>game wins:</span>{{ otherUser.wins }}</h4>
        <h4><span>game loss:</span>{{ otherUser.loses }}</h4>
        <h4><span>current elo:</span>{{ otherUser.elo }}</h4>
      </div>
      <div class="messages">
        <div v-for="message in messages">
          [{{ getDate(message.createdAt) }}]
          <span v-if="message.senderId != currentUserStore.id"
            >[{{ otherUser.nick }}]</span
          >
          <span v-else>[{{ currentUserStore.nickName }}]</span>
          {{ message.content }}
        </div>
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
import { useCurrentUserStore } from "../utils/currentUserStore";
import { useOnlineSocketStore } from "../utils/onlineSocketStore";
import { UserForModal } from "../utils/interfaces";
import { getDate } from "../utils/utils";
import { Ref, ref, onMounted } from "vue";
import { useConversationsStore } from "../utils/conversationsStore";
import { Message } from "../utils/interfaces";

const socket = useOnlineSocketStore().socket;
const currentUserStore = useCurrentUserStore();
const conversationsStore = useConversationsStore();
const closeModal = () => {
  currentUserStore.setModal(0);
};

const messages: Ref<Message[] | []> = ref(
  conversationsStore.getMsgsWithUsr(currentUserStore.modalOpen)
);

const msg = ref("");

const otherUser: Ref<UserForModal> = ref({
  nick: "",
  image: "",
  wins: 0,
  loses: 0,
  elo: 0,
  gamePlayed: 0,
  id: 0,
});

const sendMsg = async () => {
  if (msg.value != "") {
    if (socket != null) {
      if (
        (await currentUserStore.amIBlockedBy(currentUserStore.modalOpen)) ==
        true
      ) {
        alert("user blocked you, message ignored!");
        msg.value = "";
        return;
      }
      const newMsg = {
        receiverId: currentUserStore.modalOpen,
        senderId: currentUserStore.id,
        content: msg.value,
        fromNick: currentUserStore.nickName,
      };
      socket.emit("privMsg", newMsg);
      msg.value = "";
    }
  }
};

const getOtherUser = async () => {
  const { nick, image, wins, loses, elo, gamePlayed, id } =
    await currentUserStore.getOtherUserDetails(currentUserStore.modalOpen);
  otherUser.value.nick = nick;
  otherUser.value.image = image;
  otherUser.value.wins = wins;
  otherUser.value.loses = loses;
  otherUser.value.elo = elo;
  otherUser.value.gamePlayed = gamePlayed;
  otherUser.value.id = id;
};

onMounted(() => {
  getOtherUser();
});
</script>

<style scoped>
.messages {
  margin-top: 10px;
}

.avatar {
  border-radius: 50%;
  border: 1px solid black;
  width: 50px;
  height: 50px;
}

form {
  margin-top: 15px;
}

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

.userdata {
  display: flex;

  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.userstats {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid black;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
