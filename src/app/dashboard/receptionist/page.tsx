"use client";
import React, { useState } from 'react'
import LiveTokenDisplay from '@/components/features/reception/live-token-display'
import PatientRegistrationForm from '@/components/features/reception/patient-registration-form'
import { TokenData } from '@/types/token'

function ReceptionistDashboard() {
    const [tokens, setTokens] = useState<TokenData[]>([]);

    const handleNewToken = (token: TokenData) => {
        setTokens(prev => [...prev, token]);
    };

    return (
        <div className='flex gap-4 h-[calc(100vh-140px)] overflow-hidden flex-wrap md:flex-nowrap'>
            <PatientRegistrationForm onRegister={handleNewToken} lastTokenNo={tokens.length} />
            <LiveTokenDisplay tokens={tokens} />
        </div>
    )
}

export default ReceptionistDashboard
