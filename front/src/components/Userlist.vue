<template>
  <div class="body">
    <button class="home" @click="() => router.push('/welcome')"></button>
    <div class="barra">
      <h1>LISTA UTENTI</h1>
    </div>
    <div class="container">
      <div v-for="user in listaUtenti" :key="user.id" style="margin-bottom: 10px;">
        <Usercard
          :user="user"
          v-if="user.id != currentUserStore.id"
          :quarantadue="false"
        />
      </div>
    </div>
    <div class="footer">
      <p style="font-size: small;">by the soviet Ⓒ</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from "../utils/currentUserStore";
import axios from "axios";
import { Ref, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Usercard from "./Usercard.vue";
import { UserForList } from "../utils/interfaces";
const currentUserStore = useCurrentUserStore();
const listaUtenti: Ref<UserForList[]> = ref([]);
const firenzeUsers = ref([]);
const router = useRouter();

const getUserList = async () => {
  try {
    const data = await currentUserStore.getUserList();
    listaUtenti.value = data;
  } catch (error) {
    router.push("/");
  }
};

const getQuarantadueFirenzeUsers = async () => {
  const url =
    import.meta.env.VITE_BACK_BASE_URL + `/api42/${currentUserStore.uid}`;
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${currentUserStore.currentToken}`,
      },
    })
    .then((userData) => {
      firenzeUsers.value = userData.data;
    })
    .catch((error) => console.log("error", error));
};

onMounted(() => {
  getUserList();
  if (currentUserStore.uid != null) {
    getQuarantadueFirenzeUsers();
  }
  if (!currentUserStore.authenticated) {
    router.push("/");
  }
});
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/varino");

.body {
  background-image: url("https://i.gifer.com/BdRg.gif");
  background-repeat: no-repeat;
  position: fixed;
  top: 0%;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  color: white;
}

.footer {
  position: fixed;
  height: 5vh;
  bottom: 0;
  left: 1vh;
  font-family: "Varino", sans-serif;
  color: #ffffff;
  font-size: smaller;
}
.scheda {
  border: 1px solid black;
  width: 250px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
  margin: 10px;
}

.home {
  background-image: url("https://static.vecteezy.com/system/resources/previews/008/527/647/original/green-neon-house-icon-with-door-roof-and-chimney-on-a-black-background-illustration-vector.jpg");
  background-repeat: no-repeat;
  background-size: contain;
  width: calc((4vw + 5vh) / 2);
  height: calc((4vw + 5vh) / 2);
  border-radius: 40px;
  position: fixed;
  top: 1%;
  left: 1%;
  z-index: 10;
}
.scheda:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
img {
  width: 250px;
  border-radius: 5px 5px 0 0;
}

h4 {
  font-family: "Varino", sans-serif;
  text-align: center;
  font-size: 20px;
}

.data {
  font-family: "Varino", sans-serif;
  padding: 10px;
}

p {
  font-family: "Varino", sans-serif;
  font-size: 10px;
}

span {
  font-family: "Varino", sans-serif;
  font-weight: bold;
}

.container {
  font-family: "Varino", sans-serif;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.barra {
  text-align: center;
  padding: 10px;
  font-family: "Varino", sans-serif;
}

.barra > h1 {
  font-family: "Varino", sans-serif;
  font-size: 30px;
}
</style>
