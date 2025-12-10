import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

export interface UserType {
  _id: string;
  name?: string;
  email: string;
  role?: string;
  age?: string;
  description?: string;
  createdAt?: string;
}

interface UsersResponse {
  message: string;
  users: UserType[];
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: UserType;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    createUser: builder.mutation<any, any>({
      query: (userData) => ({
        url: '/users/createUser',
        method: 'POST',
        body: userData,
      }),
    }),

    getAllUsers: builder.query<UsersResponse, void>({
      query: () => ({
        url: '/users/getAllUsers',
        method: 'GET',
      }),
    }),
    getUserDetails: builder.query<UserType, string>({
      query: (id) => ({
        url: `/users/getUserDetails/${id}`,
        method: 'GET',
      }),
    }),

    updateUserDetails: builder.mutation<UserType, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/users/updateUserDetails/${id}`,
        method: 'PUT',
        body: data,
      }),
      
    }),

  }),
});

export const {
  useLoginMutation,
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
} = apiSlice;
