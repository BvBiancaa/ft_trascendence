<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
  <div class="userPanel">
     <div class="upper">
     </div>
     <div class="profimg" :style="{
           'background-image': profiloimg(),
         }">
     </div>
     <button class="home" @click="() => router.push('/welcome')"></button>
     <div class="body"> 
   <div class="elo">
     <p> {{ currentUserStore.stats?.elo }}</p>
   </div>
   <div class="info">
     <p><span>name:</span> {{ currentUserStore.name }}</p>
     <p style="margin-top: 10px;">
       <span>nick:</span> {{ currentUserStore.nickName }}
       <div class="nickbtn">
     <button class="btnick" @click="showNick"></button>
     <form class="modnick" @submit.prevent="changeNick">
       <input id="text" v-model="newNick" type="text" style="width: 10vw; border-radius: 15px;"/>
       <button type="submit" @click="showNick" style="font-family: 'Varino', sans-serif; font-size: calc((0.9vw + 0.9vh) / 2); border-radius: 15px; color: rgb(32, 21, 21);">send</button>
     </form>
     <button @click="showNick" class="back" style="font-family: 'Varino', sans-serif; font-size: calc((0.9vw + 0.9vh) / 2); border-radius: 15px; color: rgb(32, 21, 21);">back</button>
   </div></p>
   <p style="margin-top: 10px;"><span>email:</span> {{ currentUserStore.email }}</p>
   <p @click="activate2fa" style="margin-top: 10px;" v-if="!currentUserStore.twoFaActive">
          turn on 2fa
        </p>
        <p v-else style="margin-top: 10px;" @click="remove2fa">turn off 2fa</p>
   </div>
   <div>

      </div>
 </div>
 </div>
   <button class="btn" @click="changeImgBtn = true"><input type="file" @change="onFileChange" style="width: 3vw; height: 3vh; z-index: -1;" :key="inputReset" v-if="!changeImgBtn"/></button>
   <div class="imgbtn">
     <form class="modimg" enctype="multipart/form-data" @submit.prevent="changeImg" v-if="changeImgBtn">
       <button type="submit" @click="showChange" style="font-family: 'Varino', sans-serif; font-size: calc((0.9vw + 0.9vh) / 2); border-radius: 15px; color: rgb(32, 21, 21);">send</button>
       <button @click="changeImgBtn = false" class="backimg" style="font-family: 'Varino', sans-serif; font-size: calc((0.9vw + 0.9vh) / 2); border-radius: 15px; color: rgb(32, 21, 21);">back</button>
     </form>
     
   </div>

     
  <div class="pie">
  <div id="win" @load="calculate"></div>
  <div id="lose"></div>
  <div class="stats">
      <p><span>wins:</span> {{ currentUserStore.stats?.won }} <span>&emsp;&emsp;&emsp;&emsp;loses:</span> {{ currentUserStore.stats?.lost }}</p>
      <p> <span>&emsp;&emsp;games played:</span> {{ currentUserStore.stats?.played }} </p>
    </div>
</div>
  <div class="footer">
    <p>by the soviet Ⓒ</p>
    </div>
    <div class="modal" v-if="twofa">
    <div class="modal-content">
      <h2>2fa</h2>
      <span class="close" @click="twofa = false">&times;</span>
      <h4>scansiona il qrcode e metti il codice per proseguire</h4>
      <img class="qrcode" :src="img" />
      <input type="text" @submit="confirm2fa" v-model="twofacode" />
      <button @click="confirm2fa">ok</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from "../utils/currentUserStore";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useOnlineSocketStore } from "../utils/onlineSocketStore";
