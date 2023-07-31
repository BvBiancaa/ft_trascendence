import { defineStore } from "pinia";

import { OnlineUser, OnlineUsers } from "./interfaces";

export const useOnlineUsersStore = defineStore("onlineUsers", {
  state: (): OnlineUsers => ({
    onlineUsers: [],
  }),
  getters: {
    getUser(state) {
      return state.onlineUsers;
    },
  },
  actions: {
    setUsers(users: OnlineUser[]) {
      this.$state.onlineUsers = users;
    },
    getNickFromId(id: number) {
      return this.onlineUsers.find((usr) => usr.id == id);
    },
  },
});
