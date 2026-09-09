import React from 'react';
import logoImg from '../assets/logo.jpg';
import { Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-600 pt-16 pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-200">
          
          {/* Col 1: About & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src={logoImg} 
                alt="MANEBZ / MANABS Logo" 
                loading="lazy"
                decoding="async"
                className="h-9 w-auto object-contain rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Founded on 27th February 2014. Pioneers in Strategic Facilities Management, HR Staffing & Payroll, Logistics & Warehouse, and Statutory Compliance.
            </p>
            <div className="text-[11px] text-gray-500 space-y-1">
              <p>✓ 100% PF & ESI Registered</p>
              <p>✓ PAN & GST Compliant</p>
              <p>✓ ISO & EMS Quality Standards</p>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Service Spectrum
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('services', 'hr-staffing')} className="hover:text-red-600 text-left font-medium">
                  HR Staffing & Payroll Management
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', 'logistics-warehouse')} className="hover:text-red-600 text-left font-medium">
                  Logistics & Warehouse Management
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', 'facilities-management')} className="hover:text-red-600 text-left font-medium">
                  Integrated Facilities Management
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', 'real-estate')} className="hover:text-red-600 text-left font-medium">
                  Real Estate Advisory & Relocation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services', 'compliance-management')} className="hover:text-red-600 text-left font-medium">
                  Compliance Management & Audits
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('home')} className="hover:text-sky-600">Home</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-sky-600">Know Us Better (About)</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-sky-600">Our 5 Core Verticals</button></li>
              <li><button onClick={() => onNavigate('payroll')} className="hover:text-red-600 font-bold">Payroll & Statutory Suite</button></li>
              <li><button onClick={() => onNavigate('careers')} className="hover:text-red-600 font-bold">Careers & Openings</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-sky-600">Request Proposal</button></li>
              <li>
                <button 
                  onClick={() => onNavigate('admin')} 
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-red-600 bg-sky-50 hover:bg-red-50 px-2 py-0.5 rounded-md border border-sky-200 mt-1 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Control Center</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Base of Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Base of Operations
            </h4>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Delhi & NCR • Uttar Pradesh • Haryana • Uttarakhand</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <span>+91 11 4982 3000 / +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <span>contact@manabs.com</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <Clock className="w-4 h-4 shrink-0" />
                <span>24/7/365 Round-the-Clock Support</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} MANABS / MANEBZ Facilities & Workforce Management. All rights reserved. Founded 27th Feb 2014.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('admin')} className="hover:text-red-600 cursor-pointer font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
            <span className="hover:text-sky-600 cursor-pointer">Statutory Compliance Policy</span>
            <span className="hover:text-sky-600 cursor-pointer">ISO & EMS Framework</span>
            <span className="hover:text-sky-600 cursor-pointer">Privacy & Governance</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
