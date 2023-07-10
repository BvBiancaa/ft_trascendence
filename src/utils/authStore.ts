import { defineStore } from "pinia";
import axios from "axios";
import {
  OnlineUser,
  OnlineUsers,
  User,
  OnlineSocket,
  JoinedChan,
  Message,
} from "./interfaces";
import { Socket } from "socket.io-client";

export const useCurrentUserStore = defineStore("currentUser", {
  state: (): User => ({
    authenticated: false,
    currentToken: "",
    id: 0,
    uid: "",
    name: "",
    image: "",
    login: "",
    displayName: "",
    email: "",
    nickName: "",
    wins: 0,
    loses: 0,
    elo: 0,
    gamePlayed: 0,
    friends: [],
    listenersActive: false,
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
    updateUser(user: User) {
      this.$state = user;
    },
    async updateUserFromDb() {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getself/`;
      const updatedUser = await axios.get(url, {
        headers: { Authorization: `Bearer ${this.$state.currentToken}` },
      });
      this.$state = updatedUser.data;
    },
    async loginUsr(email: string, password: string) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/login`;
      const resp = await axios.post(url, {
        email: email,
        password: password,
      });
      await this.getUserFromDb(resp.data.accessToken);
      return;
    },
    async getUserFromDb(token: string) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getself/`;
      axios
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((data) => this.setUser(data.data, token));
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

export const useJoinedChansStore = defineStore("joinedChansStore", {
  state: (): { joinedChans: JoinedChan[] } => ({
    joinedChans: [],
  }),
  getters: {
    getChans(state): JoinedChan[] {
      return state.joinedChans;
    },
  },
  actions: {
    setChans(channels: JoinedChan[]) {
      this.$state.joinedChans = channels;
    },
    setUsrList(name: string, list: OnlineUser[], ops: OnlineUser[]) {
      const idx = this.$state.joinedChans.findIndex(
        (chan) => chan.name == name
      );
      if (idx != -1) {
        this.$state.joinedChans[idx].users = list;
        this.$state.joinedChans[idx].ops = ops;
      }
      console.log(this.$state.joinedChans[idx]);
    },
    getChan(name: string): JoinedChan | undefined {
      const idx = this.$state.joinedChans.findIndex(
        (chan) => chan.name == name
      );
      if (idx != -1) {
        return this.$state.joinedChans[idx];
      } else {
        return undefined;
      }
    },
    addMsg(msg: Message) {
      const chan = this.getChan(msg.chan);
      if (chan) {
        chan.messages.push(msg);
      }
    },
  },
});
