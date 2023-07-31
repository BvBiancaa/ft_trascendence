<template>
  <div class="main" v-if="currentUserStore.authenticated">
    <div class="content">
      <router-view />
    </div>
    <div class="users">
      <KeepAlive>
        <Online />
      </KeepAlive>
    </div>
  </div>
  <ChanSettingModal v-if="currentUserStore.chanSettingsModal != ''" />
  <UserModal v-if="currentUserStore.modalOpen.id != 0" />
  <div v-if="!currentUserStore.authenticated">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { KeepAlive } from "vue";
import { useCurrentUserStore } from "./utils/currentUserStore";
import Online from "./components/Online.vue";
import UserModal from "./components/UserModal.vue";
import ChanSettingModal from "./components/ChanSettingModal.vue";
const currentUserStore = useCurrentUserStore();
</script>

<style scoped>
.main {
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 7fr 1fr;
  grid-template-rows: 2fr 18fr 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.content {
  grid-area: 2 / 1 / 3 / 2;
}
.users {
  grid-area: 2 / 2 / 3 / 3;
}
</style>
