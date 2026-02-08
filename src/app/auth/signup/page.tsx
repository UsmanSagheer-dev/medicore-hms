"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, UserPlus, Phone, Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { registerUser, clearError } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

function Signup() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'RECEPTIONIST' as 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role?.toLowerCase();
      if (role) {
        router.push(`/dashboard/${role}`);
        toast.success(`Welcome ${user.name}`);
      }
    }
    
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, router, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    dispatch(registerUser(registerData));
  };

  return (
    <div className='w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl my-8'>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 pt-4">Create Account</h1>
        <p className="text-white/70">Join MediCore HMS to manage your healthcare services</p>
      </div>

      <form className='space-y-5' onSubmit={handleSubmit}>
        <div className='space-y-1.5'>
          <label className='text-sm font-medium text-white/90 ml-1'>Full Name</label>
          <Input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='John Doe'
            required
            className='bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
            icon={<User className='w-4 h-4 text-white/40' />}
          />
        </div>

        <div className='space-y-1.5'>
          <label className='text-sm font-medium text-white/90 ml-1'>Email Address</label>
          <Input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='name@company.com'
            required
            className='bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
            icon={<Mail className='w-4 h-4 text-white/40' />}
          />
        </div>

        <div className='space-y-1.5'>
          <label className='text-sm font-medium text-white/90 ml-1'>User Role</label>
          <Select
            name='role'
            value={formData.role}
            onChange={handleChange}
            options={[
              { label: 'Doctor', value: 'DOCTOR' },
              { label: 'Receptionist', value: 'RECEPTIONIST' },
              { label: 'Admin', value: 'ADMIN' },
            ]}
            required
            className='bg-white/5 border-white/10 text-white h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-white/90 ml-1'>Password</label>
            <Input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='••••••••'
              required
              className='bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
              icon={<Lock className='w-4 h-4 text-white/40' />}
            />
          </div>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-white/90 ml-1'>Confirm Password</label>
            <Input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='••••••••'
              required
              className='bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
              icon={<Lock className='w-4 h-4 text-white/40' />}
            />
          </div>
        </div>

        <div className="flex items-start space-x-2 ml-1 pb-2">
          <input type="checkbox" id="terms" required className="mt-1 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50" />
          <label htmlFor="terms" className="text-sm text-white/70 leading-snug">
            I agree to the <Link href="#" className="underline text-blue-400">Terms of Service</Link> and <Link href="#" className="underline text-blue-400">Privacy Policy</Link>
          </label>
        </div>

        <Button 
          type="submit"
          isLoading={loading}
          className='w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2'
        >
          <UserPlus className='w-5 h-5' />
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/60 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-white font-semibold hover:underline decoration-blue-500 underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
