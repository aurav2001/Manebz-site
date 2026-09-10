import React, { useState, useEffect, useRef } from 'react';
import logoImg from '../assets/logo.jpg';
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
  Zap, 
  Bot, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck, 
  Building2, 
  Clock, 
  RefreshCw,
  Mic,
  MicOff,
  Star,
  ThumbsUp,
  MapPin,
  Briefcase,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

// WhatsApp icon SVG component
const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const QUICK_PROMPTS = [
  { icon: '🏢', label: 'Housekeeping & IFM', prompt: 'Housekeeping aur Facility Management service ke baare mein batao aur charges kya hain?' },
  { icon: '👥', label: 'Staffing & Manpower', prompt: 'Mujhe factory aur corporate office ke liye staff & workers chahiye.' },
  { icon: '⚖️', label: 'PF & ESI Compliance', prompt: 'Aap 100% PF aur ESI statutory compliance payroll kaise provide karte hain?' },
  { icon: '🚚', label: 'Logistics & Warehouse', prompt: 'Warehousing and logistics operations mein kya services milti hain?' },
  { icon: '📍', label: 'Coverage Areas', prompt: 'Aap kahan-kahan services provide karte hain (Delhi, Noida, UP, Haryana)?' },
  { icon: '💰', label: 'Rate Card / Quotation', prompt: 'Mujhe Manpower aur Facility Management ka estimated rate card aur quote chahiye.' }
];

