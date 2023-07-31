<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <div class="modal">
    <div class="modal-content">
      <div class="userdata">
        <div>
          <img
            @click="() => backAndCalc()"
            :src="otherUser.image"
            class="avatar"
          />
          <h2 class="name">{{ otherUser.nick }}</h2>
          <div class="buttons" v-if="!currentUserStore.modalOpen.chat">
            <button
              class="chatbtn"
              @click="currentUserStore.modalOpen.chat = true"
            >
              <div class="textchat">chat</div>
            </button>
            <button
              class="add"
              v-if="!currentUserStore.friends.includes(otherUser.id)"
              @click="() => currentUserStore.addFriend(otherUser.id)"
            >
              <div class="textadd">add friend</div>
            </button>
            <button
              class="remove"
              v-else
              @click="() => currentUserStore.removeFriend(otherUser.id)"
            >
              <div class="textremove">remove friend</div>
            </button>
            <button
              class="block"
              v-if="!currentUserStore.blockedUsrs.includes(otherUser.id)"
              @click="() => currentUserStore.blockUsr(otherUser.id)"
            >
              <div class="textblock">block</div>
            </button>
            <button
              class="unblock"
              v-else
              @click="() => currentUserStore.unblockUsr(otherUser.id)"
            >
              <div class="textunblock">unblock</div>
            </button>
            <button @click="challengeUsr" class="challenge">
              <div class="textchallenge">challenge</div>
            </button>
          </div>
          <div class="chat" v-else>
            <div class="maindiv">
              <div class="mobile">
                <div class="profilebox"></div>
                <div class="chatbox" ref="chatboxRef" id="chatBox">
                  <div class="messages">
                    <div v-for="message in messages" class="singleMsg">
                      <img
                        class="imgmsg animated"
                        v-if="message.senderId != currentUserStore.id"
                        :src="otherUser.image"
                      />
                      <span
                        class="eachmessage received animated"
                        v-if="message.senderId != currentUserStore.id"
                      >
                        {{ message.content }}
                        <span style="font-size: 0.7vh"
                          >[{{ getDate(message.createdAt) }}]</span
                        >
                      </span>
                      <span class="eachmessage sent animated" v-else>
                        {{ message.content }}
                        <span style="font-size: 0.7vh"
                          >[{{ getDate(message.createdAt) }}]
                        </span>
                      </span>
                      <img
                        class="imgmsg animated sender"
                        v-if="message.senderId == currentUserStore.id"
                        :src="currentUserStore.image"
                        style="align-self: right"
                      />
                    </div>
                  </div>
                </div>
                <form class="sendbox" @submit.prevent="sendMessage">
                  <input
                    v-model="msg"
                    type="text"
                    placeholder="Type a message…"
                  />
                  <button class="submit">
                    <i aria-hidden="true"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="pie" v-if="!currentUserStore.modalOpen.chat">
          <div id="win"></div>
          <div id="lose"></div>
        </div>
        <span class="close" @click="closeModal">&times;</span>
      </div>
      <div class="userstats" v-if="!currentUserStore.modalOpen.chat">
        <h4><span>game played:</span>{{ userStats.played }}</h4>
        <h4><span>game wins:</span>{{ userStats.won }}</h4>
        <h4><span>game loss:</span>{{ userStats.lost }}</h4>
        <h4><span>current elo:</span>{{ userStats.elo }}</h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from "../utils/currentUserStore";
import { useOnlineSocketStore } from "../utils/onlineSocketStore";
import { UserForModal, UserStats } from "../utils/interfaces";
import { Ref, ref, onMounted, onBeforeMount, watch } from "vue";
import { useConversationsStore } from "../utils/conversationsStore";
import { Message } from "../utils/interfaces";
import { useOnlineUsersStore } from "../utils/onlineUsersStore";
import { getDate } from "../utils/utils";

const socket = useOnlineSocketStore().socket;
const currentUserStore = useCurrentUserStore();
const conversationsStore = useConversationsStore();
const closeModal = () => {
  currentUserStore.setModal(0, false);
};

const onlineUsersStore = useOnlineUsersStore();

const chatboxRef = ref<HTMLDivElement | null>(null);

const messages: Ref<Message[] | []> = ref(
  conversationsStore.getMsgsWithUsr(currentUserStore.modalOpen.id)
);

