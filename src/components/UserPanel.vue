<template>
  <div>
    <div class="userPanel">
      <h1>PROFILO UTENTE</h1>
      <p><span>name:</span> {{ currentUserStore.name }}</p>
      <p><span>email:</span> {{ currentUserStore.email }}</p>
      <img :src="currentUserStore.image" alt="" />
      <p><span>login:</span> {{ currentUserStore.login }}</p>
      <p><span>win:</span> {{ currentUserStore.wins }}</p>
      <p><span>loses:</span> {{ currentUserStore.loses }}</p>
      <p><span>elo:</span> {{ currentUserStore.elo }}</p>
      <p><span>game played:</span> {{ currentUserStore.gamePlayed }}</p>
      <p>
        <span>il tuo nickname attuale è:</span> {{ currentUserStore.nickName }}
      </p>
      <form @submit.prevent="changeNick">
        <label>change nickname:</label><br />
        <input v-model="newNick" type="text" />
        <button type="submit">send</button>
      </form>
      <form @submit.prevent="changeImg" enctype="multipart/form-data">
        <label>change profile picture:</label>
        <input type="file" @change="onFileChange" :key="inputReset" />
        <button type="submit">send</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from "../utils/currentUserStore";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useOnlineSocketStore } from "../utils/onlineSocketStore";

const currentUserStore = useCurrentUserStore();
const newNick = ref("");
const router = useRouter();
const selectedFile = ref<File>();
const inputReset = ref(0);
const socket = useOnlineSocketStore().socket;
const onFileChange = (e: any) => {
  if (e.target == null) {
    return;
  }
  const fileSelection = e.target.files[0];
  selectedFile.value = fileSelection;
};

const changeImg = async () => {
  if (selectedFile.value == null) {
    return;
  }
  const formData = new FormData();
  formData.append("file", selectedFile.value, selectedFile.value.name);
  await currentUserStore.changeImg(formData);
  inputReset.value++;
};

const changeNick = async () => {
  const data = {
    nickName: newNick.value,
  };
  try {
    await currentUserStore.updateUserInDb(data);
  } catch (error) {
    alert(`nickname ${newNick.value} gia in uso!`);
    newNick.value = "";
    return;
  }
  if (socket != null) {
    socket.emit("changeNick", newNick.value);
  }
  newNick.value = "";
};

onMounted(() => {
  if (!currentUserStore.authenticated) {
    router.push("/");
  }
});
</script>

<style scoped>
div {
  width: 100%;
}
.userPanel {
  text-align: left;
  margin: 10px auto;
  width: 400px;
  display: flex;
  flex-direction: column;
}
span {
  font-weight: bold;
}
img {
  width: 300px;
}
</style>
../utils/currentUserStore../utils/currentUserStore