const SmartAssistantWidget = ({ onNavigate }) => {
  const { addInquiry } = useCompany();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'whatsapp'
  const [hasUnread, setHasUnread] = useState(true);
  
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Namaste! 👋 Welcome to **MANABS Facilities & Workforce Management**.\n\nMain aapka **AI Assistant** hoon. Aap Housekeeping, Manpower Staffing, Payroll, PF/ESI Compliances, ya Pricing ke baare mein kuch bhi puch sakte hain — **type karein ya Mic 🎙️ se bolein!**',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Voice Recognition States
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState('hi-IN'); // 'hi-IN' | 'en-IN'
  const recognitionRef = useRef(null);

  // Customer Star Rating States
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  
  // Lead capture & WhatsApp Auto-Forwarding
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', requirement: '' });
  const [showLeadPrompt, setShowLeadPrompt] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const chatEndRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = voiceLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [voiceLang]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping, showLeadPrompt, ratingSubmitted]);

  // Voice toggle handler
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is supported in Google Chrome, Edge, and Android/iOS browsers.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = voiceLang;
          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (err) {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      }
    }
  };

  // HIGHLY INTELLIGENT CONVERSATIONAL KNOWLEDGE ENGINE
  const generateBotReply = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // 1. GREETINGS & CASUAL TALK
    if (/^(hi|hello|hey|namaste|hlo|pranam|ram ram|kya haal|kaise ho|good morning|good evening|good afternoon)/i.test(q)) {
      return {
        text: 'Hello! Kaise hain aap? 😊\n\nMANABS India ki premier **Integrated Facilities & Workforce Staffing** partner hai. Aaj hum aapki facility ya business requirements mein kaise madad kar sakte hain?',
        promptLead: false
      };
    }

    if (q.includes('thank') || q.includes('shukriya') || q.includes('dhanyawad') || q.includes('ok thanks') || q.includes('great')) {
      return {
        text: 'Aapka swagat hai! 🌟 Agar aapko koi bhi formal quotation ya proposal chahiye, to aap directly WhatsApp ya callback ke zariye humse contact kar sakte hain.',
        promptLead: false
      };
    }

    // 2. HOUSEKEEPING, SOFT SERVICES, CLEANING, SANITIZATION
    if (q.includes('housekeeping') || q.includes('cleaning') || q.includes('safai') || q.includes('cleaner') || q.includes('sanitization') || q.includes('deep clean') || q.includes('scrubber') || q.includes('sweeper')) {
      return {
        text: '🧹 **MANABS Mechanized Housekeeping & Soft Services:**\n\n• **Mechanized Machinery:** Ride-On Auto Scrubbers, High-Pressure Jet Washers, Single-Disc Polishers.\n• **Eco & Hospital Grade Chemicals:** Diversey / Taski certified non-toxic chemicals.\n• **Trained & Verified Staff:** 100% Police & Aadhar verified housekeeping boys, pantry staff, and on-site supervisors.\n• **Checklists & Audits:** Daily digital location audit checklists with zero time-lag replenishment.\n\n👉 *Kya aapko office, hospital, mall ya factory ke liye proposal chahiye? Apna number share karein instant quote ke liye.*',
        promptLead: true,
        showCalcLink: true
      };
    }

    // 3. STAFFING, MANPOWER, SOURCING, WORKERS
    if (q.includes('staff') || q.includes('worker') || q.includes('manpower') || q.includes('hiring') || q.includes('helper') || q.includes('bande') || q.includes('log chahiye') || q.includes('peon') || q.includes('pantry') || q.includes('electrician') || q.includes('plumber') || q.includes('technician')) {
      return {
        text: '👥 **Corporate Manpower & Staffing Solutions:**\n\n• **Deployments:** 25,000+ deployed workforce across North India.\n• **Categories:** Skilled Technicians, Unskilled Helpers, Warehouse Crew, Pantry Boys, Front Desk & Supervisors.\n• **Training:** 2-week rigorous induction in our dedicated in-house National Resource Cell.\n• **Zero Time-Lag:** 24 se 48 hours ke andar mobilization guarantee.\n\n👉 *Aapko kitne headcount (staff) ki requirement hai? Niche details enter karein taaki director aapse contact karein.*',
        promptLead: true
      };
    }

    // 4. PAYROLL, SALARY, PF, ESI, STATUTORY COMPLIANCE
    if (q.includes('payroll') || q.includes('salary') || q.includes('pf') || q.includes('esi') || q.includes('compliance') || q.includes('epf') || q.includes('gratuity') || q.includes('bonus') || q.includes('challan') || q.includes('labour law') || q.includes('audit')) {
      return {
        text: '⚖️ **100% Statutory Compliance & Payroll Guarantee:**\n\n• **Zero Client Liability:** Monthly PF & ESI verified government challans are submitted before the 15th of every month.\n• **Automated Payroll Suite:** Biometric attendance integration, TDS calculations, Form 16, Bonus, and Gratuity provisioning.\n• **Audit Ready:** 100% Labour Commissioner audit compliance dockets.\n\n👉 *Hum transparent payroll outsourcing provide karte hain. Detailed breakups ke liye humare Calculator ya Direct WhatsApp ka use karein.*',
        promptLead: true,
        showCalcLink: true
      };
    }

    // 5. PRICING, COST, CHARGES, RATE, QUOTE, ESTIMATE
    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('charge') || q.includes('kitna') || q.includes('quote') || q.includes('estimate') || q.includes('budget') || q.includes('per sq ft') || q.includes('per staff')) {
      return {
        text: '💰 **Transparent & Zero-Hidden Surcharge Pricing:**\n\n• Pricing aapke facility square footage, headcount, equipment requirements aur shift timings (8-hr / 16-hr / 24x7) par depend karti hai.\n• Hum clients ko direct **18% - 24% operational savings** deliver karte hain vs in-house management.\n• Aap website par **Interactive Cost Calculator** se real-time monthly budget calculate kar sakte hain!\n\n👉 *Free site inspection aur customized quote ke liye niche form bharein.*',
        promptLead: true,
        showCalcLink: true
      };
    }

    // 6. LOCATIONS & GEOGRAPHIC COVERAGE
    if (q.includes('delhi') || q.includes('noida') || q.includes('gurgaon') || q.includes('gurugram') || q.includes('faridabad') || q.includes('ghaziabad') || q.includes('up') || q.includes('uttar pradesh') || q.includes('haryana') || q.includes('uttarakhand') || q.includes('location') || q.includes('kahan') || q.includes('area') || q.includes('coverage') || q.includes('city') || q.includes('pan india')) {
      return {
        text: '📍 **MANABS Operational Coverage:**\n\n• **Delhi NCR:** Delhi, Noida, Greater Noida, Gurgaon, Faridabad, Ghaziabad.\n• **Uttar Pradesh:** Lucknow, Kanpur, Agra, Meerut, Varanasi.\n• **Haryana:** Manesar, Sonipat, Panipat, Rewari, Rohtak.\n• **Uttarakhand:** Dehradun, Haridwar, Pantnagar, Rudrapur.\n• **Pan-India:** Multi-location enterprise contracts.\n\n👉 *Aapki site kahan par hai? Hum 24-48 hours mein inspection aur deployment start kar sakte hain.*',
        promptLead: true
      };
    }

    // 7. LOGISTICS, WAREHOUSE, DRIVERS, SUPPLY CHAIN
    if (q.includes('warehouse') || q.includes('logistics') || q.includes('godown') || q.includes('forklift') || q.includes('driver') || q.includes('loading') || q.includes('unloading') || q.includes('dispatch') || q.includes('inventory') || q.includes('supply chain')) {
      return {
        text: '🚚 **Logistics & Warehousing Operations:**\n\n• **Trained Crew:** Certified Forklift Drivers, Pickers, Packers, Material Handlers, and Inventory Controllers.\n• **JIT (Just-In-Time) Replenishment:** Zero bottleneck loading/unloading squads.\n• **Safety & Insurance:** 100% PPE compliant and insured operations.\n\n👉 *Apna warehouse location aur required staff share karein.*',
        promptLead: true
      };
    }

    // 8. MEP, HVAC, ELECTRICAL, MAINTENANCE, ENGINEERING
    if (q.includes('mep') || q.includes('hvac') || q.includes('electrician') || q.includes('ac repair') || q.includes('dg set') || q.includes('generator') || q.includes('plumbing') || q.includes('engineering') || q.includes('maintenance')) {
      return {
        text: '⚡ **Engineering & MEP Governance (24/7/365 Uptime):**\n\n• **HVAC & Chiller Plants:** Preventive and breakdown maintenance.\n• **Electrical & DG Sets:** HT/LT panels, UPS, and backup power management.\n• **Plumbing & Water Management:** STP/WTP treatment plants and daily audits.\n• **Certified Technicians:** Govt-licensed ITI electrical and mechanical engineers.',
        promptLead: true
      };
    }

    // 9. COMPANY HERITAGE, EXPERIENCE, CLIENTS
    if (q.includes('company') || q.includes('experience') || q.includes('heritage') || q.includes('owner') || q.includes('director') || q.includes('kab start') || q.includes('clients') || q.includes('manabs') || q.includes('manebz')) {
      return {
        text: '🏢 **About MANABS / MANEBZ:**\n\n• **Established:** 27th February 2014 (10+ Years Corporate Pioneer Heritage).\n• **Clients:** 500+ Top Indian Corporate Clients & MNCs.\n• **Retention:** 99.4% Client Retention Rate.\n• **Quality Standards:** ISO 9001 & EMS Eco-friendly operational framework.\n\n👉 *Would you like to speak directly with our Senior Management on WhatsApp?*',
        action: 'whatsapp',
        promptLead: true
      };
    }

    // 10. JOB SEEKERS / RECRUITMENT / APPLY FOR JOB
    if (q.includes('job') || q.includes('naukri') || q.includes('vacancy') || q.includes('resume') || q.includes('cv') || q.includes('apply') || q.includes('interview') || q.includes('salary date') || q.includes('fresher')) {
      return {
        text: '💼 **Career & Job Opportunities at MANABS:**\n\n• Hum active hirings kar rahe hain for: Facility Managers, Supervisors, Housekeeping Staff, Forklift Drivers, HR Executives, and MEP Technicians.\n• **Benefits:** Guaranteed on-time salary, PF, ESI medical insurance, uniform, and bonus.\n• Aap website ke **Careers Portal** par direct apply kar sakte hain!\n\n👉 *Apna Name aur Mobile number share karein, humari HR recruitment team aapse contact karegi.*',
        promptLead: true
      };
    }

    // 11. CONTACT / PHONE / MEETING / DIRECT WHATSAPP
    if (q.includes('whatsapp') || q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('call') || q.includes('meeting') || q.includes('office') || q.includes('address')) {
      return {
        text: '📞 **Connect with MANABS Central Command:**\n\n• **Direct WhatsApp:** +91 91234 56789\n• **Central Helpline:** +91 11 2345 6789\n• **Email Desk:** contact@manabs.com\n\n👉 *Aap niche diye gaye button par click karke direct WhatsApp chat start kar sakte hain.*',
        action: 'whatsapp',
        promptLead: true
      };
    }

    // DEFAULT SMART FALLBACK
    return {
      text: `Aapne **"${userQuery}"** ke baare mein pucha hai.\n\nMANABS provide karti hai:\n1. Integrated Facility Management & Mechanized Housekeeping\n2. Corporate Staffing & 100% Compliant Payroll\n3. Logistics, Warehousing & MEP Maintenance\n\n👉 *Aapki specific requirement ke according formal quotation aur proposal ke liye apna Name & Phone number share karein ya WhatsApp par connect karein.*`,
      promptLead: true
    };
  };

  const handleSend = (textToSend = null) => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }

    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateBotReply(text);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.text,
        action: botResponse.action,
        showCalcLink: botResponse.showCalcLink,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      if (botResponse.promptLead && !leadSubmitted) {
        setShowLeadPrompt(true);
      }
    }, 700);
  };

  // Feature 5: WhatsApp Lead Auto-Forwarding
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadForm.phone || !leadForm.name) return;

    // 1. Register lead in Admin Context
    addInquiry({
      name: leadForm.name,
      phone: leadForm.phone,
      email: leadForm.email || 'chatbot-lead@manabs.com',
      service: leadForm.requirement || 'AI Chatbot Immediate Inquiry'
    });

    setLeadSubmitted(true);
    setShowLeadPrompt(false);

    // 2. Prepare formatted WhatsApp auto-forwarding text
    const formattedLeadText = `*🔔 NEW CORPORATE INQUIRY (MANABS)*\n\n👤 *Client Name:* ${leadForm.name}\n📱 *Phone / WhatsApp:* ${leadForm.phone}\n🏢 *Requirement:* ${leadForm.requirement || 'Integrated Facility & Corporate Staffing'}\n⚡ *Status:* Immediate Callback Requested (15 Min)\n\n_Sent via MANABS Smart AI Assistant_`;

    // 3. Add confirmation message with 1-click WhatsApp Forwarding Button
    setMessages(prev => [
      ...prev,
      {
        id: `bot-lead-${Date.now()}`,
        sender: 'bot',
        text: `✅ **Lead Registered Successfully!**\n\nThank you **${leadForm.name}**! Aapka inquiry ticket register ho chuka hai. Humare Senior Operations Manager **${leadForm.phone}** par agle 15 minutes mein call karenge.\n\n👉 **Direct WhatsApp Forwarding:** Niche click karke ye inquiry direct WhatsApp par send kar sakte hain.`,
        customWhatsAppText: formattedLeadText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const openWhatsApp = (customMessage = null) => {
    const defaultMsg = customMessage || (
      leadForm.name 
        ? `*NEW INQUIRY*\nName: ${leadForm.name}\nPhone: ${leadForm.phone}\nRequirement: ${leadForm.requirement || 'Corporate Services'}`
        : 'Hello MANABS Team, I would like to request an instant corporate facility and staffing proposal.'
    );
    const url = `https://wa.me/919123456789?text=${encodeURIComponent(defaultMsg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Feature 6: Rating Submit
  const handleRatingSelect = (score) => {
    setRating(score);
    setRatingSubmitted(true);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-rating-${Date.now()}`,
          sender: 'bot',
          text: `⭐ **Thank you for your ${score}★ Rating!**\n\nAapka feedback humare liye bahut valuable hai. Agar koi aur sawal ho to aap bejhijhak puch sakte hain!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 400);
  };

  return (
    <div className={`fixed font-sans transition-all duration-300 ${
      isOpen 
        ? 'z-50 inset-x-3 bottom-20 top-20 sm:top-auto sm:bottom-6 sm:right-6 sm:inset-auto sm:w-[410px] sm:h-[590px] flex items-end justify-end' 
        : 'z-30 bottom-20 right-4 sm:bottom-6 sm:right-6'
    }`}>
      
      {/* 1. FLOATING ACTION LAUNCHER BUTTON */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip badge */}
          {hasUnread && (
            <div className="hidden sm:flex absolute -top-10 right-0 bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-xl border border-slate-700 whitespace-nowrap animate-bounce items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>💬 MANABS AI & WhatsApp</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.18)] hover:shadow-[0_15px_45px_rgba(220,38,38,0.35)] border-2 border-red-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer relative group overflow-visible"
            aria-label="Open MANABS AI Assistant & WhatsApp"
          >
            {/* Original Company Logo */}
            <img 
              src={logoImg} 
              alt="MANABS Logo" 
              className="w-full h-full object-contain"
            />

            {/* Floating WhatsApp pill badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md">
              <WhatsAppIcon className="w-3 h-3 text-white" />
            </div>

            {/* Glowing online pulse */}
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          </button>
        </div>
      )}

      {/* 2. SMART CHATBOT & WHATSAPP MODAL WINDOW */}
      {isOpen && (
        <div className="w-full sm:w-[410px] h-full sm:h-[590px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-[#0a192f] to-red-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative bg-white px-2 py-1 rounded-xl shadow-inner border border-white/20 flex items-center justify-center">
                <img 
                  src={logoImg} 
                  alt="MANABS Logo" 
                  className="h-6 w-auto object-contain rounded"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-tight">MANABS Smart AI</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold">24/7 ONLINE</span>
                </div>
                <p className="text-[11px] text-slate-300">Voice Assistant & WhatsApp Hotline</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `msg-reset-${Date.now()}`,
                      sender: 'bot',
                      text: 'Hello! 👋 Welcome to **MANABS Facilities & Workforce Management**.\n\nAap Housekeeping, Manpower Staffing, Payroll, PF/ESI Compliances, ya Pricing ke baare mein kuch bhi puch sakte hain!',
                      time: 'Just now'
                    }
                  ]);
                  setShowLeadPrompt(false);
                  setRatingSubmitted(false);
                  setRating(0);
                }}
                title="Reset Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tab Selector */}
          <div className="flex bg-slate-100 p-1 border-b border-gray-200 shrink-0 text-xs font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'chat' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-red-600" />
              <span>AI Voice Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'whatsapp' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-current" />
              <span>Direct WhatsApp</span>
            </button>
          </div>

          {/* TAB 1: AI CHATBOT + VOICE + RATING VIEW */}
          {activeTab === 'chat' && (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
                
                {messages.map((m) => {
                  const isBot = m.sender === 'bot';
                  return (
                    <div 
                      key={m.id}
                      className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      {isBot && (
                        <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-gray-200 shadow-sm shrink-0 mt-0.5">
                          <img src={logoImg} alt="MANABS" className="w-full h-full object-contain rounded-md" />
                        </div>
                      )}

                      <div className={`max-w-[82%] rounded-2xl p-3 shadow-sm ${
                        isBot 
                          ? 'bg-white text-slate-800 border border-gray-200' 
                          : 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                      }`}>
                        <div className="whitespace-pre-line leading-relaxed font-medium">
                          {m.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className={isBot ? "font-bold text-slate-950" : "font-extrabold"}>{chunk}</strong> : chunk)}
                        </div>

                        {/* Interactive Buttons embedded in Bot Replies */}
                        {m.showCalcLink && (
                          <div className="mt-2.5 pt-2 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                if (onNavigate) onNavigate('calculator');
                              }}
                              className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span>Launch Interactive Cost Calculator</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Feature 5: WhatsApp Auto-Forward Button */}
                        {m.customWhatsAppText && (
                          <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-1.5">
                            <button
                              onClick={() => openWhatsApp(m.customWhatsAppText)}
                              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer animate-pulse"
                            >
                              <WhatsAppIcon className="w-4 h-4" />
                              <span>Forward Details to WhatsApp</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {m.action === 'whatsapp' && (
                          <div className="mt-2.5 pt-2 border-t border-gray-100">
                            <button
                              onClick={() => openWhatsApp()}
                              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                              <span>Open WhatsApp (+91 91234 56789)</span>
                            </button>
                          </div>
                        )}

                        <span className={`text-[9px] block mt-1.5 ${isBot ? 'text-gray-400 text-right' : 'text-red-200 text-right'}`}>
                          {m.time}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Bot Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2 items-center text-slate-400">
                    <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-gray-200 shadow-sm shrink-0">
                      <img src={logoImg} alt="MANABS" className="w-full h-full object-contain rounded-md" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                {/* Lead Generation Prompt Card */}
                {showLeadPrompt && !leadSubmitted && (
                  <div className="bg-white p-3.5 rounded-2xl border border-red-200 shadow-md animate-in fade-in space-y-2.5 mt-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-red-600" />
                      <h4 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
                        Get 15-Min Callback Proposal
                      </h4>
                    </div>
                    <form onSubmit={handleLeadSubmit} className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name / Company *"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Mobile Number (WhatsApp) *"
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Specific Requirement (e.g. 20 Staff / IFM)"
                        value={leadForm.requirement}
                        onChange={(e) => setLeadForm({ ...leadForm, requirement: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-red-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-red-600 to-sky-600 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Submit & Forward to WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}

                {/* Feature 6: Interactive 5-Star Customer Feedback Card */}
                {!ratingSubmitted && messages.length >= 3 && (
                  <div className="bg-gradient-to-r from-slate-900 to-[#0a192f] text-white p-3 rounded-2xl shadow-md border border-slate-700 flex items-center justify-between gap-2 mt-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                        Rate Your Experience
                      </span>
                      <span className="text-[11px] text-slate-300">How helpful is this assistant?</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleRatingSelect(star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star 
                            className={`w-4 h-4 ${
                              (hoverRating || rating) >= star 
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-slate-500'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="bg-slate-50/90 border-t border-slate-200/80 px-3 py-2 shrink-0">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-red-500" />
                    Quick Suggestions
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Scroll 👉</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {QUICK_PROMPTS.map((qp, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(qp.prompt)}
                      className="group inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 border border-slate-200 hover:border-red-400 text-xs font-medium text-slate-700 hover:text-red-700 shadow-xs hover:shadow transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
                    >
                      <span className="text-xs group-hover:scale-110 transition-transform">{qp.icon}</span>
                      <span>{qp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Listening Active Wave Banner */}
              {isListening && (
                <div className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold flex items-center justify-between animate-pulse shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>🎙️ Listening ({voiceLang === 'hi-IN' ? 'Hindi' : 'English'})... Speak now!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVoiceLang(voiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN')}
                    className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full font-mono cursor-pointer"
                  >
                    Switch to {voiceLang === 'hi-IN' ? 'EN' : 'HI'}
                  </button>
                </div>
              )}

              {/* Clean Voice & Text Input Bar (No Overlapping Elements) */}
              <div className="p-2.5 bg-white border-t border-gray-200 shrink-0">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isListening ? "Listening... speak now" : "Type question or click mic..."}
                      className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-200 transition-all"
                    />
                    
                    {/* Clean Inline Voice Mic Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      title="Speak in Hindi / English"
                      className={`absolute right-1.5 p-1.5 rounded-lg transition-all cursor-pointer ${
                        isListening 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : 'text-slate-400 hover:text-red-600 hover:bg-slate-100'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* TAB 2: DIRECT WHATSAPP INSTANT DESK */}
          {activeTab === 'whatsapp' && (
            <div className="flex-1 p-5 bg-slate-50 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <WhatsAppIcon className="w-9 h-9" />
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-slate-900">Direct WhatsApp Operations Desk</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Chat directly with our senior facility directors and payroll coordinators for immediate quotes.
                  </p>
                </div>

                {/* WhatsApp Ready Quick Templates */}
                <div className="space-y-2 text-left pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                    Select Quick Inquiry Template:
                  </span>

                  {[
                    { label: '🏢 Request IFM & Housekeeping Quote', text: 'Hello MANABS, I want to request a facility management & mechanized housekeeping proposal.' },
                    { label: '👥 Corporate Staffing & Payroll Sourcing', text: 'Hello MANABS, I need corporate manpower staffing and 100% compliant payroll outsourcing.' },
                    { label: '🚚 Logistics & Warehouse Operations', text: 'Hello MANABS, I require warehousing support and logistics operations crew.' },
                    { label: '📞 Request Senior Management Callback', text: 'Hello, please arrange an immediate call with your senior operations director.' }
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      onClick={() => openWhatsApp(tpl.text)}
                      className="w-full p-3 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs font-bold text-slate-800 flex items-center justify-between group cursor-pointer text-left shadow-sm"
                    >
                      <span>{tpl.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => openWhatsApp()}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Start WhatsApp Chat (+91 91234 56789)</span>
                </button>

                <div className="text-center">
                  <a
                    href="tel:+911123456789"
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>Or Call Central Helpline: +91 11 2345 6789</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default SmartAssistantWidget;
