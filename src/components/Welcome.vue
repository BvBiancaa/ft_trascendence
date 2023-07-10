<template>
  <div class="body">
    <link href="https://fonts.cdnfonts.com/css/arcade-future-demo" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/arcade-classic" rel="stylesheet">
    <div :style="{ backgroundImage: 'url(' + currentUserStore.image + ')' }">
      <router-link to="/profile">
        <button class="profile"></button>
      </router-link>  
    </div>
    <div class="content">
    <div class="play_div">
      <router-link to="/play">
        <button class="play">Play</button>
      </router-link>
    </div>
    <div class="buttons">
      <router-link to="/userlist">
        <button class="tolist">List users</button>
      </router-link>
      <router-link to="/chat">
        <button class="tolist">Chat</button>
      </router-link>
      <router-link to="/leaderboard">
        <button class="tolist">leaderboard</button>
      </router-link>
    </div>
  </div>
    <div class="end">
    </div>
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

@import url('https://fonts.cdnfonts.com/css/arcade-classic');
@import url('https://fonts.cdnfonts.com/css/varino');
@import url('https://fonts.cdnfonts.com/css/arcade-future-demo');
                
.body
{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://www.gizmodo.com.au/wp-content/uploads/sites/2/2015/05/15/1252051448978474922.jpg?q=65&w=1280");
  background-repeat: no-repeat;
  background-size: cover;
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

.content {
  position: relative;
  top: 50%;
  left: 0%;
  height: 70vh;
}
.play_div
{
  position: relative;
}
.play
{
  font-size: 80px;
  width: 50%;
  font-weight: 700;
  padding: 0 1.6rem;
  font-family: 'ArcadeClassic', sans-serif;
  color: #ffffff;
  background-color: #ca4541;
  border-radius: 20px;                                       
}

.buttons
{
  position: relative;
}

div
{
  margin-top: 0px;
  text-align: center;
}

h1 {
  font-family: 'Varino', sans-serif;
  font-size: 20px;
}
.tolist {
  margin-top: 20px;
  background-image: linear-gradient(
    92.88deg,
    #e6584e 9.16%,
    #c54c37 43.89%,
    #ca4541 64.72%
  );
  border-radius: 20px;
  border-style: none;
  box-sizing: border-box;
  color: #ffffff;
  flex-shrink: 0;
  font-family: 'Varino', sans-serif;
  font-size: 1vh;
  font-weight: 500;
  width: 15%;
  height: 10vh;
  padding: 0 1.6rem;
  text-align: center;
  text-shadow: rgba(0, 0, 0, 0.25) 0 3px 8px;
  transition: all 0.5s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  margin: 20px;
  cursor: default;
}

.tolist:hover {
  box-shadow: rgba(80, 63, 205, 0.5) 0 1px 30px;
  transition-duration: 0.1s;
}

.end
{
  position: fixed;
  top: 78%;
  left: 0%;
  width: 100%;
  height: 30%;
  border-radius: 90%;
}

@media (min-width: 768px) {
  .tolist {
    padding: 0 2.6rem;
  }
}
</style>
