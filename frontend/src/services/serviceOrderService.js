import { apiSlice } from './apiSlice';

export const serviceOrderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServiceOrders: builder.query({
      query: (params) => ({
        url: '/service-orders',
        params,
      }),
      providesTags: ['ServiceOrder'],
    }),
    getServiceOrder: builder.query({
      query: (id) => `/service-orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'ServiceOrder', id }],
    }),
    createServiceOrder: builder.mutation({
      query: (data) => ({
        url: '/service-orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ServiceOrder'],
    }),
    updateServiceOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/service-orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => ['ServiceOrder', { type: 'ServiceOrder', id }],
    }),
    addPartToOrder: builder.mutation({
      query: ({ orderId, productId, quantity }) => ({
        url: `/service-orders/${orderId}/parts`,
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: (result, error, { orderId }) => ['ServiceOrder', { type: 'ServiceOrder', id: orderId }, 'Product'],
    }),
    removePartFromOrder: builder.mutation({
      query: ({ orderId, partId }) => ({
        url: `/service-orders/${orderId}/parts/${partId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { orderId }) => ['ServiceOrder', { type: 'ServiceOrder', id: orderId }, 'Product'],
    }),
    updateServiceOrder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/service-orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['ServiceOrder', { type: 'ServiceOrder', id }],
    }),
  }),
});

export const {
  useGetServiceOrdersQuery,
  useGetServiceOrderQuery,
  useCreateServiceOrderMutation,
  useUpdateServiceOrderStatusMutation,
  useAddPartToOrderMutation,
  useRemovePartFromOrderMutation,
  useUpdateServiceOrderMutation,
} = serviceOrderApiSlice;
