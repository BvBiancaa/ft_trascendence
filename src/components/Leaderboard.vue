<template>
  <div>
    <h1>LEADERBOARD</h1>
    <div v-for="item in leadeboard" :key="item.id">
      {{ item.nickName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from "../utils/currentUserStore";
import { Ref, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const leadeboard: Ref<any[]> = ref([]);

const currentUserStore = useCurrentUserStore();
onMounted(async () => {
  if (!currentUserStore.authenticated) {
    router.push("/");
  }
  leadeboard.value = await currentUserStore.getLeaderboard();
});
</script>

<style scoped></style>
