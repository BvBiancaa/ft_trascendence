<template>
    <div>
        <div>
            <a :href="getUrl()">
            <button class="login">login with 42</button>
            </a>
        </div>
        <button class="login" onclick="toggleForms()">login without 42</button>
        <div id="no42">
            <LoginNo42 />
        </div>
        <div id="register">
            <CreateUsr />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getUrl } from "../utils/42auth";
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useCurrentUserStore } from "../utils/authStore";
import LoginNo42 from "./LoginNo42.vue";
import CreateUsr from "./CreateUsr.vue";
const { URLSearchParams } = window;

const currentUserStore = useCurrentUserStore();
const router = useRouter();
const checkAuthentication = () => {
  if (currentUserStore.authenticated == true) {
    router.push("/welcome");
  }
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const id = urlParams.get("id");
  if (token && id) {
    getUserFromDb(token);
  }
};

const getUserFromDb = async (token: string) => {
  const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getself/`;
  axios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((data) => currentUserStore.setUser(data.data, token))
    .then(() => router.push("/welcome"));
};
watch(
  () => router.currentRoute.value,
  (route) => {
    if (route.query.token !== undefined) {
      checkAuthentication();
    }
  }
);
watch(
  () => currentUserStore.authenticated,
  (authenticated) => {
    if (authenticated == true) {
      router.push("/welcome");
    }
  }
);

onMounted(() => {
  if (currentUserStore.authenticated == true) {
    router.push("/welcome");
  }
  checkAuthentication();
});

</script>


<style scoped>
/* 
#register
{
    display: none;
} */

#no42
{
    display: none;
}
.login {
    background-color: #000;
    height: 4rem;
    padding: 0.6em 2em;
    border: none;
    outline: none;
    color: rgb(218, 203, 203);
    cursor: pointer;
    position: relative;
    border-radius: 20px;
    user-select: none;
    touch-action: manipulation;
    font-family: 'Varino', sans-serif;
    font-size: 17px;
  }
  
  .login:before {
    content: "";
    background: linear-gradient(
      45deg,
      #ff0000,
      #ff7300,
      #fffb00,
      #48ff00,
      #00ffd5,
      #002bff,
      #7a00ff,
      #ff00c8,
      #ff0000
    );
    position: absolute;
    top: -2px;
    left: -2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    -webkit-filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: glowing-button-85 20s linear infinite;
    transition: opacity 0.3s ease-in-out;
    border-radius: 20px;
  }
  
  @keyframes glowing-button-85 {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 400% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
  
  .login:after {
    z-index: -1;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 20px;
  }
  
  @media (min-width: 768px) {
    .login {
      padding: 0 2.6rem;
    }
  }

</style>