import { defineStore } from "pinia";
import axios from "axios";
import { User, UserForModal } from "./interfaces";

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
    friends: [],
    listenersActive: false,
    modalOpen: { id: 0, chat: false },
    lastOnline: "",
    blockedUsrs: [],
    chanSettingsModal: "",
    gameRoomName: "",
    twoFaActive: false,
    showOnline: true,
    matches: [],
    stats: {
      played: 0,
      won: 0,
      lost: 0,
      elo: 0,
    },
    isNew: true,
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

    getHeaders() {
      return { headers: { Authorization: `Bearer ${this.currentToken}` } };
    },

    async updateUserFromDb() {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getself/`;
      const updatedUser = await axios.get(url, this.getHeaders());
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

    async loginUsr2fa(email: string, password: string, twofacode: string) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/login2fa`;
      const resp = await axios.post(url, {
        email: email,
        password: password,
        twofacode: twofacode,
      });
      await this.getUserFromDb(resp.data.accessToken);
      return;
    },

    async getUserFromDb(token: string) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getself/`;
      axios
        .get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => this.setUser(data.data, token));
    },

    async updateUserInDb(data: any) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/update`;
      const updated = await axios.patch(url, data, this.getHeaders());

      return this.updateUser(updated.data);
    },

    async changeImg(formData: FormData) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/img`;
      try {
        const updated = await axios.post(url, formData, this.getHeaders());
        this.updateUser(updated.data);
      } catch (error) {
        console.log(error);
      }
    },

    async getUserList() {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getusers/`;
      try {
        const data = await axios.get(url, this.getHeaders());
        return data.data;
      } catch (e) {
        console.log(e);
      }
    },

    async getFriendFromId(id: number) {
      const nick = await this.getOtherUserDetails(id);
      const user = {
        id: id,
        nick: nick.nick,
      };
      return user;
    },

    async addFriend(id: number) {
      const friends = this.friends;
      if (!friends.includes(id)) {
        friends.push(id);
        this.updateUserInDb({ friends: friends });
      }
    },

    async removeFriend(id: number) {
      const friends = this.friends;
      if (friends.includes(id)) {
        friends.splice(friends.indexOf(id), 1);
        this.updateUserInDb({ friends: friends });
      }
    },

    async getFriends() {
      const friendsPromises = await this.friends.map((id) =>
        this.getFriendFromId(id)
      );
      const friends = await Promise.all(friendsPromises);
      return friends.sort((a, b) => a.id - b.id);
    },

    async getLeaderboard() {
      const users = await this.getUserList();

      const usersWithStatsPromises = users.map(async (element: any) => {
        const stats = await this.getOtherUsrStats(element.id);
        const userWithStats = {
          nick: element.nickName,
          image: element.image,
          id: element.id,
          ...stats,
        };
        return userWithStats;
      });

      const usersWithStats = await Promise.all(usersWithStatsPromises);
      return usersWithStats.sort((a: any, b: any) => b.elo - a.elo);
    },

    async blockUsr(id: number) {
      if (!this.blockedUsrs.includes(id)) {
        this.blockedUsrs.push(id);
        this.updateUserInDb({
          blockedUsrs: this.blockedUsrs,
        });
      }
    },

    async unblockUsr(id: number) {
      const idx = this.blockedUsrs.indexOf(id);
      if (idx != -1) {
        this.blockedUsrs.splice(idx, 1);
        this.updateUserInDb({
          blockedUsrs: this.blockedUsrs,
        });
      }
    },

    async amIBlockedBy(id: number) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getuser/${id}`;
      const otherUser = await axios.get(url, this.getHeaders());
      const blockList = otherUser.data.blockedUsrs;
      if (blockList.includes(this.id)) {
        return true;
      }
      return false;
    },

    async getOtherUserDetails(id: number): Promise<UserForModal> {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getuser/${id}`;
      try {
        const data = await axios.get(url, this.getHeaders());
        const nick = data.data.nickName;
        const image = data.data.image;
        const id = data.data.id;
        return {
          nick: nick,
          image: image,
          id: id,
        };
      } catch (e) {
        return {
          nick: "",
          image: "",
          id: 0,
        };
      }
    },
    setModal(id: number, chat: boolean) {
      this.$state.modalOpen = { id: id, chat: chat };
    },
    setChanModal(chan: string) {
      this.$state.chanSettingsModal = chan;
    },
    async getOtherUsrNick(id: number) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getuser/${id}`;
      try {
        const response = await axios.get(url, this.getHeaders());
        return response.data.nickName;
      } catch (error) {
        console.log(error);
      }
    },
    async activate2fa() {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/generate2fa`;
      try {
        const response = await axios.post(url, {}, this.getHeaders());
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async confirm2fa(code: string) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/2faOn`;
      try {
        await axios.post(
          url,
          {
            twoFactorAuthenticationCode: code,
          },
          this.getHeaders()
        );
        await this.updateUserInDb({ twoFaActive: true });
        return "success";
      } catch (error) {
        return "error";
      }
    },
    async remove2fa() {
      this.updateUserInDb({ twoFaActive: false });
    },

    async getMyMatches() {
      const url =
        import.meta.env.VITE_BACK_BASE_URL + `/usrs/getmatches/${this.id}`;
      const matches = await axios.get(url, this.getHeaders());
      this.matches = matches.data;
    },

    async getOtherUsrMatches(id: number) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getmatches/${id}`;
      const matches = await axios.get(url, this.getHeaders());
      return matches.data;
    },

    async getOtherUsrStats(id: number) {
      const url = import.meta.env.VITE_BACK_BASE_URL + `/usrs/getStats/${id}`;
      const stats = await axios.get(url, this.getHeaders());
      return stats.data;
    },
  },
});
