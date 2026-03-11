import { apiSlice } from './apiSlice';

export const invoiceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: (params) => ({
        url: '/invoices',
        params,
      }),
      providesTags: ['Invoice'],
    }),
    getInvoice: builder.query({
      query: (id) => `/invoices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),
    generateInvoice: builder.mutation({
      query: (serviceOrderId) => ({
        url: '/invoices',
        method: 'POST',
        body: { serviceOrderId },
      }),
      invalidatesTags: ['Invoice', 'ServiceOrder'],
    }),
    updateInvoiceStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/invoices/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Invoice'],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useGenerateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
} = invoiceApiSlice;
