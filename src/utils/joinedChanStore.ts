import { JoinedChan, ChanMessage, OnlineUser } from "./interfaces";
import { defineStore } from "pinia";

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
    setUsrList(
      name: string,
      list: OnlineUser[],
      ops: OnlineUser[],
      banned: OnlineUser[],
      muted: OnlineUser[]
    ) {
      const idx = this.$state.joinedChans.findIndex(
        (chan) => chan.name == name
      );
      if (idx != -1) {
        this.$state.joinedChans[idx].users = list;
        this.$state.joinedChans[idx].ops = ops;
        this.$state.joinedChans[idx].bannedUsers = banned;
        this.$state.joinedChans[idx].mutedUsers = muted;
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
    addMsg(msg: ChanMessage) {
      const chan = this.getChan(msg.chan);
      if (chan) {
        chan.messages.push(msg);
      }
    },
  },
});
