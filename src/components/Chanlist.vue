<template>
  <div class="chanlist">
    <h3>CHAN LIST</h3>
    <div class="chans">
      <ul>
        <li v-for="chan in filteredChanList" :key="chan.name">
          <button
            @click="() => $emit('changeChan', chan.name)"
            v-if="
              joinedChansStore.joinedChans.findIndex(
                (ch) => ch.name == chan.name
              ) == -1
            "
          >
            join
          </button>
          <button @click="() => $emit('changeChan', chan.name)" v-else>
            open
          </button>
          #{{ chan.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChannelFromOutside } from "../utils/interfaces";
import { useJoinedChansStore } from "../utils/joinedChanStore";
import { computed } from "vue";

const joinedChansStore = useJoinedChansStore();

const filteredChanList = computed(() => {
  return props.chanList.filter((chan) => !chan.isPrivate);
});

const props = defineProps<{
  chanList: ChannelFromOutside[];
}>();
</script>

<style scoped>
.chanlist {
  height: 600px;
  width: 800px;
}

li {
  text-decoration: none;
}
</style>
