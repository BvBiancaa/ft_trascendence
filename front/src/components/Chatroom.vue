<template>
  <div class="chatroom">
    <div class="body">
      <div class="room">
        <h1>
          Current Channel: {{ currentChan?.name }}
          <button
            class="sett"
            v-if="
              currentChan?.ops.findIndex(
                (op) => op.id == currentUserStore.id
              ) != -1
            "
            @click="changeChanSettingsModal(props.chan)"
          ></button>
        </h1>
        <div class="messages">
          <ul>
            <span
              v-for="message in currentChan?.messages"
              :key="message.timestamp.getUTCMilliseconds"
            >
              <li
                v-if="
                  currentUserStore.blockedUsrs.includes(message.senderId) ==
                  false
                "
              >
                &lt;{{ getDate(message.timestamp.toString()) }}&gt;
                {{ message.user }} : {{ message.msg }}
              </li>
            </span>
          </ul>
        </div>
        <form class="sendbox" @submit.prevent="sendMsg">
          <label class="sms">Message:</label>
          <input
            class="sms2"
            v-model="msg"
            type="text"
            placeholder="Type a message…"
          />
          <button type="submit"></button>
        </form>
      </div>
      <div class="users">
        <ul>
          <li
            style="margin-bottom: 15px"
            v-for="user in currentChan?.users"
            :key="user.id"
          >
            <div class="bo" @click="currentUserStore.setModal(user.id, true)">
              <span v-if="currentChan?.ops.find((usr) => usr.id == user.id)">
                @
              </span>
              {{ user.nickName }}
            </div>
            <button
              v-if="
                currentChan?.ops.find(
                  (user) => user.id == currentUserStore.id
                ) &&
                user.id != currentUserStore.id &&
                !currentChan.ops.find((op) => op.id == user.id)
              "
              @click="() => kickUsr(user.id)"
            >
              Kick
            </button>
            <button
              v-if="
                currentChan?.ops.find(
                  (user) => user.id == currentUserStore.id
                ) &&
                user.id != currentUserStore.id &&
                !currentChan.ops.find((op) => op.id == user.id)
              "
              @click="() => opUsr(user.id)"
            >
              +Op
            </button>
            <button
              v-if="
                currentChan?.ops.find(
                  (user) => user.id == currentUserStore.id
                ) &&
                user.id != currentUserStore.id &&
                currentChan.ops.find((op) => op.id == user.id) &&
                currentChan.ops.findIndex((op) => op.id == user.id) != 0
              "
              @click="() => deOpUsr(user.id)"
            >
              -Op
            </button>
            <button
              v-if="
                currentChan?.ops.find(
                  (user) => user.id == currentUserStore.id
                ) &&
                user.id != currentUserStore.id &&
                !currentChan.ops.find((op) => op.id == user.id)
              "
              @click="() => banUsr(user.id)"
            >
              BAN
            </button>
            <button
              v-if="
                currentChan?.ops.find(
                  (user) => user.id == currentUserStore.id
                ) &&
                user.id != currentUserStore.id &&
                !currentChan.ops.find((op) => op.id == user.id) &&
                !currentChan.mutedUsers.find((muted) => muted.id == user.id)
              "
              @click="() => muteUsr(user.id)"
            >
              MUTE
            </button>
          </li>
        </ul>
      </div>
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
import { getDate } from "../utils/utils";
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
        timestamp: new Date(),
        senderId: currentUserStore.id,
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
  const time = prompt("How long? (in seconds)");
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
@import url("https://fonts.cdnfonts.com/css/varino");

button {
  background-color: transparent;
  border: none;
  margin-right: 20px;
  color: #fff;
  font-family: "Varino", sans-serif;
  font-size: calc((1vh + 1vw) / 2);
}

button:hover {
  color: rgb(236, 46, 46);
}

input
{
  font-family: "Rubik", sans-serif;
}
.chatroom {
  display: flex;
  left: 100vw;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
  backdrop-filter: blur(10px);
  font-family: "Rubik", sans-serif;
  color: #fff;
}
.room {
  display: flex;
  /*   position: absolute; */
  justify-content: space-between;
  left: 1vw;
  width: 40vw;
  height: 75vh;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #e1f5e22f, #ebebeb);
  box-shadow: 10px 15px 40px rgba(0, 0, 0, 0.2);
}
p {
  padding-left: 5px;
  color: rgb(255, 255, 255);
}
li {
  padding-left: 5px;
  list-style: none;
  color: rgb(255, 255, 255);
}
h1 {
  text-align: center;
  font-size: 24px;
  color: white;
  margin-bottom: 20px;
  font-family: "Varino", sans-serif;
}

input::placeholder {
  font-size: 0.7rem;
  color: rgb(173, 173, 173);
  font-family: "Varino", sans-serif;
}
.sendbox {
  width: 95%;
  top: calc((3vw + 40vh) / 2);
  border-radius: 0 0 1.5rem 1.5rem;
  padding: 0 0.5rem 0.5rem;
}
.sendbox button {
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
  border-radius: 50%;
  cursor: pointer;
}
.sms {
  width: calc((4vw + 4vh) / 2);
  height: calc((4vw + 4vh) / 2);
  font-family: "Varino", sans-serif;
  font-size: 12px;
}
.sms2 {
  left: 10px;
  width: 60%;
  height: calc((4vw + 4vh) / 2);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.messages {
  max-height: 80%;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.users {
  font-family: "Varino", sans-serif;
  position: absolute;
  top: 12vh;
  left: 2vw;
}

.bo:hover {
  color: #b9d12f;
}
.sett {
  background-image: url("../../public/gif/hdots.svg");
  background-repeat: no-repeat;
  background-size: 3vw 3vh;
  background-color: transparent;
  width: 3vw;
  height: 3vh;
  position: absolute;
  border: none;
}
</style>
