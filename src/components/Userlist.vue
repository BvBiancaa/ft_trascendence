<template>
  <div class="barra">
    <h1>LISTA UTENTI</h1>
  </div>
  <div class="container">
    <div v-for="user in listaUtenti" :key="user.id">
      <Usercard :user="user" />
    </div>
  </div>
  <div class="barra">
    <h1>UTENTI ONLINE A FIRENZE</h1>
  </div>
  <div class="container">
    <div v-for="user in firenzeUsers" :key="user.id">
      <div v-if="user">
        <Usercard :user="user" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from "../utils/authStore";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Usercard from "./Usercard.vue";
const currentUserStore = useCurrentUserStore();
const listaUtenti = ref();
const firenzeUsers = ref([]);
const router = useRouter();

const getUserList = async () => {
  const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getusers/`;
  axios
    .get(url, {
      headers: { Authorization: `Bearer ${currentUserStore.currentToken}` },
    })
    .then((data) => (listaUtenti.value = data.data))
    .catch(() => router.push("/"));
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
  getQuarantadueFirenzeUsers();
});
</script>

<style scoped>
.scheda {
  border: 1px solid black;
  width: 250px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
  margin: 10px;
}
.scheda:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
img {
  width: 250px;
  border-radius: 5px 5px 0 0;
}
h4 {
  text-align: center;
  font-size: 20px;
}

.data {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  padding: 10px;
}

p {
  font-size: 10px;
}

span {
  font-weight: bold;
}

.container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.barra {
  margin-top: 20px;
  text-align: center;
  padding: 10px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.barra > h1 {
  font-size: 20px;
}
</style>