const backAndCalc = () => {
  currentUserStore.modalOpen.chat = false;
  setTimeout(() => {
    calculate();
  }, 10);
};

const msg = ref("");

const challengeUsr = () => {
  if (currentUserStore.modalOpen.id == currentUserStore.id) {
    alert("can not challenge yourself!");
    return;
  } else if (
    onlineUsersStore.onlineUsers.find(
      (u) => u.id == currentUserStore.modalOpen.id
    )?.playing == false
  ) {
    socket?.emit("challenge", {
      id: currentUserStore.modalOpen.id,
    });
  } else {
    alert("can not challenge, user is already playing");
  }
};

const userStats: Ref<UserStats> = ref({
  played: 0,
  won: 0,
  lost: 0,
  elo: 0,
});

const getOtherUserStats = async () => {
  const userS = await currentUserStore.getOtherUsrStats(
    currentUserStore.modalOpen.id
  );
  return userS;
};

const otherUser: Ref<UserForModal> = ref({
  nick: "",
  image: "",
  wins: 0,
  loses: 0,
  elo: 0,
  gamePlayed: 0,
  id: 0,
});

const getOtherUser = async () => {
  const { nick, image, id } = await currentUserStore.getOtherUserDetails(
    currentUserStore.modalOpen.id
  );
  otherUser.value.nick = nick;
  otherUser.value.image = image;
  otherUser.value.id = id;
};

onBeforeMount(async () => {
  userStats.value = await getOtherUserStats();
  calculate();
});
onMounted(() => {
  getOtherUser();
  setTimeout(() => {
    if (chatboxRef.value)
      chatboxRef.value.scrollTop = chatboxRef.value?.scrollHeight;
  }, 100);
});

function calculate(): void {
  const a: HTMLElement | null = document.querySelector("#win");
  const b: HTMLElement | null = document.querySelector("#lose");
  if (a) {
    const width = (userStats.value.won / userStats.value.played) * 30;
    a.style.width = width.toString() + "vw";
  }
  if (b) {
    if (userStats.value.played == 0) {
      b.style.width = "0";
    } else {
      const width = 30 - (userStats.value.won / userStats.value.played) * 30;
      b.style.width = width.toString() + "vw";
    }
  }
  if (userStats.value.played == 0) {
    if (a) {
      a.style.backgroundColor = "yellow";
      a.style.width = "30vw";
    }
  }
}

const sendMessage = async () => {
  if (msg.value != "") {
    if (socket != null) {
      if (
        (await currentUserStore.amIBlockedBy(currentUserStore.modalOpen.id)) ==
        true
      ) {
        alert("user blocked you, message ignored!");
        msg.value = "";
        return;
      }
      const maxLength = 30;
      let formattedMsg = "";
      for (let i = 0; i < msg.value.length; i += maxLength) {
        const chunk = msg.value.substring(i, i + maxLength);
        formattedMsg += chunk + "\n";
      }
      const newMsg = {
        receiverId: currentUserStore.modalOpen.id,
        senderId: currentUserStore.id,
        content: msg.value,
        fromNick: currentUserStore.nickName,
        toNick: await currentUserStore.getOtherUsrNick(
          currentUserStore.modalOpen.id
        ),
      };
      socket.emit("privMsg", newMsg);

      if (
        conversationsStore.conversations.find(
          (conv) => conv.id == currentUserStore.modalOpen.id
        )
      ) {
        conversationsStore.getOrCreateConvWithUsr(
          currentUserStore.modalOpen.id
        );
      }
      if (messages.value.length == 0) {
        messages.value.push({ createdAt: new Date(), ...newMsg });
      }
      msg.value = "";
    }

    setTimeout(() => {
      if (chatboxRef.value)
        chatboxRef.value.scrollTop = chatboxRef.value?.scrollHeight;
    }, 100);
  }
};

watch(messages.value, () => {
  setTimeout(() => {
    if (chatboxRef.value)
      chatboxRef.value.scrollTop = chatboxRef.value?.scrollHeight;
  }, 100);
});

watch(currentUserStore.modalOpen, () => {
  setTimeout(() => {
    if (chatboxRef.value)
      chatboxRef.value.scrollTop = chatboxRef.value?.scrollHeight;
  }, 10);
});
// submit?.addEventListener("click", sendMessage);
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/varino");

