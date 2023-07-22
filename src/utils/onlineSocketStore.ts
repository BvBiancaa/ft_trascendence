import { Socket } from "socket.io-client";
import { OnlineSocket } from "./interfaces";
import { defineStore } from "pinia";

export const useOnlineSocketStore = defineStore("onlinesocket", {
  state: (): OnlineSocket => ({
    socket: null,
  }),
  getters: {
    getSocket(state) {
      return state.socket;
    },
  },
  actions: {
    setSocket(socket: Socket) {
      this.$state.socket = socket;
    },
  },
});
