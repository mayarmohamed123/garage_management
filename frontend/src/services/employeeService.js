import { apiSlice } from './apiSlice';

export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => '/employees',
      providesTags: ['Employee'],
    }),
    updateEmployeeRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/employees/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Employee'],
    }),
    toggleEmployeeStatus: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}/status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Employee'],
    }),
    createEmployee: builder.mutation({
      query: (data) => ({
        url: '/employees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employee'],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Employee'],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useUpdateEmployeeRoleMutation,
  useToggleEmployeeStatusMutation,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApiSlice;
