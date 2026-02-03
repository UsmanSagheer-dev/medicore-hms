import React from 'react';
import Link from 'next/link';
import { User, Mail, Lock, UserPlus, Phone } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

function Signup() {
  return (
    <div className='w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl my-8'>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 pt-4">Create Account</h1>
        <p className="text-white/70">Join MediCore HMS to manage your healthcare services</p>
      </div>

      <form className='space-y-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-white/90 ml-1'>Full Name</label>
            <Input
              type='text'
              placeholder='John Doe'
              className='bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
              icon={<User className='w-4 h-4 text-white/40' />}
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-white/90 ml-1'>Phone Number</label>
            <Input
              type='tel'
              placeholder='+92 300 0000000'
              className='bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
              icon={<Phone className='w-4 h-4 text-white/40' />}
            />
          </div>
        </div>

        <div className='space-y-1.5'>
          <label className='text-sm font-medium text-white/90 ml-1'>Email Address</label>
          <Input
            type='email'
            placeholder='name@company.com'
            className='bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
            icon={<Mail className='w-4 h-4 text-white/40' />}
          />
        </div>

        <div className='space-y-1.5'>
          <label className='text-sm font-medium text-white/90 ml-1'>User Role</label>
          <Select
            options={[
              { label: 'Doctor', value: 'doctor' },
              { label: 'Receptionist', value: 'receptionist' },
              { label: 'Admin', value: 'admin' },
            ]}
            className='bg-white/5 border-white/10 text-white h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-white/90 ml-1'>Password</label>
            <Input
              type='password'
              placeholder='••••••••'
              className='bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
              icon={<Lock className='w-4 h-4 text-white/40' />}
            />
          </div>
          <div className='space-y-1.5'>
            <label className='text-sm font-medium text-white/90 ml-1'>Confirm Password</label>
            <Input
              type='password'
              placeholder='••••••••'
              className='bg-white/5 border-white/10 text-white placeholder:text-white/40 h-11 rounded-xl focus:ring-2 focus:ring-blue-500/50'
              icon={<Lock className='w-4 h-4 text-white/40' />}
            />
          </div>
        </div>

        <div className="flex items-start space-x-2 ml-1 pb-2">
          <input type="checkbox" id="terms" className="mt-1 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50" />
          <label htmlFor="terms" className="text-sm text-white/70 leading-snug">
            I agree to the <Link href="#" className="underline text-blue-400">Terms of Service</Link> and <Link href="#" className="underline text-blue-400">Privacy Policy</Link>
          </label>
        </div>

        <Button className='w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2'>
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