const currentUserStore = useCurrentUserStore();
const newNick = ref("");
const router = useRouter();
const selectedFile = ref<File>();
const inputReset = ref(0);
const socket = useOnlineSocketStore().socket;
const changeImgBtn = ref(false);
onMounted(calculate);
const onFileChange = (e: any) => {
  if (e.target == null) {
    return;
  }
  const fileSelection = e.target.files[0];
  selectedFile.value = fileSelection;
};
const profiloimg = () => {
  return "url(" + currentUserStore.image + ")";
};
const changeNick = async () => {
  if (newNick.value == '') {
    alert('nickname can not be empty!')
    return;
  }
  const data = {
    nickName: newNick.value,
  };
  try {
    await currentUserStore.updateUserInDb(data);
  } catch (error) {
    alert(`nickname ${newNick.value} gia in uso!`);
    newNick.value = "";
    return;
  }
  if (socket != null) {
    socket.emit("changeNick", newNick.value);
  }
  newNick.value = "";
};

const twofa = ref(false);
const img = ref("");
const twofacode = ref("");

const remove2fa = () => {
  currentUserStore.remove2fa();
};

onMounted(async () => {
  if (!currentUserStore.authenticated) {
    router.push("/");
  }
  currentUserStore.stats = await currentUserStore.getOtherUsrStats(currentUserStore.id);
  calculate();
  currentUserStore.updateUserInDb({isNew: false})
});

const activate2fa = async () => {
  twofa.value = true;
  const qr = await currentUserStore.activate2fa();
  img.value = qr;
};

const confirm2fa = async () => {
  const resp = await currentUserStore.confirm2fa(twofacode.value);

  if (resp == "success") {
    alert("2fa activated succcesfully");
    twofacode.value = "";
    img.value = "";
    twofa.value = false;
  }
};

const changeImg = async () => {
  if (selectedFile.value == null) {
    return;
  }
  const formData = new FormData();
  formData.append("file", selectedFile.value, selectedFile.value.name);
  await currentUserStore.changeImg(formData);
  changeImgBtn.value = false
  inputReset.value++;
};

function showChange(): void {
  const a: HTMLElement | null = document.querySelector(".modimg");
  const b: HTMLElement | null = document.querySelector(".backimg");
  if (a) {
    if (a.style.display == "inline-block") {
      a.style.display = "none";
      if (b) b.style.display = "none";
    } else {
      a.style.display = "block";
      if (b) b.style.display = "inline-block";
    }
  }
}

function showNick(): void {
  const a: HTMLElement | null = document.querySelector(".modnick");
  const e: HTMLElement | null = document.querySelector(".btnick");
  const b: HTMLElement | null = document.querySelector(".back");
  if (a) {
    if (a.style.display == "inline-block") {
      a.style.display = "none";
      if (e) e.style.display = "inline-block";
      if (b) b.style.display = "none";
    } else {
      a.style.display = "inline-block";
      if (e) e.style.display = "none";
      if (b) b.style.display = "inline-block";
    }
  }
}
function calculate(): void {
  const a: HTMLElement | null = document.querySelector("#win");
  const b: HTMLElement | null = document.querySelector("#lose");
  if (a){
    const width =  currentUserStore.stats?.won  /  currentUserStore.stats?.played  * 30
    a.style.width = width.toString()  + 'vw';
  }
  if (b) {
  if (currentUserStore.stats.played == 0) {
    b.style.width= "0";
  }
  else {
  const width = 30 - (currentUserStore.stats.won  /  currentUserStore.stats.played * 30)
    b.style.width = width.toString() + 'vw'
  }
  }
  if (currentUserStore.stats.played == 0) {
    if (a) {
      a.style.backgroundColor = "yellow";
      a.style.width = "30vw"
    }
  }
}
</script>
<style scoped>

@import url("https://fonts.cdnfonts.com/css/varino");

input[type="file"]::file-selector-button {
  width: 0.1cm;
  color: transparent;
  background-color: transparent;
  height: 0.5vh;
  z-index: -1;
  font-family: "Varino", sans-serif;
  color: transparent;
}

input[type="file"] {
  color: transparent
}

