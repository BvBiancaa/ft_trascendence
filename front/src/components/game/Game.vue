<template>
  <div id="gameContainer" ref="gameContainer"></div>
</template>

<script setup lang="ts">
import Phaser from "phaser";
import HelloWorldScene from "./HelloWorldScene";
import CustomButtonScene from "./CustomButtonScene";
import YouSuck from "./YouSuck";
import WinLose from "./WinLoseScene";
import { onMounted, ref, Ref, onBeforeMount } from "vue";
declare global {
  var currentPlayerChoice: string | null;
}
import PlayerSelectionScene from "./PlayerSelection";
import ClassicPongScene from "./ClassicPong";
import { useOnlineSocketStore } from "../../utils/onlineSocketStore";
import { useCurrentUserStore } from "../../utils/currentUserStore";
import PrePapa from "./PrePapaScene";
import { useRouter } from "vue-router";
import PapaScene from "./PapaScene";

const socket = useOnlineSocketStore().socket;
const router = useRouter();
const currentUserStore = useCurrentUserStore();
const { URLSearchParams } = window;
const player = new URLSearchParams(window.location.search);
const iam = player.get("player");
const gameContainer: Ref<HTMLElement | null> = ref(null);
let config: Phaser.Types.Core.GameConfig;

socket?.on("gameEnded", () => {
  socket.off("gameEnded");
  router.push("/endGame");
});

onBeforeMount(() => {
  config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "gameContainer",
      width: window.innerWidth - 20,
      height: window.innerHeight - 20,
    },
    //parent: 'app',
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 1 },
        /*     debug: true */
      },
    },
    scene: [
      CustomButtonScene,
      PlayerSelectionScene,
      HelloWorldScene,
      ClassicPongScene,
      WinLose,
      PrePapa,
      PapaScene,
      YouSuck,
    ],
    callbacks: {
      preBoot: (game) => {
        game.registry.set("roomName", currentUserStore.gameRoomName);
        game.registry.set("socket", socket);
        game.registry.set("player", iam);
      },
    },
  };
}),
  onMounted(() => {
    if (!currentUserStore.authenticated) {
      router.push("/");
    }

    new Phaser.Game({
      ...config,
      parent: gameContainer.value!,
    });
  });
</script>

<style scoped>
@media screen and (max-width: 768px) {
  #gameContainer {
    width: 100%;
    height: 80%;
  }
}
@media screen and (min-height: 768px) and (max-height: 800) {
  #gameContainer {
    width: 100%;
    height: 80%;
  }
}

@media screen and (min-width: 769px) and (max-width: 1199px) {
  #gameContainer {
    width: 80%;
    height: 80%;
  }
}

@media screen and (min-width: 1000px) and (max-width: 1399px) {
  #gameContainer {
    width: 90%;
    height: 90%;
  }
}

@media screen and (min-width: 1200px) {
  #gameContainer {
    width: 100%;
    height: 100%;
  }
}
</style>
