<template>
  <div :class="['scheda', isRound ? 'round' : 'square']" @click="toggleDetails">
    <img :src="props.user.image" v-if="showDetails" @click="currentUserStore.setModal(user.id)"/>
    <img class="before" :src="props.user.image" v-else />
    <div class="data" v-if="showDetails">
      <!-- Contenuto della data -->
      <h4>{{ props.user.displayName }}</h4>
      <p><span>login:</span> {{ props.user.login }}</p>
      <p><span>nome:</span> {{ props.user.name }}</p>
      <p><span>email:</span> {{ props.user.email }}</p>
      <div class="container">
        <button
          class="addfriend"
          href="#"
          style="--color: #011627"
          v-if="
            !currentUserStore.friends.includes(props.user.id) &&
            !props.quarantadue
          "
          @click="() => currentUserStore.addFriend(props.user.id)"
        >
          add friend
        </button>
        <button
        class="addfriend"
          href="#"
          style="--color: #011627"
          v-else-if="
            currentUserStore.friends.includes(props.user.id) &&
            !props.quarantadue
          "
          @click="() => currentUserStore.removeFriend(props.user.id)"
        >
          remove friend
        </button>
        <button
          class="addfriend"
          href="#"
          style="--color: #011627"
          @click="() => getStatsAndOpenModal(props.user.id)"
        >
          stats
        </button>
      </div>
    </div>
  </div>
  <div class="modal" v-if="statsModal != 0">
    <div class="modal-content">
      <h1>{{ user.nickName }}<span class="close" @click="statsModal = 0">&times;</span></h1>
      <div v-for="stat in otherUserStats" :key="stat.id" class="match">
        <span v-if="stat.won">🏆 Won </span>
        <span v-else>🏳 Lost</span>
        <span> against </span> {{ stat.nick }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
const props = defineProps(["user", "quarantadue"]);
import { useCurrentUserStore } from "../utils/currentUserStore";
import { Match } from "../utils/interfaces";

const currentUserStore = useCurrentUserStore();
const showDetails = ref(false);
const isRound = ref(true);

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
  isRound.value = false;
};

const statsModal = ref(0);
const otherUserStats: Ref<Match[]> = ref([]);

const getStatsAndOpenModal = async (id: number) => {
  otherUserStats.value = await currentUserStore.getOtherUsrMatches(id);
  statsModal.value = id;
};

</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/varino");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800;900&display=swap");


.square {
  border-radius: 5px;
}
.addfriend {
  position: relative;
  padding: 16px 30px;
  font-size: 0.8rem;
  font-family: "Varino", sans-serif;
  color: var(--color);
  border: 2px solid rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  text-shadow: 0 0 15px var(--color);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  transition: 0.2s;
  z-index: 1;
}

.addfriend:hover {
  color: #fff;
  border: 2px solid rgba(0, 0, 0, 0);
  box-shadow: 0 0 0px var(--color);
}

.addfriend::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color);
  z-index: -1;
  transform: scale(0);
  transition: 0.2s;
}

.addfriend:hover::before {
  transform: scale(1);
  transition-delay: 0.3s;
  box-shadow: 0 0 10px var(--color), 0 0 30px var(--color),
    0 0 60px var(--color);
}

.addfriend span {
  position: absolute;
  background: var(--color);
  pointer-events: none;
  border-radius: 2px;
  box-shadow: 0 0 10px var(--color), 0 0 20px var(--color),
    0 0 30px var(--color), 0 0 50px var(--color), 0 0 100px var(--color);
  transition: 0.5s ease-in-out;
  transition-delay: 0.25s;
}

.addfriend:hover span {
  opacity: 0;
  transition-delay: 0s;
}

.addfriend span:nth-child(1),
.addfriend span:nth-child(3) {
  width: 40px;
  height: 4px;
}

.addfriend:hover span:nth-child(1),
.addfriend:hover span:nth-child(3) {
  transform: translateX(0);
}

.addfriend span:nth-child(2),
.addfriend span:nth-child(4) {
  width: 4px;
  height: 40px;
}

.addfriend:hover span:nth-child(1),
.addfriend:hover span:nth-child(3) {
  transform: translateY(0);
}

.addfriend span:nth-child(1) {
  top: calc(50% - 2px);
  left: -50px;
  transform-origin: left;
}

.addfriend:hover span:nth-child(1) {
  left: 50%;
}

.addfriend span:nth-child(3) {
  top: calc(50% - 2px);
  right: -50px;
  transform-origin: right;
}

.addfriend:hover span:nth-child(3) {
  right: 50%;
}

.addfriend span:nth-child(2) {
  left: calc(50% - 2px);
  top: -50px;
  transform-origin: top;
}

.addfriend:hover span:nth-child(2) {
  top: 50%;
}

.addfriend span:nth-child(4) {
  left: calc(50% - 2px);
  bottom: -50px;
  transform-origin: bottom;
}

.addfriend:hover span:nth-child(4) {
  bottom: 50%;
}
.scheda {
  width: 250px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid black;
  transition: 0.3s;
  overflow: hidden;
  margin-left: 2vw;
  overflow: hidden;
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

img
{
  cursor: pointer;
  align-self: center;
  width: 250px;
  height: 300px;
  object-fit: cover;
  object-position: bottom;
  border-top-left-radius: 100px;
}
.before {
  --m: radial-gradient(circle farthest-side at right, #000 99%, #0000) 0 100%/46%
      92% no-repeat,
    radial-gradient(circle farthest-side at left, #000 99%, #0000) 100% 0/46%
      92% no-repeat;
  -webkit-mask: var(--m);
  mask: var(--m);
  filter: grayscale(0.75);
  transition: 0.3s linear;
  cursor: pointer;
  align-self: center;
  width: 250px;
  height: 300px;
  object-fit: cover;
  object-position: bottom;
}

.before:hover {
  -webkit-mask-position: 7.5% 50%, 92.5% 50%;
  mask-position: 7.5% 50%, 92.5% 50%;
  filter: grayscale(0);
}
.before:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
h4 {
  font-family: "Varino", sans-serif;
  text-align: center;
  font-size: 16px;
  color: white;
}

.data {
  font-family: "Varino", sans-serif;
  text-align: center;
  padding: 10px;
  height: 18vh;
}

p {
  font-size: 1vh;
  color: white;
}

span {
  font-weight: bold;
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
}

.modal-content {
  background-color: #c8e9d7;
  margin: auto;
  color: #000;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-height: 80vh;
  overflow: scroll;
}

.match {
  border-bottom: 1px solid black;
  padding: 10px;
}


.close
{
  position: fixed;
  right: 10%;
  top: 13%;
}
</style>
