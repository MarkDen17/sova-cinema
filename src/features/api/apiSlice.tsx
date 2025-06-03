import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/constansts";
import { UserState } from "../user/userSlice";

interface CheckAuthResponse {
  success: boolean;
  data: UserState;
}

interface LoginResponse {
  success: boolean;
  data: UserState;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

interface LoginData {
  username: string;
  password: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api` }),
  endpoints: (builder) => ({
    checkLogin: builder.query<CheckAuthResponse, void>({
      query: () => "/login.php",
    }),
    login: builder.mutation<LoginResponse, LoginData>({
      query: (loginData) => ({
        url: "/login.php",
        method: "POST",
        body: loginData,
      }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/logout.php",
        method: "GET",
      })
    }),
  }),
});

export const { useCheckLoginQuery, useLoginMutation, useLogoutMutation } = apiSlice;