@import url("https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap");

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800&display=swap");
a {
  text-decoration: none;
}

.sender {
  align-self: left;
}

.imgmsg {
  width: calc((3vh + 3vw) / 2);
  height: calc((3vh + 3vw) / 2);
  border-radius: 50%;
  margin-left: 5px;
  margin-right: 5px;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Rubik", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
}
body::before,
body::after {
  content: "";
  height: 90vh;
  width: 33%;
  position: absolute;
  z-index: -10;
}
body::before {
  top: 0;
  left: -5rem;
  border-radius: 0 0 16rem 16rem;
}
body::after {
  bottom: 0;
  right: -5rem;
  border-radius: 16rem 16rem 0 0;
}
.maindiv {
  display: flex;
  align-items: center;
}
.mobile {
  position: fixed;
  top: 0vh;
  left: 0vh;
  width: 85vw;
  overflow: hidden;
  border-radius: 2rem;
  box-shadow: 10px 15px 40px #00000030;
  z-index: 1;
}
.profilebox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
}
.profilebox {
  display: flex;
  align-items: center;
}
.profilebox {
  margin-right: 0.5rem;
}
.eachmessage {
  font-size: calc((1vh + 1vw) / 2);
  width: 20vw;
  padding: 0.5rem;
  margin: 0.2rem 0;
}
.received {
  background: rgba(151, 192, 127, 0.795);
  border: none;
  align-self: flex-end;
  color: #141813;
  border-radius: 0.7rem 0.7rem 0.7rem 0.2rem;
  box-shadow: -1px 2px 2px #00000026;
  transform: translateX(-100px) scale(0.5);
}
.sent {
  background: rgb(229, 245, 226);
  border-width: 1px;
  border: none;
  align-self: flex-end;
  color: #141813;
  border-radius: 0.7rem 0.7rem 0.3rem 0.7rem;
  box-shadow: 1px 2px 2px #0000000f;
  transform: translateX(100px) scale(0.5);
}
.animated {
  transition: 0.3s ease-in-out !important;
  transform: translateX(0px) scale(1) !important;
  opacity: 1 !important;
}

.chatbox {
  margin-top: 50px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  height: calc((35vh + 35vw) / 2);
  overflow-y: scroll;
  z-index: 10;
  -ms-overflow-style: none;
  scrollbar-width: 0px;
  scrollbar-color: transparent;
  scroll-behavior: smooth;
}

.sendbox {
  width: 95%;
  position: fixed;
  top: calc((40vw + 40vh) / 2);
  border-radius: 0 0 1.5rem 1.5rem;
  padding: 0 0.5rem 0.5rem;
}
.sendbox input {
  border: 0;
  outline: 0;
  background: white;
  width: 90%;
  padding: 0.7rem;
  border-radius: 2rem;
  font-size: 0.7rem;
  color: rgb(173, 173, 173);
  height: 2.3rem;
}

input::placeholder {
  font-size: 0.7rem;
  color: rgb(173, 173, 173);
  font-family: "Varino", sans-serif;
}
.sendbox button {
  position: absolute;
  top: 0;
  right: 0.7rem;
  width: calc((4vw + 4vh) / 2);
  height: calc((4vw + 4vh) / 2);
  border: none;
  outline: none;
  background-image: url("../../public/gif/sendbtn.svg");
  background-repeat: no-repeat;
  background-size: calc((3vw + 3vh) / 2);
  background-position: center;
  background-color: #2a8345;
  border-radius: 100%;
  cursor: pointer;
}

@media only screen and (max-width: 850px) {
  .text {
    width: auto;
    margin: 0 1rem 0 3rem;
  }
}
@media only screen and (max-width: 600px) {
  .maindiv {
    flex-direction: column;
    padding: 5rem 0 7rem;
  }
  body::before {
    width: 16rem;
    height: 30rem;
  }
  body::after {
    display: none;
  }
  .mobile {
    margin-bottom: 3rem;
  }
  .text {
    margin: 0 2rem;
    text-align: center;
  }
}

.messages {
  top: calc(4vh + (20vh + 20vw) / 2);
  left: calc((30vw + 30vw) / 2);
}

