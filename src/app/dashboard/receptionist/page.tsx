import LiveTokenDisplay from '@/components/features/reception/live-token-display'
import PatientRegistrationForm from '@/components/features/reception/patient-registration-form'
import React from 'react'

function ReceptionistDashboard() {
    return (
        <div className='flex gap-4 h-[calc(100vh-140px)] overflow-hidden flex-wrap md:flex-nowrap'>
            <PatientRegistrationForm />
            <LiveTokenDisplay />
        </div>
    )
}

export default ReceptionistDashboard