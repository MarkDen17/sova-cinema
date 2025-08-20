import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/constansts";
import { UserState } from "../user/userSlice";
import { Film } from "../../components/FilmsDashboard";

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

export interface GetFilmsResponse {
  success: boolean;
  data: Film[];
}

interface AddFilmResponse {
  success: boolean;
  data: Film;
}

interface DeleteFilmResponse {
  success: boolean;
  data: Film;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api` }),
  tagTypes: ['Films'],
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
    getFilms: builder.query<GetFilmsResponse, void>({
      query: () => ({
        url: "/films.php",
      }),
      providesTags: ["Films"],
    }),
    addFilm: builder.mutation<AddFilmResponse, { title: string }>({
      query: (filmTitle) => ({
        url: "/films.php",
        method: "POST",
        body: filmTitle,
      }),
      invalidatesTags: ["Films"],
    }),
    deleteFilm: builder.mutation<DeleteFilmResponse, { id: number }>({
      query: (id) => ({
        url: "/films.php",
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Films"],
    }),
    editTitle: builder.mutation<void, { id: number, newTitle: string }>({
      query: ({ id, newTitle }) => ({
        url: "/films.php",
        method: "PATCH",
        body: { id, newTitle },
      }),
      invalidatesTags: ["Films"],
    }),
  }),
});

export const { useCheckLoginQuery, useLoginMutation, useLogoutMutation, useGetFilmsQuery, useAddFilmMutation, useDeleteFilmMutation, useEditTitleMutation } = apiSlice;
