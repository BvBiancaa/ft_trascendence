<template>
  <div class="container">
  <link href="https://fonts.cdnfonts.com/css/varino" rel="stylesheet">
  <div class="video-wrapper">
    <video playsinline autoplay muted loop poster="cake.jpg">
      <source src="https://st3.depositphotos.com/1332662/31892/v/600/depositphotos_318921364-stock-video-synthwave-wireframe-net-and-stars.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <div class="animation" style="height=100%">
      <h1> TRASCENDENCE </h1>
      <div class="button">
        <router-link to="/no42">
          <button class="login">login</button>
        </router-link>
      </div>
      <div class="ball"></div>
      <div class="left-bar"></div>
      <div class="right-bar"></div>
    </div>
  </div>
  </div>
  </template>
  
  <style scoped>
  
  @import url('https://fonts.cdnfonts.com/css/varino');
  
  h1
  {
    color: #ffffff;
    font-family: 'Varino', sans-serif;
    text-align: center;
    line-height: 700%;
  }
  
  video {
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  .video-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .container
  {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .pong-container {
    position: relative;
    width: 600px;
    height: 400px;
    background-color: #000;
    overflow: hidden;
  }
  
  .ball {
    position: absolute;
    top: 10 vh;
    left: 20vh;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border-radius: 50%;
    animation: ball-animation 20s infinite linear;
  }
  
  .right-bar
  {
    position: absolute;
    top: 10%;
    left: 80vh;
    width: 10px;
    height: 60px;
    border-radius: 40%;
    background-image: linear-gradient(
      92.88deg,
      #ac3213 9.16%,
      #ec697b 43.89%,
      #f09f9f 64.72%
    );
    animation: bar-animation-right 10s infinite linear;
  }
  
  .left-bar {
    position: absolute;
    top: 10%;
    left: 20vh;
    width: 10px;
    height: 60px;
    border-radius: 40%;
    background-image: linear-gradient(
      92.88deg,
      #ac3213 9.16%,
      #ec697b 43.89%,
      #f09f9f 64.72%
    );
    animation: bar-animation-left 10s infinite linear;
  }
  
  .right-bar {
    right: 0;
  }
  
  .button
  {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50%;
  }
  
  .animation
  {
    overflow: hidden;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 40px;
    border:1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    margin: auto;
    width: 70%;
    position: absolute;
    top: 10%;
    left: 15%;
    height: 80%;
  }
  
  .aa {
    background-image: linear-gradient(
      92.88deg,
      #455eb5 9.16%,
      #5643cc 43.89%,
      #673fd7 64.72%
    );
    border-radius: 8px;
    border-style: none;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    flex-shrink: 0;
    font-family: 'Varino', sans-serif;
    font-size: 16px;
    font-weight: 500;
    height: 4rem;
    padding: 0 1.6rem;
    text-align: center;
    text-shadow: rgba(0, 0, 0, 0.25) 0 3px 8px;
    transition: all 0.5s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }
  
  .aa:hover {
    box-shadow: rgba(80, 63, 205, 0.5) 0 1px 30px;
    transition-duration: 0.1s;
  }
  
  .login {
    background-color: #000;
    height: 4rem;
    padding: 0.6em 2em;
    border: none;
    outline: none;
    color: rgb(218, 203, 203);
    cursor: pointer;
    position: relative;
    border-radius: 20px;
    user-select: none;
    touch-action: manipulation;
    font-family: 'Varino', sans-serif;
    font-size: 17px;
  }
  
  .login:before {
    content: "";
    background: linear-gradient(
      45deg,
      #ff0000,
      #ff7300,
      #fffb00,
      #48ff00,
      #00ffd5,
      #002bff,
      #7a00ff,
      #ff00c8,
      #ff0000
    );
    position: absolute;
    top: -2px;
    left: -2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    -webkit-filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: glowing-button-85 20s linear infinite;
    transition: opacity 0.3s ease-in-out;
    border-radius: 20px;
  }
  
  @keyframes glowing-button-85 {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 400% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
  
  .login:after {
    z-index: -1;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 20px;
  }
  
  @media (min-width: 768px) {
    .login {
      padding: 0 2.6rem;
    }
  }
  
  @keyframes bar-animation-left {
    0% {
      top: 10%;
      left: 19%;
    }
    5% {
      top: 10%;
      left: 19%;
    }
    9% {
      top: 24%;
      left: 19%;
    }
    13% {
      top: 17%;
      left: 19%;
    }
    24.9% {
      top: 50%;
      left: 19%;
    }
    47% {
      top: 80%;
      left: 19%;
    }
    52% {
      top: 61%;
      left: 19%;
    }
    56% {
      top: 64%;
      left: 19%;
    }
    58.1% {
      top: 54%;
      left: 19%;
    }
    70% {
      top: 74%;
      left: 19%;
    }
    84% {
      top: 12%;
      left: 19%;
    }
    91.3% {
      top: 11%;
      left: 19%;
    }
    100% {
      top: 10%;
      left: 19%;
    }
  }
  
  @keyframes bar-animation-right {
    0% {
      top: 80%;
      left: 80%;
    }
    8.3% {
      top: 51%;
      left: 80%;
    }
    20% {
      top: 60%;
      left: 80%;
    }
    25% {
      top: 34%;
      left: 80%;
    }
    41.5% {
      top: 80%;
      left: 80%;
    }
    46% {
      top: 36%;
      left: 80%;
    }
    52% {
      top: 18%;
      left: 80%;
    }
    58.1% {
      top: 53%;
      left: 80%;
    }
    66% {
      top: 14%;
      left: 80%;
    }
    70% {
      top: 30%;
      left: 80%;
    }
    74.7% {
      top: 60%;
      left: 80%;
    }
    91.3% {
      top: 70%;
      left: 80%;
    }
    100% {
      top: 80%;
      left: 80%;
    }
  }
  @keyframes ball-animation {
    0% {
      top: 34%;
      left: 52%;
    }
    8.3% {
      top: 60%;
      left: 79%;
    }
    24.9% {
      top: 75%;
      left: 21%;
    }
    30% {
      top: 90%;
      left: 27%;
    }
    41.5% {
      top: 70%;
      left: 79%;
    }
    58.1% {
      top: 30%;
      left: 21%;
    }
    74.7% {
      top: 30%;
      left: 79%;
    }
    79% {
      top: 26%;
      left: 50%;
    }
    91.3% {
      top: 22%;
      left: 21%;
    }
    100% {
      top: 34%;
      left: 52%;
    }
  }
  
  </style>
  