<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <div class="video container">
    <video playsinline autoplay muted loop>
      <source
        src="https://st4.depositphotos.com/2673669/27175/v/600/depositphotos_271757444-stock-video-moving-random-psychedelic-waves-green.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  </div>
  <div class="login-box">
    <h2>Login</h2>
    <form>
      <div class="user-box">
        <input type="text" name="" required v-model="email" />
        <label>Email</label>
      </div>
      <div class="user-box">
        <input type="password" name="" required v-model="password" />
        <label>Password</label>
      </div>
      <a class="btn" href="#" @click="login">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Login
      </a>
      <div class="container">
        <p class="message">
          Not registered?
          <a @click="pushlogin()" style="cursor: pointer"> Register </a>
        </p>
      </div>
      <p class="message">42 student? <a :href="getUrl()">42 login</a></p>
    </form>
  </div>
  <div class="footer">
    <p>by the soviet Ⓒ</p>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { useCurrentUserStore } from "../utils/currentUserStore";

const email: Ref<string> = ref("");
const password: Ref<string> = ref("");
const currentUserStore = useCurrentUserStore();
import { getUrl } from "../utils/42auth";

import { useRouter } from "vue-router";

const router = useRouter();

const login = async () => {
  try {
    await currentUserStore.loginUsr(email.value, password.value);
    router.push("/");
  } catch (error) {
    if ((error as any).response?.status == 404) {
      alert("User not found, try again!");
    } else if ((error as any).response?.data.message == "2faNeeded") {
      const code = prompt("enter your 2fa code");
      if (code) {
        try {
          await currentUserStore.loginUsr2fa(email.value, password.value, code);
        } catch (error) {
          alert("Wrong code, try again!");
          email.value = "";
          password.value = "";
          return;
        }
      }
      router.push("/");
    } else {
      alert("Wrong user or password, try again");
    }
    email.value = "";
    password.value = "";
  }
};
const pushlogin = async () => {
  router.push("/register");
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
  background: linear-gradient(#30142b, #a12727);
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

.container {
  display: flex;
  align-items: center;
  font-family: "Varino", sans-serif;
}

p {
  margin: 0;
  white-space: pre;
  font-family: "Varino", sans-serif;
  color: white;
  font-size: 13px;
}

label {
  font-family: "Varino", sans-serif;
}

a {
  font-family: "Varino", sans-serif;
}

.login-box {
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
  font-family: "Varino", sans-serif;
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
  font-family: "Varino", sans-serif;
}
.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #289bb8;
  font-size: 12px;
}

.btn {
  position: relative;
  left: 32%;
  display: inline-block;
  padding: 10px 20px;
  color: #289bb8;
  font-size: 16px;
  text-decoration: none;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 15px;
  margin-bottom: 30px;
  letter-spacing: 2px;
  font-family: "Varino", sans-serif;
}

.login-box a:hover {
  background: #1e6f83;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #357a8b, 0 0 25px #0a4958, 0 0 50px #10657a,
    0 0 100px #1b6d81;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #488118);
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

.login-box a span:nth-child(2) {
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

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #3d3488);
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

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #bb52b2);
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

.message {
  margin: 15px 0 0;
  color: #ffffff;
  font-size: 12px;
}
.message a {
  color: #289bb8;
  text-decoration: none;
}

.message a:hover {
  box-shadow: none;
  background: transparent;
  color: #fff;
}

.footer {
  position: fixed;
  height: 5vh;
  bottom: 0;
  left: 1vh;
  font-family: "Varino", sans-serif;
  color: #ffffff;
  font-size: smaller;
}
</style>
