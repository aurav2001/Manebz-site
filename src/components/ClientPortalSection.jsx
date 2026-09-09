import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { sampleTickets } from '../data/companyData';
import confetti from 'canvas-confetti';

const ClientPortalSection = () => {
  const [ticketSearchInput, setTicketSearchInput] = useState('MNZ-8921');
  const [searchedTicket, setSearchedTicket] = useState(sampleTickets[0]);
  const [ticketError, setTicketError] = useState('');

  const [clientQueryForm, setClientQueryForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    queryType: 'Infrastructure Scale',
    priority: 'High',
    message: '',
    fileName: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  const handleTicketSearch = (e) => {
    e?.preventDefault();
    setTicketError('');
    const cleanId = ticketSearchInput.trim().toUpperCase();
    const found = sampleTickets.find(t => t.ticketId.toUpperCase() === cleanId);
    
    if (found) {
      setSearchedTicket(found);
    } else {
      // If user enters a custom ID, create an active simulated ticket state
      if (cleanId.startsWith('MNZ-')) {
        setSearchedTicket({
          ticketId: cleanId,
          clientName: 'Enterprise Client',
          subject: 'Custom Telemetry & Cloud Scaling Query',
          type: 'Cloud Infrastructure',
          status: 'In Progress',
          priority: 'High',
          progress: 60,
          eta: 'Within 2 Hours',
          assignedEngineer: 'Central Systems Response Unit',
          steps: [
            { title: 'Ticket Authenticated & Assigned', status: 'completed', time: 'Just Now' },
            { title: 'Diagnostics & Telemetry Scan', status: 'active', time: 'In Progress' },
            { title: 'Resolution Benchmark & SLA Sign-off', status: 'pending', time: 'Pending' }
          ]
        });
      } else {
        setTicketError('Ticket ID not found. Try sample IDs like MNZ-8921, MNZ-7405, or MNZ-9302');
      }
    }
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!clientQueryForm.name || !clientQueryForm.email || !clientQueryForm.message) return;

    const newId = `MNZ-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTicketId(newId);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F2FE', '#10B981', '#4FACFE']
      });
    } catch (err) {
      console.log(err);
    }

    setFormSubmitted(true);
  };

  return (
    <section id="client-portal" className="py-24 relative overflow-hidden bg-[#070B14]/80">
      
      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[170px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>24/7 Enterprise Command & Client Operations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white">
            Client Support & <br />
            <span className="text-gradient">Real-Time Ticket Tracker</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Track active infrastructure rollouts, check live incident resolution timelines, or submit high-priority engineering queries directly to our SOC and Cloud architects.
          </p>
        </div>

        {/* Top Ticket Status Tracker Bar */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <Search className="w-3.5 h-3.5" />
                <span>Live Ticket Status Lookup</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                Check Project / SLA Resolution Progress
              </h3>
            </div>

            {/* Quick Sample Ticket Buttons */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">Sample Ticket IDs:</span>
              {sampleTickets.map((t) => (
                <button
                  key={t.ticketId}
                  onClick={() => {
                    setTicketSearchInput(t.ticketId);
                    setSearchedTicket(t);
                    setTicketError('');
                  }}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-all ${
                    searchedTicket?.ticketId === t.ticketId
                      ? 'bg-cyan-400 text-black shadow-md shadow-cyan-400/30'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {t.ticketId}
                </button>
              ))}
            </div>
          </div>

          {/* Search form */}
          <form onSubmit={handleTicketSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter your Ticket ID (e.g. MNZ-8921)..."
                value={ticketSearchInput}
                onChange={(e) => setTicketSearchInput(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-black/50 border border-white/15 focus:border-cyan-400 text-sm text-white placeholder-slate-400 font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Lookup Ticket</span>
            </button>
          </form>

          {ticketError && (
            <p className="text-xs text-red-400 mb-4 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>{ticketError}</span>
            </p>
          )}

          {/* Searched Ticket Live View Card */}
          {searchedTicket && (
            <div className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-mono font-bold text-cyan-400">
                      #{searchedTicket.ticketId}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      searchedTicket.status === 'Completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {searchedTicket.status}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-300 text-[10px] font-bold border border-red-500/30">
                      {searchedTicket.priority} Priority
                    </span>
                  </div>

                  <h4 className="text-xl font-display font-bold text-white mt-1">
                    {searchedTicket.subject}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Client: <span className="text-slate-200 font-medium">{searchedTicket.clientName}</span> • Category: <span className="text-cyan-300">{searchedTicket.type}</span>
                  </p>
                </div>

                <div className="text-left md:text-right space-y-1">
                  <div className="text-xs text-slate-400">Estimated Resolution</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {searchedTicket.eta}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Lead: {searchedTicket.assignedEngineer}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Resolution Progress</span>
                  <span className="font-mono font-bold text-cyan-400">{searchedTicket.progress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 transition-all duration-700 shadow-sm shadow-cyan-400"
                    style={{ width: `${searchedTicket.progress}%` }}
                  />
                </div>
              </div>

              {/* Step by Step Timeline Audit */}
              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Incident Execution Audit Trail
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {searchedTicket.steps.map((step, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl border ${
                        step.status === 'completed'
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-slate-200'
                          : step.status === 'active'
                            ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-md shadow-cyan-500/20 animate-pulse'
                            : 'bg-white/[0.02] border-white/5 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400">{step.time}</span>
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : step.status === 'active' ? (
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-600" />
                        )}
                      </div>
                      <div className="text-xs font-semibold leading-snug">
                        {step.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Client Query Submission Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left instructions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SLA-Guaranteed Response</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Raise an Enterprise Technical Query or Change Request
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our 24/7 National Command Center operates under strict Tier-IV SLA governance. Critical and High priority queries trigger immediate automated alerting to regional practice leads.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
                <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">Critical Priority: &lt; 15 Mins SLA</h5>
                  <p className="text-[11px] text-slate-400">Immediate telephone escalation and live bridge setup.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">End-to-End Encrypted Communication</h5>
                  <p className="text-[11px] text-slate-400">All diagnostic logs and telemetry data are shielded with AES-256 GCM.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl relative">
            
            {!formSubmitted ? (
              <form onSubmit={handleQuerySubmit} className="space-y-4">
                <h4 className="text-lg font-display font-bold text-white mb-2">
                  Client Query Dispatch Form
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanyam Gupta"
                      value={clientQueryForm.name}
                      onChange={(e) => setClientQueryForm({ ...clientQueryForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Company / Organization <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zenith Global Technologies"
                      value={clientQueryForm.company}
                      onChange={(e) => setClientQueryForm({ ...clientQueryForm, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Business Email <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sanyam@zenith.com"
                      value={clientQueryForm.email}
                      onChange={(e) => setClientQueryForm({ ...clientQueryForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={clientQueryForm.phone}
                      onChange={(e) => setClientQueryForm({ ...clientQueryForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Query Type (Dropdown)
                    </label>
                    <select
                      value={clientQueryForm.queryType}
                      onChange={(e) => setClientQueryForm({ ...clientQueryForm, queryType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-white/10 focus:border-cyan-400 text-xs text-white focus:outline-none"
                    >
                      <option value="Infrastructure Scale">Infrastructure Scaling & Kubernetes</option>
                      <option value="AI Model Deployment">AI / LLM Neural Pipeline Fine-Tuning</option>
                      <option value="Security / SOC Incident">Security Operations & Threat Defense</option>
                      <option value="Pan-India Edge Node">Pan-India Edge Routing & Latency</option>
                      <option value="SLA Audit & Billing">SLA Audit, Billing & Enterprise MSA</option>
                      <option value="General Support">General Client Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Incident Urgency / Priority
                    </label>
                    <select
                      value={clientQueryForm.priority}
                      onChange={(e) => setClientQueryForm({ ...clientQueryForm, priority: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0F172A] border border-white/10 focus:border-cyan-400 text-xs text-white focus:outline-none"
                    >
                      <option value="Critical">Critical (Immediate SLA Escalation)</option>
                      <option value="High">High (&lt; 1 Hour Resolution Window)</option>
                      <option value="Medium">Medium (Standard 4 Hour Window)</option>
                      <option value="Low">Low (General Inquiry)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Detailed Message / Log Summary <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your requirement, project parameters, or incident details..."
                    value={clientQueryForm.message}
                    onChange={(e) => setClientQueryForm({ ...clientQueryForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Client Ticket to Command Unit</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success confirmation state */
              <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
                    Ticket Created: #{generatedTicketId}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white mt-1">
                    Query Dispatched Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                    Thank you, <span className="text-white font-semibold">{clientQueryForm.name}</span>. Your ticket has been routed to the <span className="text-cyan-300">{clientQueryForm.queryType}</span> command queue with <span className="text-red-300">{clientQueryForm.priority}</span> priority.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-sm mx-auto text-left text-xs space-y-1 text-slate-300">
                  <div><span className="text-slate-400">Company:</span> <span className="text-white font-medium">{clientQueryForm.company}</span></div>
                  <div><span className="text-slate-400">Assigned SLA:</span> <span className="text-emerald-400 font-bold">&lt; 15 Mins Response</span></div>
                  <div><span className="text-slate-400">Updates Dispatched To:</span> <span className="text-cyan-300">{clientQueryForm.email}</span></div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setTicketSearchInput(generatedTicketId);
                      setSearchedTicket({
                        ticketId: generatedTicketId,
                        clientName: clientQueryForm.company,
                        subject: `${clientQueryForm.queryType} Request`,
                        type: clientQueryForm.queryType,
                        status: 'In Progress',
                        priority: clientQueryForm.priority,
                        progress: 25,
                        eta: 'Within 30 Mins',
                        assignedEngineer: 'Central Duty Officer',
                        steps: [
                          { title: 'Ticket Received & Authenticated', status: 'completed', time: 'Just Now' },
                          { title: 'Engineer Dispatch & Triaging', status: 'active', time: 'In Progress' },
                          { title: 'Diagnostic Execution', status: 'pending', time: 'Pending' },
                          { title: 'Final Resolution Benchmark', status: 'pending', time: 'Pending' },
                        ]
                      });
                      window.scrollTo({ top: document.getElementById('client-portal').offsetTop, behavior: 'smooth' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30"
                  >
                    Track #{generatedTicketId} Above
                  </button>

                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setClientQueryForm({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        queryType: 'Infrastructure Scale',
                        priority: 'High',
                        message: '',
                        fileName: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:text-white"
                  >
                    Submit Another Query
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default ClientPortalSection;
