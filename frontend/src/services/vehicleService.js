import { apiSlice } from './apiSlice';

export const vehicleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: (params) => ({
        url: '/vehicles',
        params,
      }),
      providesTags: ['Vehicle'],
    }),
    getVehicle: builder.query({
      query: (id) => `/vehicles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Vehicle', id }],
    }),
    registerVehicle: builder.mutation({
      query: (data) => ({
        url: '/vehicles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Vehicle', 'Customer'],
    }),
    updateVehicle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/vehicles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Vehicle', { type: 'Vehicle', id }],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetVehicleQuery,
  useRegisterVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehicleApiSlice;
