import { createSelector, createSlice } from "@reduxjs/toolkit";
import { createChat, getAllChat, getChatById, getMessages } from "./chatAction";


const initialState = {
  loading: false,
  chats: [],
  hasNextPage: false,
  error: null,
  success: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      const { chatId, messageData } = payload.data;
  
      // Find the chat by chatId
      const chatIndex = state.chats.findIndex((chat) => chat._id.toString() === chatId.toString());
  
      if (chatIndex !== -1) {
        const updatedChats = [...state.chats]; // Create a copy of the chats array
        const updatedChat = { ...updatedChats[chatIndex] }; // Create a copy of the chat object
        if(messageData.type==="Text"){
          updatedChat.lastMessage = messageData.message;
        }
        else if(messageData.type==="Upload"){
          updatedChat.lastMessage = "File";
        }

        updatedChat.lastMessageTime = messageData.time;
        // Update the messages in the chat
        if (updatedChat.messages) {
          updatedChat.messages = [messageData, ...updatedChat.messages];
        } else {
          updatedChat.messages = [messageData];
        }
  
        // Update the chat in the copied chats array
        updatedChats[chatIndex] = updatedChat;
  
        // Return a new state object with the updated chats array
        return {
          ...state,
          chats: updatedChats,
        };
      }
  
      // If chat is not found, return the current state
      return state;
    },

    markAllMessagesAsRead: (state, { payload }) => {
      const { chatId } = payload.data;
  
      // Find the chat by chatId
      const chatIndex = state.chats.findIndex((chat) => chat._id.toString() === chatId.toString());
  
      if (chatIndex !== -1) {
        const updatedChats = [...state.chats]; // Create a copy of the chats array
        const updatedChat = { ...updatedChats[chatIndex] }; // Create a copy of the chat object
  
        updatedChat.unreadCount = 0;
  
        // Update the chat in the copied chats array
        updatedChats[chatIndex] = updatedChat;
  
        console.log("~~~~~~~~~~~~~~~~~~~~~~~I AM RUNNING MARK ALL MESSAGES AS READ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        // Return a new state object with the updated chats array
        return {
          ...state,
          chats: updatedChats,
        };
      }
  
      // If chat is not found, return the current state
      return state;
    },
    addChat: (state, { payload }) => {
      const { chatData } = payload.data;
  
      // Add the new chat to the chats array
      console.log("~~~~~~~~~~~~~~~~~~~~~~~I AM RUNNING ADD CHAT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
      return {
        ...state,
        chats: [chatData, ...state.chats],
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllChat.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllChat.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.chats = [...payload.data.chats, ...state.chats];
        state.hasNextPage = payload.data.hasNextPage;
        state.success = payload.success;
      })
      .addCase(getAllChat.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getChatById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = payload.success;
      })
      .addCase(getChatById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(createChat.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.chats = [payload.data, ...state.chats];
        state.success = payload.success;
      })
      .addCase(createChat.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getMessages.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, { payload }) => {
        console.log("I HAVE STARTED RUNNING")
        state.loading = false;
        //find index of chat
        let chatIndex = state.chats.findIndex((chat) => chat._id == payload.chatId);

        if (chatIndex !== -1) {
          const updatedChats = [...state.chats]; // Create a copy of the chats array
          const updatedChat = { ...updatedChats[chatIndex] }; // Create a copy of the chat object
  
          // Update the messages in the chat
          if (updatedChat.messages) {

            //dont add messages if they are already present
            let messageIds = updatedChat.messages.map((message)=>message._id);
            payload.messages = payload.messages.filter((message)=>!messageIds.includes(message._id));

            updatedChat.messages = [ ...updatedChat.messages,...payload.messages];
          } else {
            updatedChat.messages = [...payload.messages];
          }
          updatedChat.messagesHasNextPage = payload.hasNextPage;
  
          // Update the chat in the copied chats array
          updatedChats[chatIndex] = updatedChat;
  
          // Return a new state object with the updated chats array
          state.chats = updatedChats;
        }
        state.success = payload.success;
      })
      .addCase(getMessages.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

  },
});

//selectors
export const selectFilterChats = (state, search) => {
  let chats = state;
  if (search) {
    chats = chats.filter((chat) => chat.participants[0].name.toLowerCase().includes(search.toLowerCase()));
  }
  return chats;
}

const selectChatId = (_, chatId) => chatId; // An input selector for chatId
const selectChats = (state) => state.chat.chats; // An input selector for chats

export const selectChatMessages = createSelector(
  [selectChatId, selectChats],
  (chatId, chats) => {
    let chat = chats.find((chat) => chat._id === chatId);
    return (chat && chat?.messages) ? chat.messages : [];
  }
);


//get specific chat
export const selectChatById = createSelector(
  [selectChatId, selectChats],
  (chatId, chats) => {
    return chats.find((chat) => chat._id === chatId);
  }
);


export const { addMessage, markAllMessagesAsRead, addChat } = chatSlice.actions;

export default chatSlice.reducer;
