<template>
  <div class="chanlist">
    <h3>CHAN LIST</h3>
    <div class="chans">
      <ul>
        <li
          v-for="chan in props.chanList"
          :key="chan.name"
          @click="() => $emit('changeChan', chan.name)"
        >
          #{{ chan.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChannelFromOutside } from "../utils/interfaces";

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
