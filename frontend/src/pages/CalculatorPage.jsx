import React from 'react';
import { CostCalculatorView } from '../components/CostCalculatorModal';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

export default function CalculatorPage({ onNavigate }) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Interactive Cost & Manpower Estimator | MANABS"
        description="Estimate integrated facility management, mechanized housekeeping, security guarding, and compliant payroll staffing costs in real time."
        keywords="facility management cost calculator, staffing pricing estimator, manpower budgeting tool, PF ESI calculator India"
      />
      
      <div className="max-w-6xl mx-auto space-y-8">
        <CostCalculatorView isModal={false} />
      </div>
    </div>
  );
}
