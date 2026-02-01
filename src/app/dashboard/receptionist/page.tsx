import LiveTokenDisplay from '@/components/features/reception/live-token-display'
import PatientRegistrationForm from '@/components/features/reception/patient-registration-form'
import React from 'react'

function ReceptionistDashboard() {
    return (
        <div className='flex gap-4'>
            <PatientRegistrationForm />
            <LiveTokenDisplay />
        </div>
    )
}

export default ReceptionistDashboard