.block,
.chatbtn,
.remove,
.challenge,
.add,
.unblock {
  background-size: cover;
  height: calc((10vh + 10vw) / 2);
  width: calc((10vh + 10vw) / 2);
  border-radius: 100%;
  margin-left: 3vw;
  margin-right: 3vw;
  border: none;
  top: calc((15vh + 15vw) / 2);
  background-color: transparent;
  position: fixed;
}

.textadd,
.textremove,
.textblock,
.textunblock,
.textchallenge,
.textchat {
  position: fixed;
  top: calc((25vh + 25vw) / 2);
  font-family: "Varino", sans-serif;
}
.remove {
  background-image: url("/gif/removefriend.svg");
  left: calc((30vw + 30vw) / 2 - 15vw);
}

.singleMsg {
  margin-top: 5px;

  display: flex;
  justify-content: center;
}

.remove:hover .textremove {
  display: block;
}

.textremove {
  position: fixed;
  left: calc((30vw + 30vw) / 2 - 15vw);
  display: none;
}

.add {
  left: calc((30vw + 30vw) / 2 - 15vw);
  background-image: url("/gif/addfriend.svg");
}

.add:hover .textadd {
  display: block;
}

.textadd {
  position: fixed;
  left: calc((30vw + 30vw) / 2 - 15vw);
  display: none;
}

.block {
  left: calc((30vw + 30vw) / 2);
  background-image: url("/gif/blockfriend.svg");
}

.block:hover .textblock {
  display: block;
}

.textblock {
  position: fixed;
  left: calc((30vw + 30vw) / 2);
  display: none;
}

.unblock {
  left: calc((30vw + 30vw) / 2);
  background-image: url("/gif/unblock.svg");
}

.unblock:hover .textunblock {
  display: block;
}

.textunblock {
  position: fixed;
  left: calc((30vw + 30vw) / 2);
  display: none;
}

.challenge {
  left: calc(30vw + (30vw + 30vw) / 2);
  background-image: url("/gif/challengefriend.svg");
}

.challenge:hover .textchallenge {
  display: block;
}

.textchallenge {
  position: fixed;
  left: calc(30vw + (30vw + 30vw) / 2);
  display: none;
}

.chatbtn {
  left: calc(15vw + (30vw + 30vw) / 2);
  background-image: url("/gif/privchat.svg");
  background-size: calc((8.8vh + 8.8vw) / 2);
  background-position: center;
  background-repeat: no-repeat;
}

.chatbtn:hover .textchat {
  display: block;
}

.textchat {
  position: fixed;
  left: calc(15vw + (30vw + 30vw) / 2);
  display: none;
}

.avatar {
  z-index: 10;
  position: fixed;
  top: 2vh;
  border-radius: 50%;
  border: 1px solid black;
  width: calc((13vh + 13vw) / 2);
  height: calc((13vh + 13vw) / 2);
}

.pie {
  border-radius: 100px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 10fr;
  position: fixed;
  top: calc((38vh + 33vw) / 2);
  width: calc((40vh + 40vw) / 2);
  left: calc((27vw + 27vw) / 2);
}

#win {
  border-radius: 100px;
  height: 10px;
  background-color: #08f362;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}

#lose {
  border-radius: 100px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  background-color: #af2323;
}

.name {
  position: fixed;
  top: 3vh;
  left: 25vw;
  font-size: calc(calc((3vh + 3vw) / 2));
}

.buttons {
  position: fixed;
  top: calc(4vh + (20vh + 20vw) / 2);
}

form {
  margin-top: 15px;
}

.sendform {
  position: fixed;
  top: calc((40vh + 40vw) / 2);
  left: 35vw;
}
.modal {
  position: fixed;
  z-index: 12;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  overflow: hidden;
  font-family: "Varino", sans-serif;
}

.modal-content {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
  backdrop-filter: blur(10px);
  border-radius: 20px;
  background-repeat: no-repeat;
  background-size: cover;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  position: fixed;
  left: 80vw;
  top: 2vh;
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  z-index: 10;
}

.userdata {
  display: flex;
  height: calc(calc((45vh + 40vw) / 2));
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
  padding-bottom: 10px;
  position: inherit;
  transform: translateY(0vh);
}
</style>
