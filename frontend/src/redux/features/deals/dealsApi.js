import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

const dealsApi = createApi({
  reducerPath: 'dealsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/deal`,
    credentials: 'include',
  }),
  tagTypes: ['Deals'],
  endpoints: (builder) => ({
    getAllDeals: builder.query({
      query: () => ({
        url: '',
        method: 'GET',
      }),
      providesTags: ['Deals'],
    }),
  }),
});

export const { useGetAllDealsQuery } = dealsApi;

export default dealsApi;
