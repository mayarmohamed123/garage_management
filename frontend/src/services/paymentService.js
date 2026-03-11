import { apiSlice } from './apiSlice';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: (invoiceId) => `/invoices/${invoiceId}/payments`,
      providesTags: ['Payment'],
    }),
    recordPayment: builder.mutation({
      query: ({ invoiceId, ...data }) => ({
        url: `/invoices/${invoiceId}/payments`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment', 'Invoice'],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useRecordPaymentMutation,
} = paymentApiSlice;
