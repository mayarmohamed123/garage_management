import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../services/authService';
import { AlertCircle, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const [register, { isLoading, error: apiError }] = useRegisterMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword: _confirmPassword, ...registerData } = data;
      await register(registerData).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Failed to register:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="max-w-md w-full space-y-8 p-10 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 blur-[100px] rounded-full" />

        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
          <p className="mt-3 text-slate-400 font-medium">Join the GaragePro network today</p>
        </div>

        <form className="mt-10 space-y-5 relative z-10" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-center animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={18} className="mr-2 shrink-0" />
              {apiError.data?.message || 'Registration failed'}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">First Name</label>
              <input
                {...registerField('firstName')}
                className={`w-full px-4 py-3 bg-slate-800 border ${errors.firstName ? 'border-red-500/50' : 'border-slate-700'} rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder:text-slate-600`}
                placeholder="John"
              />
              {errors.firstName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Last Name</label>
              <input
                {...registerField('lastName')}
                className={`w-full px-4 py-3 bg-slate-800 border ${errors.lastName ? 'border-red-500/50' : 'border-slate-700'} rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder:text-slate-600`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Email Address</label>
            <input
              {...registerField('email')}
              type="email"
              className={`w-full px-4 py-3 bg-slate-800 border ${errors.email ? 'border-red-500/50' : 'border-slate-700'} rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder:text-slate-600`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Password</label>
            <input
              {...registerField('password')}
              type="password"
              className={`w-full px-4 py-3 bg-slate-800 border ${errors.password ? 'border-red-500/50' : 'border-slate-700'} rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder:text-slate-600`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1">Confirm Password</label>
            <input
              {...registerField('confirmPassword')}
              type="password"
              className={`w-full px-4 py-3 bg-slate-800 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-slate-700'} rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder:text-slate-600`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-widest mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm font-medium relative z-10 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
