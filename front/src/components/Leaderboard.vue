<template>
  <div class="body">
    <div class="glass">
      <button class="home" @click="() => router.push('/welcome')"></button>
      <!--     <h1 class="effect-shine">LEADERBOARD</h1> -->
      <div class="crowns">
        <img
          class="crown1"
          src="../../public/gif/second.svg"
          v-if="firstThree.length > 1"
        /><img
          class="crown0"
          src="../../public/gif/first.svg"
          v-if="firstThree.length > 0"
        /><img
          class="crown2"
          src="../../public/gif/third.svg"
          v-if="firstThree.length > 2"
        />
      </div>
      <div class="top">
        <img
          @click="currentUserStore.setModal(firstThree[1].id, false)"
          class="nb1"
          :src="firstThree[1].image"
          v-if="firstThree.length > 1"
        /><img
          @click="currentUserStore.setModal(firstThree[0].id, false)"
          class="nb0"
          :src="firstThree[0].image"
          v-if="firstThree.length > 0"
        /><img
          @click="currentUserStore.setModal(firstThree[2].id, false)"
          class="nb2"
          :src="firstThree[2].image"
          v-if="firstThree.length > 2"
        />
      </div>
      <div class="ultimi">
        <div
          class="users"
          style="margin-top: 2vh"
          v-for="item in leadBuona"
          :key="item.id"
        >
          <span style="font-size: 4vw"> {{ item.position }}</span>
          <button
            @click="openModal(item.id)"
            :style="{ 'background-image': 'url(' + item.image + ')' }"
            class="profile"
          ></button>
          <span>{{ item.nick }}</span>
          elo: <span>{{ item.elo }}</span> wins:
          <span>{{ item.won }}</span> loses:
          <span>{{ item.lost }}</span> played:
          <span>{{ item.played }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from "../utils/currentUserStore";
import { Ref, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const leadeboard: Ref<any[]> = ref([]);
const leadBuona: Ref<any[]> = ref([]);
const firstThree: any = ref([]);
const currentUserStore = useCurrentUserStore();
onBeforeMount(async () => {
  if (!currentUserStore.authenticated) {
    router.push("/");
  }
  const lead = await currentUserStore.getLeaderboard();
  leadeboard.value = lead;
  for (let i = 3; i < leadeboard.value.length; i++) {
    leadBuona.value.push({ position: i + 1, ...leadeboard.value[i] });
  }
  for (let i = 0; i < 3 || i < leadeboard.value.length; i++) {
    firstThree.value.push(leadeboard.value[i]);
  }
});

const openModal = (id: number) => {
  if (id != currentUserStore.id) {
    currentUserStore.setModal(id, false);
  }
};
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/varino");

.ultimi {
  top: 52vh;
  position: fixed;
  height: 47.5vh;
  overflow: scroll;
  width: 100vw;
  background: linear-gradient(
    135deg,
    rgba(159, 194, 127, 0.582),
    rgba(25, 78, 32, 0.521)
  );
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  border: 1px solid rgba(84, 87, 82, 0.514);
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.836);
  margin: auto;
  z-index: 10;
}

.body {
  font-family: "Varino", sans-serif;
  background-image: url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b781b8b1-47dd-4107-8fe1-1da66728f5a3/dfc50fh-4a091b10-fbfb-464a-b375-dcd71ff45e1d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I3ODFiOGIxLTQ3ZGQtNDEwNy04ZmUxLTFkYTY2NzI4ZjVhM1wvZGZjNTBmaC00YTA5MWIxMC1mYmZiLTQ2NGEtYjM3NS1kY2Q3MWZmNDVlMWQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.b4wZ-9xcPTBR837hc485_8rnmvxmZxgxn9bs3GQYZJM");
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  color: white;
  overflow: scroll;
}

.title {
  color: rgb(255, 215, 0);
  position: absolute;
  top: 2vh;
  font-size: calc((5vw + 5vh) / 2);
  right: calc(33vw - ((5vw + 5vh) / 2));
}

.users {
  border-top: 50vh;
}

.nb0 {
  position: fixed;
  top: 18vh;
  left: calc(50vw - ((13vh + 13vw) / 4));
  width: calc((13vh + 13vw) / 2);
  height: calc((13vh + 13vw) / 2);
  z-index: 8;
  border-radius: 10px;
}

.nb1 {
  position: fixed;
  top: 24vh;
  left: calc(35vw - ((13vh + 13vw) / 4));
  width: calc((13vh + 13vw) / 2);
  height: calc((13vh + 13vw) / 2);
  z-index: 6;
  border-radius: 10px;
}

.nb2 {
  position: fixed;
  top: 30vh;
  left: calc(65vw - ((13vh + 13vw) / 4));
  width: calc((13vh + 13vw) / 2);
  height: calc((13vh + 13vw) / 2);
  z-index: 4;
  border-radius: 10px;
}

.crown0 {
  position: fixed;
  top: calc(18vh - (13vh + 13vw) / 2);
  left: calc(50vw - ((13vh + 13vw) / 4));
  width: calc((13vh + 13vw) / 2);
  height: calc((13vh + 13vw) / 2);
  z-index: 8;
}

.crown1 {
  position: fixed;
  top: calc(24vh - (13vh + 13vw) / 2);
  left: calc(35vw - ((13vh + 13vw) / 4));
  width: calc((13vh + 13vw) / 2);
  height: calc((13vh + 13vw) / 2);
  z-index: 6;
}

.crown2 {
  position: fixed;
  top: calc(30vh - (13vh + 13vw) / 2);
  left: calc(65vw - ((13vh + 13vw) / 4));
  width: calc((13vh + 13vw) / 2);
  height: calc((13vh + 13vw) / 2);
  z-index: 4;
}

.profile {
  width: calc((10vh + 10vw) / 2);
  height: calc((10vh + 10vw) / 2);
  border-radius: 100%;
  margin-top: 1vh;
  background-size: 100%;
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

h1 {
  color: rgb(255, 215, 0);
  position: absolute;
  top: 2vh;
  font-size: calc((5vw + 5vh) / 2);
  left: calc(20vw - ((5vw + 5vh) / 2));
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 6px;
  display: inline-block;
  position: relative;
  -webkit-mask-image: linear-gradient(
    -75deg,
    rgba(0, 0, 0, 0.6) 30%,
    #000 50%,
    rgba(0, 0, 0, 0.6) 70%
  );
  -webkit-mask-size: 200%;
  animation: shine 2s linear infinite;
}

@keyframes shine {
  from {
    -webkit-mask-position: 150%;
  }
  to {
    -webkit-mask-position: -50%;
  }
}
</style>
