import { defineStore } from "pinia";

interface User {
  authenticated: boolean;
  currentToken: string;
  id: number;
  uid: string;
  name: string;
  image: string;
  login: string;
  displayName: string;
  email: string;
}

interface OnlineUser {
  displayName: string;
  id: number;
}

interface OnlineUsers {
  onlineUsers: OnlineUser[];
}

export const useCurrentUserStore = defineStore("currentUser", {
  state: () => ({
    authenticated: false,
    currentToken: "",
    id: 0,
    uid: "",
    name: "",
    image: "",
    login: "",
    displayName: "",
    email: "",
  }),
  getters: {
    getUser(state): User {
      return state;
    },
  },
  actions: {
    setUser(user: User, token: string) {
      user.authenticated = true;
      user.currentToken = token;
      this.$state = user;
    },
  },
});

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
  },
});
