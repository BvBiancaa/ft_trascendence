<template>
  <div class="scheda">
    <img :src="props.user.image" />
    <div class="data">
      <h4>{{ props.user.displayName }}</h4>
      <p><span>login:</span> {{ props.user.login }}</p>
      <p><span>nome:</span> {{ props.user.name }}</p>
      <p><span>email:</span> {{ props.user.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["user"]);
console.log("user: ", props.user);
</script>

<style scoped>
.scheda {
  border: 1px solid black;
  width: 250px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
}
.scheda:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
img {
  width: 250px;
  border-radius: 5px 5px 0 0;
}
h4 {
  text-align: center;
  font-size: 20px;
}

.data {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  padding: 10px;
}

p {
  font-size: 10px;
}

span {
  font-weight: bold;
}
</style>
