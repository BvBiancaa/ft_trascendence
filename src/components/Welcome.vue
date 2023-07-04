<template>
  <div class="body">
    <div>
    <button class="profile" style="{ backgroundImage: `url(${ currentUserStore.image })` }"></button>
    </div>
    <h1>Welcome {{ currentUserStore.displayName }}</h1>
    <router-link to="/userlist">
      <button class="tolist">List users</button>
    </router-link>
    <router-link to="/chat">
      <button class="tolist">Chat</button>
    </router-link>
    <router-link to="/play">
      <button class="tolist">Play</button>
    </router-link>
    <router-link to="/leaderboard">
      <button class="tolist">leaderboard</button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCurrentUserStore } from "../utils/authStore";
import { onMounted } from "vue";
const currentUserStore = useCurrentUserStore();
const router = useRouter();
onMounted(() => {
  if (currentUserStore.authenticated == false) {
    router.push("/");
  }
});

</script>

<style scoped>

.body
{
  object-fit: cover;
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: url("https://www.makte.it/wp-content/uploads/2019/01/MK8281M.jpg");
  overflow: hidden;
}

.profile
{
  position: fixed;
  top: 5%;
  left: 87%;
  width: 100px;
  height: 100px;
  border-radius: 90%;
}

div
{
  margin-top: 50px;
  text-align: center;
}

.avatar
{
  
}

h1 {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 20px;
}
.tolist {
  margin-top: 20px;
  background-image: linear-gradient(
    92.88deg,
    #455eb5 9.16%,
    #5643cc 43.89%,
    #673fd7 64.72%
  );
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
  font-family: "Inter UI", "SF Pro Display", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
    sans-serif;
  font-size: 16px;
  font-weight: 500;
  height: 4rem;
  padding: 0 1.6rem;
  text-align: center;
  text-shadow: rgba(0, 0, 0, 0.25) 0 3px 8px;
  transition: all 0.5s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  margin: 10px;
}

.tolist:hover {
  box-shadow: rgba(80, 63, 205, 0.5) 0 1px 30px;
  transition-duration: 0.1s;
}

@media (min-width: 768px) {
  .tolist {
    padding: 0 2.6rem;
  }
}
</style>
