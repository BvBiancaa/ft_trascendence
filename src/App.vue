<template>
  <div class="main" v-if="currentUserStore.authenticated">
    <div class="header">
      <Header />
    </div>
    <div class="content">
      <router-view />
    </div>
    <div class="users">
      <Online />
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
  <ChanSettingModal v-if="currentUserStore.chanSettingsModal != ''" />
  <UserModal v-if="currentUserStore.modalOpen != 0" />
  <div v-if="!currentUserStore.authenticated">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useCurrentUserStore } from "./utils/currentUserStore";
import Online from "./components/Online.vue";
import UserModal from "./components/UserModal.vue";
import ChanSettingModal from "./components/ChanSettingModal.vue";
const currentUserStore = useCurrentUserStore();
</script>

<style scoped>
.main {
  width: 100%;
  height: 93vh;
  display: grid;
  grid-template-columns: 7fr 1fr;
  grid-template-rows: 2fr 18fr 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.header {
  grid-area: 1 / 1 / 2 / 3;
}
.content {
  grid-area: 2 / 1 / 3 / 2;
}
.users {
  grid-area: 2 / 2 / 3 / 3;
}
.footer {
  grid-area: 3 / 1 / 4 / 3;
}
</style>
