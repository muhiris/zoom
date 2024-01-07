import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api/axios";
import { errorHandler } from "../../errorHanlder";

export const getAllChat = createAsyncThunk(
    "chat/getAll",
    async ({ cursor = null, limit = 20 }, { rejectWithValue }) => {
        try {
            let query = `?limit=${limit}`;
            if (cursor) {
                query += `&cursor=${cursor}`;
            }

            const { data } = await axios.get(`/chat${query}`);
            return data;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    });


export const getChatById = createAsyncThunk(
    "chat/getById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/chat/${id}`);
            return data;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    });


export const createChat = createAsyncThunk(
    "chat/create",
    async ({ participants }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`/chat`, { participants });
            return data;
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    }
);


export const getMessages = createAsyncThunk(
    "chat/getMessages",
    async ({ chatId, cursor = null, limit = 20 }, { rejectWithValue }) => {
        try {

            let query = `?limit=${limit}`;
            if (cursor) {
                query += `&cursor=${cursor}`;
            }

            const { data } = await axios.get(`/message/${chatId}${query}`);
            return { messages:data.data.messages, hasNextPage:data.data.hasNextPage, chatId, success: data.success };
        } catch (error) {
            let err = errorHandler(error);
            return rejectWithValue(err);
        }
    }
);


