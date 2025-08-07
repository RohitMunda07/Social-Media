import React, { useState } from 'react';
import './style.css';
import ContentSection from '../Components/ContentSection.jsx';

export default function Home() {
    return (
        <div className='h-[90vh] bg-amber-100 overflow-hidden'>
            <section className='flex h-full'>
                <ContentSection />
            </section>
        </div>
    );
}
