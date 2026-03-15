import React from 'react';
import { 
  useGetEmployeesQuery, 
  useUpdateEmployeeRoleMutation, 
  useToggleEmployeeStatusMutation,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation
} from '../../services/employeeService';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { UserCircle, Shield, Power, ShieldCheck, UserCog, AlertCircle, X, Plus, Trash2 } from 'lucide-react';

import Modal from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import { LoadingState } from '../../components/ui/States';

const employeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(['Manager', 'Technician', 'Accountant']),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

const EmployeesPage = () => {
  const { data, isLoading } = useGetEmployeesQuery();
  const [updateRole] = useUpdateEmployeeRoleMutation();
  const [toggleStatus] = useToggleEmployeeStatusMutation();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  
  const [error, setError] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: { role: 'Technician' }
  });

  const onSubmit = async (formData) => {
    setError('');
    try {
      await createEmployee(formData).unwrap();
      setIsModalOpen(false);
      reset();
    } catch (err) {
      setError(err.data?.message || 'Failed to create employee');
    }
  };

  const handleToggleStatus = async (id) => {
    setError('');
    try {
      await toggleStatus(id).unwrap();
    } catch (err) {
      setError(err.data?.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setError('');
    try {
      await deleteEmployee(id).unwrap();
    } catch (err) {
      setError(err.data?.message || 'Failed to delete employee');
    }
  };

  const handleRoleChange = async (id, role) => {
    setError('');
    try {
      await updateRole({ id, role }).unwrap();
    } catch (err) {
      setError(err.data?.message || 'Failed to update role');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Employee Management"
        description="Manage staff accounts, roles, and system access."
        actionText="New Employee"
        onAction={() => setIsModalOpen(true)}
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
                <AlertCircle size={18} className="mr-2" /> {error}
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={18} /></button>
        </div>
      )}

      {isLoading ? (
        <LoadingState message="Loading staff directory..." />
      ) : (
        <Table headers={['Employee', 'Email', 'Role', 'Status', 'Actions']}>
          {data?.data?.employees?.length > 0 ? data.data.employees.map(employee => (
            <TableRow key={employee.id}>
              <TableCell className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 border-2 border-white shadow-sm">
                   {employee.firstName.charAt(0)}
                </div>
                <div>
                   <p className="font-bold text-slate-900">{employee.firstName} {employee.lastName}</p>
                   <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">ID: {employee.id.slice(0,8)}</p>
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-600">{employee.email}</TableCell>
              <TableCell>
                 <select 
                    className="bg-white border border-slate-200 rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={employee.role}
                    onChange={(e) => handleRoleChange(employee.id, e.target.value)}
                 >
                    <option value="Manager">Manager</option>
                    <option value="Technician">Technician</option>
                    <option value="Accountant">Accountant</option>
                 </select>
              </TableCell>
              <TableCell>
                 <StatusBadge status={employee.status} type="auth" />
              </TableCell>
              <TableCell>
                 <div className="flex items-center space-x-2">
                    <button 
                       onClick={() => handleToggleStatus(employee.id)}
                       title={employee.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                       className={`p-2 rounded-xl transition-all ${employee.status === 'active' ? 'text-red-400 hover:bg-red-50 hover:text-red-600' : 'text-green-400 hover:bg-green-50 hover:text-green-600'}`}
                    >
                       <Power size={18} />
                    </button>
                    <button 
                       onClick={() => handleDelete(employee.id)}
                       className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">No staff members found.</TableCell>
            </TableRow>
          )}
        </Table>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Employee">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
              <input {...register('firstName')} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.firstName && <p className="text-[10px] text-red-500 font-bold">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
              <input {...register('lastName')} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.lastName && <p className="text-[10px] text-red-500 font-bold">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <input {...register('email')} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Default Password</label>
            <input {...register('password')} type="password" placeholder="Staff@123" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-[10px] text-red-500 font-bold">{errors.password.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Role</label>
            <select {...register('role')} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold">
              <option value="Manager">Manager</option>
              <option value="Technician">Technician</option>
              <option value="Accountant">Accountant</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isCreating}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'Register Employee'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeesPage;

