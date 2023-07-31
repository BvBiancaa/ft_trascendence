<template>
<!--   <div class="center-container">
    <button class="home" @click="() => router.push('/welcome')"></button>
    <h1 class="futuristic-font">GAME ENDED</h1>
    <h3 class="futuristic-font">YOUR UPDATED STATS</h3>
    <p class="futuristic-font">wins: {{ currentUserStore.stats.won }}</p>
    <p class="futuristic-font">loses: {{ currentUserStore.stats.lost }}</p>
    <p class="futuristic-font">games played: {{ currentUserStore.stats.gamePlayed }}</p>
    <p class="futuristic-font">elo: {{ currentUserStore.stats.elo }}</p>
  </div>
  <div class="center-container">
    <h1 class="futuristic-font">YOUR MATCHES</h1>
    <div
      v-for="match in currentUserStore.matches"
      :key="match.id"
      class="match"
    >
      <p class="futuristic-font">opponent: {{ match.otherPlayerId }}</p>
      <p class="futuristic-font">
        your score:
        {{ match.oneOrTwo == 1 ? match.player1Score : match.player2Score }}
      </p>
      <p class="futuristic-font">
        opponent score:
        {{ match.oneOrTwo == 1 ? match.player2Score : match.player1Score }}
      </p>
    </div>
  </div> -->
  <div class="body">
  <div class="marquee">
    <span style="margin-top: 2vh; font-size: 50px;">Endgame</span>
  </div>
  <p class="centerSlogan" style="font-size: 15px; margin-top: 2.5vh;">© by the soviet</p>
  <br>
  <br>
  <div class="centerBody">
    <h1 class="siteName" style="font-weight:bold">YOUR UPDATED STATS</h1>
    <br>
    <br>
    <p>wins: {{ currentUserStore.stats.won }}</p>
    <p>loses: {{ currentUserStore.stats.lost }}</p>
    <p>games played: {{ currentUserStore.stats.won + currentUserStore.stats.lost}}</p>
    <p>elo: {{ currentUserStore.stats.elo }}</p>
  </div>
  <br>
  <br>
  <h2>Bored? You can go back to the main page by clicking <span @click="() => router.push('/welcome')">here</span></h2>
  <br>
  <br>
  <div class="old">
  <h2>OLD MATCHES</h2>
  <ul>
    <li>
      <br>
      <div
      v-for="match in currentUserStore.matches"
      :key="match.id"
      class="match"
    >
      <p class="futuristic-font">opponent: {{ match.otherPlayerId }}</p>
      <p class="futuristic-font">
        your score:
        {{ match.oneOrTwo == 1 ? match.player1Score : match.player2Score }}
      </p>
      <p class="futuristic-font">
        opponent score:
        {{ match.oneOrTwo == 1 ? match.player2Score : match.player1Score }}
      </p>
      <br>
    </div></li>
  </ul>
</div>
</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useCurrentUserStore } from "../utils/currentUserStore";
import { useRouter } from "vue-router";

const router = useRouter();
const currentUserStore = useCurrentUserStore();
onMounted(async () => {
  if (!currentUserStore.authenticated) {
    router.push("/");
  }
  currentUserStore.updateUserFromDb();
  currentUserStore.getMyMatches();
  currentUserStore.stats = await currentUserStore.getOtherUsrStats(
    currentUserStore.id
  );
});
</script>

<style scoped>
 @import url('https://fonts.googleapis.com/css?family=Bungee+Inline|Press+Start+2P');

.body {
  position: fixed;
  top: 0%;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  background-color: #001;
  color: #382;
  font-family: 'Press Start 2P';
  font-size: 14px;
  animation: blackout 2s linear infinite;
}

.centerSlogan {
  text-align: center;
  font-size: 12px;
  font-family: 'Bungee Inline';
  font-weight: bold;
  border-style: hidden double double double;
  border-color: #382;
  border-radius: 50px;
  color: #382;
  height: 5vh;
}

.marquee {
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;
  font-size: 15px;
  color: #382;
  font-family: 'Press Start 2P';
  letter-spacing: -2px;
  border-style: hidden hidden double hidden;
  height: 10vh;
}

.marquee span {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 30s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}


h2{
  text-shadow: 1px 1px #66FF66;
}

@keyframes blackout{
  from  { background-color: #000;}
  to     { background-color: #999;}
}
</style>
