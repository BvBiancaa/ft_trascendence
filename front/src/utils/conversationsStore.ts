import { defineStore } from "pinia";
import { Conversations, Message, Conversation } from "./interfaces";

export const useConversationsStore = defineStore("conversations", {
  state: (): Conversations => ({
    conversations: [],
    fetched: false,
  }),
  getters: {
    getAll(state) {
      return state.conversations;
    },
  },
  actions: {
    setMsgs(conversations: Conversations) {
      this.$state = conversations;
    },
    getMsgsWithUsr(id: number): Message[] {
      const conv = this.conversations.find((conv) => conv.id == id);
      return conv?.messages ?? [];
    },
    getOrCreateConvWithUsr(id: number): Conversation {
      let conv = this.conversations.find((conv) => conv.id === id);
      if (!conv) {
        conv = {
          id: id,
          messages: [],
          updated: false,
        };
        this.conversations.push(conv);
      }
      return conv;
    },
    updateConvNick(id: number, newNick: string) {
      const conv = this.conversations.find((conv) => conv.id == id);
      if (conv) {
        conv.nick = newNick;
      }
    },
    checkIfUpdated(lastonline: string) {
      for (let i = 0; i < this.conversations.length; i++) {
        for (let j = 0; j < this.conversations[i].messages.length; j++) {
          if (this.conversations[i].messages[j].createdAt > lastonline) {
            this.conversations[i].updated = true;
            break;
          }
        }
      }
    },
  },
});
