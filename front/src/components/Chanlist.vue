<template>
  <div class="chanlist">
    <div class="chans">
      <ul>
        <li v-for="chan in filteredChanList" :key="chan.name">
          <button class="joinbtn" @click="() => $emit('changeChan', chan.name)" v-if="joinedChansStore.joinedChans.findIndex((ch) => ch.name == chan.name) == -1"></button>
          <button class="openbtn" @click="() => $emit('changeChan', chan.name)" v-else>   
          </button>
          #{{ chan.name }}
        </li>
      </ul>
    </div>
    <div class="tutorial">
      <h1>INSTRUCTIONS</h1>
      <h3 class="first">join or create chan clicking on join or create</h3>
      <h3>admin can kick, mute, promove to admin or ban users</h3>
      <h3>admin can set rooms private or password protected</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChannelFromOutside } from "../utils/interfaces";
import { useJoinedChansStore } from "../utils/joinedChanStore";
import { computed } from "vue";

const joinedChansStore = useJoinedChansStore();

const filteredChanList = computed(() => {
  if (props.chanList) {
    return props.chanList.filter((chan) => !chan.isPrivate);
  }
});

const props = defineProps<{
  chanList: ChannelFromOutside[] | null;
}>();
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/varino");
.chanlist {
  height: 600px;
  width: 800px;
}

.joinbtn {
  background-image: url("../../public/gif/join.svg");
  background-repeat: no-repeat;
  background-size: 2vw 2vh;
  background-color: transparent;
  width: 2vw;
  height: 2vh;
  border: none;
}


.openbtn
{
  background-image: url("../../public/gif/open.svg");
  background-repeat: no-repeat;
  background-size: 2vw 2vh;
  background-color: transparent;
  width: 2vw;
  height: 2vh;
  border: none;
}

p
{
  color:white;
}
li {
  color:white;
  text-decoration: none;
}

.tutorial {
  text-align: center;
  margin-top: 20px;
}

h1
{
  color:white;
}

h2 {
  margin-top: 15px;
  text-align: justify;
  color:white;
}

h3 {
  margin-left: 30px;
  text-align: justify;
  color:white;
}

.first {
  margin-top: 10px;
}
</style>