.home
{
  background-image: url("https://static.vecteezy.com/system/resources/previews/008/527/647/original/green-neon-house-icon-with-door-roof-and-chimney-on-a-black-background-illustration-vector.jpg");
  background-repeat: no-repeat;
  background-size:contain ;
  width: calc((4vw + 5vh) / 2);
  height: calc((4vw + 5vh) / 2);
  border-radius: 40px;
  position: fixed;
  top: 1%;
  left: 1%;
}
.body
{
  background-image: url("https://wallpapercrafter.com/th800/100934-pixel-art-8-bit-green-digital-art.png");
  background-repeat: no-repeat;
  background-size: 100% 62%;

  font-family: "Varino", sans-serif;
/*   background-color: rgb(192, 245, 178); */
  background-color: #9ff1a9;
  color: rgb(0, 0, 0);
  top: 39vh;
  left: 0%;
  height: 100%;
  width: 100%;
  position: fixed;
}

div {
  width: 100%;
  font-family: "Varino", sans-serif;
}

.piesta
{
  text-align: center;
}
.pie {
  border-radius: 5px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 10fr;
  position: fixed;
  top: 70%;
  width: 30vw;
  left: calc((36.5vw + 36.5vw) / 2);
}

#win {
  border-radius: 10;
  height: 10px;
  background-color: #08f362;
}

#lose {
  background-color: #af2323;
}
.upper
{
  z-index: 0;
  position: fixed;
  background-image: url("../gif/background.gif");
  background-repeat: no-repeat;
  background-size: 100vw 40vh;
  height: 39vh;
  left: 0%;
  top: 0%;
  width: 100%;
}

.profimg
{
  position: absolute;
  top: 25vh;
  left: 6vw;
  width: calc((25vw + 25vh) / 2);
  height: calc((25vh + 25vw) /2);
  border-radius: 100%;
  background-size:cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 3px solid white;
  box-sizing: border-box; 
  z-index: 2;
}

.imgbtn
{
  display: none;
  position: absolute;
  top: 45vh;
  left: 27vw;
}

.info
{
  position: fixed;
  top: 30vh;
  left: 35vw;
  font-size: calc((1.5vw + 1.5vh) / 2);
}

.elo
{
  position: fixed;
  top: 10vh;
  left: 30vw;
  font-size: calc((8vw + 8vh) / 2);
  color: #9ff1a9;
}
.nickbtn
{
  position: fixed;
  top: calc(30vh + 1.5vw);
  display: none;
  left: calc((78vw + 49vh) / 2);
  z-index: 0;
}

.stats
{
  position: fixed;
  top: 65%;
  width: 50vh;
  left: calc((43.5vw + 39vw) / 2);
  font-size: calc((1.5vw + 1.5vh) / 2);
}


.userPanel {
  text-align: left;
  margin: 10px auto;
  width: 400px;
  display: flex;
  flex-direction: column;
}

span {
  font-weight: bold;
}

img {
  width: 300px;
}

.imgbtn,
.info,
.nickbtn,
.stats
{
  display: block;
  margin-top: 10vh;
}


.btn{
  background-image: url("https://cdn-icons-png.flaticon.com/512/6324/6324826.png");
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 10px;
  align-items: center;
  cursor: pointer;
  position: fixed;
  top: calc((45vh + 36vw) / 2);
  left: calc((30vh + 28vw) / 2);
  width: 3vh;
  height: 3vh;
  font-family: "Varino", sans-serif;
  z-index: 2;
}

.btnick{
  background-image: url("https://cdn-icons-png.flaticon.com/512/6324/6324826.png");
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 10px;
  align-items: center;
  cursor: pointer;
  position: fixed;
  top: calc(40vh + 1.5vw);
  left: calc((80vw + 50vh) / 2);
  width: 2.8vh;
  height: 3vh;
  z-index: 0;
  font-family: "Varino", sans-serif;
  display: none;
}

.footer
{
  position: fixed;
  height: 5vh;
  bottom: 0;
  left: 1vh;
  font-family: "Varino", sans-serif;
  color: #14221c;
  font-size: 1.5vw;
}

.modal {
  position: fixed;
  z-index: 4;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.modnick {
  display: none
}
.btnick {
  display: block;
}
.back {
  display: none;
}

</style>
