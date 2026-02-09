"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Building2, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateReceptionistProfile, resetReceptionistState } from '@/redux/slices/receptionistSlice';
import { useEffect } from 'react';

export default function ReceptionOnboarding() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.receptionist);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    hospitalName: '',
    department: 'General',
    shiftTiming: 'Morning',
    experience: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  useEffect(() => {
    if (success) {
      toast.success('Setup completed successfully!');
      router.push('/dashboard/receptionist');
      dispatch(resetReceptionistState());
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, router, dispatch]);

  const handleSubmit = async () => {
    dispatch(updateReceptionistProfile(formData));
  };

  return (
    <div className='w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl'>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reception Setup</h1>
          <p className="text-white/60">Help us customize your workspace</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-2 w-8 rounded-full transition-all duration-300 ${step >= s ? 'bg-blue-500' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-8 min-h-[300px]">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Workplace Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Hospital Name</label>
                <Input
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="City General Hospital"
                  className="bg-white/5 border-white/10 text-white"
                  icon={<Building2 className="w-4 h-4 text-white/40" />}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Department</label>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  options={[
                    { label: 'General', value: 'General' },
                    { label: 'OPD', value: 'OPD' },
                    { label: 'Emergency', value: 'Emergency' },
                    { label: 'Cardiology', value: 'Cardiology' },
                  ]}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Working Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Shift Timing</label>
                <Select
                  name="shiftTiming"
                  value={formData.shiftTiming}
                  onChange={handleChange}
                  options={[
                    { label: 'Morning (8AM - 4PM)', value: 'Morning' },
                    { label: 'Evening (4PM - 12AM)', value: 'Evening' },
                    { label: 'Night (12AM - 8AM)', value: 'Night' },
                  ]}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Years of Experience</label>
                <Input
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  className="bg-white/5 border-white/10 text-white"
                  icon={<User className="w-4 h-4 text-white/40" />}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center py-8">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">All Set!</h2>
            <p className="text-white/60 max-w-md mx-auto">
              Your profile has been configured for the {formData.department} department. You're ready to start managing patients.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-between items-center">
        {step > 1 && step < 3 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            Go Back
          </button>
        )}
        <div className="ml-auto">
          <Button 
            onClick={handleNext}
            isLoading={loading}
            className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-2 group"
          >
            {step === 3 ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
