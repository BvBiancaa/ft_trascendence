<template>
  <div class="body">
    <video playsinline autoplay muted loop poster="cake.jpg">
      <source
        src="https://st4.depositphotos.com/2673669/27175/v/600/depositphotos_271757444-stock-video-moving-random-psychedelic-waves-green.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
    <div class="login-page">
      <div class="form">
        <form class="login-form" @submit.prevent="createUsr">
          <h2>Register</h2>
          <div class="user-box">
            <input type="text" name="" required v-model="login" />
            <label>Username</label>
          </div>
          <div class="user-box">
            <input type="text" name="" required v-model="email" />
            <label>Email</label>
          </div>
          <div class="user-box">
            <input type="password" name="" required v-model="password" />
            <label>Password</label>
          </div>
          <a class="btn" @click="createUsr">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Create
          </a>
          <p class="message">
            Already registered? <a href="#" @click="pushlogin()">login</a>
          </p>
          <p class="message">42 student? <a :href="getUrl()">42 login</a></p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUrl } from "../utils/42auth";
import { useRouter } from "vue-router";
import { createUser } from "../utils/crudoperations";
import { Ref, ref } from "vue";

const router = useRouter();
const pushlogin = () => {
  router.push("/no42");
};

const email: Ref<string> = ref("");
const password: Ref<string> = ref("");
const login: Ref<string> = ref("");
const message: Ref<string> = ref("");

const createUsr = async () => {
  const created = await createUser(email.value, password.value, login.value);
  console.log(created);
  if (created.status == 201) {
    alert("User created, redirecting to login page...");
    message.value = "User created, you can now login!";
    router.push("/no42");
  } else if (created.status == 409) {
    if (created.data.message.includes("login")) {
      alert("Nickname already in use, try again!");
      return;
    }
    if (created.data.message.includes("email")) {
      alert("Email already in use, try again!");
      return;
    }

    message.value = "Something went wrong, try again!";
  } else if (created.status == 400) {
    if (created.data.message[0].includes("email")) {
      alert("Please enter a valid email address");
      return;
    }
    if (created.data.message[0].includes("password")) {
      alert(
        "Password must be at least 8 characters with at least an Uppercase and Lowercase letter, a symbol and a number"
      );
      return;
    }
  }
  email.value = "";
  password.value = "";
  login.value = "";
};
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/varino");

html {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: "Varino", sans-serif;
  background: linear-gradient(#30142b, #2772a1);
  width: 100%;
  height: 100%;
  overflow: hidden;
}

video {
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

p {
  color: #fff;
}

.login-page .user-box {
  position: relative;
}

.login-page {
  width: 400px;
  padding: 8% 0 0;
  margin: auto;
}

.form h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}
.user-box {
  font-family: "Varino", sans-serif;
}
.form {
  position: relative;
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}
.form input {
  width: 100%;
  padding: 10px 0;
  font-size: 13px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
  font-family: "Varino", sans-serif;
}

.form .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.form .user-box input:focus ~ label,
.form .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #289bb8;
  font-size: 12px;
}

h2 {
  color: white;
  font-family: "Varino", sans-serif;
}

p {
  font-family: "Varino", sans-serif;
}

.form .message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}
.form .message a {
  color: #289bb8;
  text-decoration: none;
}
.form .register-form {
  display: none;
}
.btn {
  position: relative;
  display: inline-block;
  left: 29%;
  padding: 10px 20px;
  color: #289bb8;
  font-size: 16px;
  text-decoration: none;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 15px;
  margin-bottom: 20px;
  letter-spacing: 2px;
  font-family: "Varino", sans-serif;
}
.btn:hover {
  background: #289bb8;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #289bb8, 0 0 25px #289bb8, 0 0 50px #289bb8,
    0 0 100px #289bb8;
}

.btn span {
  position: absolute;
  display: block;
}

.btn span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #289bb8);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

.btn span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #289bb8);
  animation: btn-anim2 1s linear infinite;
  animation-delay: 0.25s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

.btn span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #289bb8);
  animation: btn-anim3 1s linear infinite;
  animation-delay: 0.5s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

.btn span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #289bb8);
  animation: btn-anim4 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>
