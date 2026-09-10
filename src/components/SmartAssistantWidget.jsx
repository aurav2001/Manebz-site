import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

// WhatsApp icon SVG component
const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const QUICK_PROMPTS = [
  { label: '🏢 Facility Management Quote', prompt: 'I want a quotation for Integrated Facility Management for my corporate office.' },
  { label: '👥 Staffing & Payroll Inquiries', prompt: 'Tell me about your 100% statutory compliant workforce staffing & payroll management.' },
  { label: '🚚 Logistics & Warehousing', prompt: 'What warehousing and logistics operations support do you provide?' },
  { label: '⚖️ PF/ESI Statutory Compliance', prompt: 'How does MANABS ensure zero-liability statutory compliance for PF and ESI?' },
  { label: '💬 Talk on WhatsApp', prompt: 'I want to directly connect with your operations team on WhatsApp.' }
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
      text: 'Hello! 👋 Welcome to **MANABS Facilities & Workforce Management**.\n\nI am your **AI Smart Assistant**. How can we support your facility or corporate staffing today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Lead capture state inside chat
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', requirement: '' });
  const [showLeadPrompt, setShowLeadPrompt] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  const generateBotReply = (userQuery) => {
    const q = userQuery.toLowerCase();

    if (q.includes('whatsapp') || q.includes('chat') || q.includes('number')) {
      return {
        text: 'You can directly connect with our central operations desk on WhatsApp at **+91 98765 43210** for instant quotes and site surveys.',
        action: 'whatsapp'
      };
    }

    if (q.includes('facility') || q.includes('housekeeping') || q.includes('cleaning') || q.includes('mep') || q.includes('maintenance')) {
      return {
        text: 'MANABS provides enterprise **Integrated Facility Management (IFM)** including:\n• Mechanized Soft Services & Ride-On Auto Scrubbers\n• 24/7 MEP, HVAC & Electrical Uptime Governance\n• ISO 9001 & EMS Eco-friendly audit checklists\n\nWould you like a customized facility audit quotation?',
        promptLead: true
      };
    }

    if (q.includes('staffing') || q.includes('payroll') || q.includes('salary') || q.includes('recruitment') || q.includes('manpower')) {
      return {
        text: 'Our **Workforce & Payroll Division** manages:\n• 25,000+ deployed personnel across North India\n• 100% PF, ESI, Gratuity & Bonus automated challans\n• 2-week National Resource Cell induction training\n\nPlease share your required headcount or contact details for a proposal.',
        promptLead: true
      };
    }

    if (q.includes('compliance') || q.includes('pf') || q.includes('esi') || q.includes('audit') || q.includes('legal')) {
      return {
        text: 'We provide a **100% Zero-Liability Statutory Guarantee**:\n• Monthly verified PF & ESI challans submitted before 15th\n• Biometric AI attendance dockets\n• Labour inspector audit clearances across Delhi NCR, UP, Haryana & UK.',
        promptLead: true
      };
    }

    if (q.includes('logistics') || q.includes('warehouse') || q.includes('driver') || q.includes('supply chain')) {
      return {
        text: 'Our **Logistics & Warehousing Squad** offers JIT (Just-In-Time) inventory operators, forklift certified drivers, and 24/7 loading crews with zero time-lag mobilization.',
        promptLead: true
      };
    }

    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('quote') || q.includes('budget') || q.includes('calculator')) {
      return {
        text: 'Our pricing is fully transparent with zero hidden surcharges! You can also use our **Interactive Cost Calculator** to estimate monthly staffing and facility budgets in real time.',
        showCalcLink: true,
        promptLead: true
      };
    }

    return {
      text: 'Thank you for reaching out! We manage Integrated Facilities, Payroll, and Corporate Workforce across Delhi NCR & Pan-India. Please leave your contact details or chat on WhatsApp to get an immediate proposal.',
      promptLead: true
    };
  };

  const handleSend = (textToSend = null) => {
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
    }, 800);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadForm.phone || !leadForm.name) return;

    // Save lead to CompanyContext
    addInquiry({
      name: leadForm.name,
      phone: leadForm.phone,
      email: leadForm.email || 'chatbot-lead@manabs.com',
      service: leadForm.requirement || 'AI Chatbot Immediate Inquiry'
    });

    setLeadSubmitted(true);
    setShowLeadPrompt(false);

    // Send confirmation message in chat
    setMessages(prev => [
      ...prev,
      {
        id: `bot-lead-${Date.now()}`,
        sender: 'bot',
        text: `✅ Thank you **${leadForm.name}**! Your inquiry has been registered with our operations desk. Our senior facility manager will call you at **${leadForm.phone}** within 15 minutes.\n\nYou can also click below to initiate an instant WhatsApp chat.`,
        action: 'whatsapp',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const openWhatsApp = (customMessage = null) => {
    const defaultMsg = customMessage || (
      leadForm.name 
        ? `Hello MANABS, I am ${leadForm.name} (${leadForm.phone}). I need a facility / staffing proposal for: ${leadForm.requirement || 'Corporate Services'}`
        : 'Hello MANABS Team, I would like to request an instant corporate facility and staffing proposal.'
    );
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(defaultMsg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-5 sm:right-6 z-50 font-sans">
      
      {/* 1. FLOATING ACTION LAUNCHER BUTTON */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip badge */}
          {hasUnread && (
            <div className="absolute -top-10 right-0 bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-full shadow-xl border border-slate-700 whitespace-nowrap animate-bounce flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>💬 AI Assistant & WhatsApp</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-red-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_14px_40px_rgba(220,38,38,0.4)] flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer relative"
            aria-label="Open AI Assistant & WhatsApp"
          >
            <div className="relative">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <WhatsAppIcon className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

            {/* Glowing online pulse */}
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
            </span>
          </button>
        </div>
      )}

      {/* 2. SMART CHATBOT & WHATSAPP MODAL WINDOW */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-[#0a192f] to-red-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0a192f]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-tight">MANABS Smart AI</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold">24/7 LIVE</span>
                </div>
                <p className="text-[11px] text-slate-300">Enterprise Facilities & WhatsApp Desk</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `msg-reset-${Date.now()}`,
                      sender: 'bot',
                      text: 'Hello! 👋 Welcome to **MANABS Facilities & Workforce Management**.\n\nHow can we assist with your facility or staffing requirements today?',
                      time: 'Just now'
                    }
                  ]);
                  setShowLeadPrompt(false);
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
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>AI Chatbot</span>
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

          {/* TAB 1: AI CHATBOT INTERACTIVE VIEW */}
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
                        <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <Bot className="w-4 h-4 text-emerald-400" />
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

                        {m.action === 'whatsapp' && (
                          <div className="mt-2.5 pt-2 border-t border-gray-100">
                            <button
                              onClick={() => openWhatsApp()}
                              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                              <span>Open WhatsApp Chat (+91 98765 43210)</span>
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
                    <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-emerald-400" />
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
                      <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-red-600 to-sky-600 text-white font-bold text-xs rounded-xl shadow hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Submit for Instant Callback</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="p-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {QUICK_PROMPTS.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qp.prompt)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer shrink-0"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <div className="p-3 bg-white border-t border-gray-200 shrink-0">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about staffing, facility, payroll..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-200 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0"
                  >
                    <Send className="w-4 h-4" />
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
                  <span>Start WhatsApp Chat (+91 98765 43210)</span>
                </button>

                <div className="text-center">
                  <a
                    href="tel:+911149823000"
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>Or Call Central Helpline: +91 11 4982 3000</span>
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
