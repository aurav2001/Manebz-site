import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      payroll: 'Payroll & Compliance',
      careers: 'Careers',
      contact: 'Contact Us',
      calculator: 'Cost Calculator',
      blog: 'Insights & Blog',
      admin: 'Admin Portal',
      getQuote: 'Get Instant Quote',
      portalLogin: 'Client Portal',
      hotBadge: 'HOT'
    },
    hero: {
      badge: 'INDIA’S PREMIER ENTERPRISE FACILITY & WORKFORCE PARTNER',
      titleLine1: 'TRANSFORMING FACILITY',
      titleLine2: 'MANAGEMENT & WORKFORCE',
      titleLine3: 'OPERATIONS AT SCALE',
      subtitle: 'Delivering end-to-end Integrated Facility Management, Mechanized Soft Services, 100% Statutory Compliant Payroll, and High-Caliber Staffing for India’s fastest-growing enterprises.',
      ctaQuote: 'Instant Cost Estimator',
      ctaServices: 'Explore Services',
      statsClients: '500+ Corporate Clients',
      statsDeployed: '25,000+ Deployed Staff',
      statsCompliance: '100% Statutory Compliance',
      statsRetention: '99.4% Client Retention'
    },
    calculator: {
      badge: 'SMART ROI & MANPOWER ESTIMATOR',
      title: 'Interactive Facility & Staffing Cost Calculator',
      subtitle: 'Estimate manpower requirements, statutory compliance breakdowns, and monthly operational budgets in real-time.',
      selectService: '1. Select Service Type',
      facilityType: 'Facility / Space Type',
      areaSize: '2. Facility Area / Footprint (sq. ft.)',
      headcount: '2. Required Manpower Headcount (Staff)',
      shifts: '3. Operating Shifts',
      singleShift: 'General Shift (8 hrs)',
      doubleShift: '2 Shifts (16 hrs)',
      roundClock: '24/7 Operations (3 Shifts)',
      addons: '4. Advanced Add-ons & Equipment',
      addonScrubber: 'Ride-On Mechanized Auto-Scrubbers',
      addonBiometric: 'Cloud AI Biometric Attendance Unit',
      addonSupervisor: 'Dedicated 24/7 Site Quality Supervisor',
      addonCompliance: '100% Zero-Liability Statutory Audit Docket',
      resultsTitle: 'Estimated Cost & Manpower Breakdown',
      monthlyEstimate: 'Estimated Monthly Budget',
      recommendedStaff: 'Suggested Manpower Headcount',
      supervisors: 'Supervisors / Team Leads',
      skilledStaff: 'Skilled Technicians / Operators',
      supportStaff: 'General Staff / Housekeeping',
      statutoryBreakup: 'Statutory Breakdown Included (PF, ESI, Bonus, Gratuity, Uniforms)',
      savingsBadge: 'Estimated 18% - 24% Cost Savings vs In-House Hiring',
      ctaProposal: 'Download Instant PDF Proposal',
      ctaSubmitQuote: 'Request Formal Written Quote',
      quoteFormTitle: 'Lock in this Quote with MANABS Specialists',
      nameLabel: 'Your Full Name',
      phoneLabel: 'Mobile Phone Number',
      emailLabel: 'Work / Official Email',
      companyLabel: 'Company / Organization Name',
      submitBtn: 'Submit Proposal Request',
      proposalSuccess: 'Proposal Request Received! Our regional manager will call you within 15 minutes.'
    },
    blog: {
      badge: 'KNOWLEDGE HUB & LABOUR LAW INSIGHTS',
      title: 'Industry Insights, Compliance & Facility Trends',
      subtitle: 'Stay ahead with expert guides on Indian labour law updates, ESG facility management, mechanized housekeeping, and staffing benchmarks.',
      searchPlaceholder: 'Search articles, compliance updates, keywords...',
      allCategories: 'All Topics',
      compliance: 'Statutory Compliance',
      facility: 'Facility Management',
      payroll: 'Staffing & Payroll',
      technology: 'Tech & Automation',
      readTime: 'min read',
      readArticle: 'Read Full Guide',
      backToBlogs: 'Back to Insights',
      publishedOn: 'Published On',
      author: 'Authored by',
      share: 'Share Guide'
    },
    common: {
      instantQuote: 'Instant Quote',
      calculating: 'Calculating...',
      downloading: 'Preparing Document...',
      notifications: 'Notifications',
      noNotifications: 'No new notifications',
      markAllRead: 'Mark all as read',
      clearAll: 'Clear All',
      language: 'Language',
      english: 'English',
      hindi: 'हिन्दी',
      close: 'Close',
      submit: 'Submit',
      success: 'Success!',
      loading: 'Loading...'
    }
  },
  hi: {
    nav: {
      home: 'होम',
      about: 'हमारे बारे में',
      services: 'सेवाएं',
      payroll: 'पेरोल और अनुपालन',
      careers: 'करियर',
      contact: 'संपर्क करें',
      calculator: 'लागत कैलकुलेटर',
      blog: 'ब्लॉग व गाइड',
      admin: 'एडमिन पोर्टल',
      getQuote: 'तुरंत कोटेशन पाएं',
      portalLogin: 'क्लाइंट पोर्टल',
      hotBadge: 'नया'
    },
    hero: {
      badge: 'भारत का अग्रणी एंटरप्राइज फैसिलिटी एवं मैनपॉवर पार्टनर',
      titleLine1: 'फैसिलिटी मैनेजमेंट',
      titleLine2: 'और वर्कफोर्स ऑपरेशंस',
      titleLine3: 'का आधुनिक समाधान',
      subtitle: 'इंटीग्रेटेड फैसिलिटी मैनेजमेंट, मशीनीकृत हाउसकीपिंग, 100% कानूनी अनुपालन पेरोल और कुशल वर्कफोर्स का संपूर्ण विश्वसनीय समाधान।',
      ctaQuote: 'तुरंत लागत कैलकुलेटर',
      ctaServices: 'सभी सेवाएं देखें',
      statsClients: '500+ कॉर्पोरेट क्लाइंट्स',
      statsDeployed: '25,000+ तैनात कर्मचारी',
      statsCompliance: '100% पीएफ व ईएसआई अनुपालन',
      statsRetention: '99.4% क्लाइंट संतुष्टि'
    },
    calculator: {
      badge: 'स्मार्ट लागत और मैनपॉवर एस्टीमेटर',
      title: 'इंटरएक्टिव फैसिलिटी व स्टाफिंग कॉस्ट कैलकुलेटर',
      subtitle: 'अपनी आवश्यकता के अनुसार मैनपॉवर संख्या, पीएफ/ईएसआई ब्रेकअप और मासिक बजट का तुरंत सटीक अनुमान लगाएं।',
      selectService: '1. सर्विस प्रकार चुनें',
      facilityType: 'परिसर / फैसिलिटी का प्रकार',
      areaSize: '2. कुल एरिया / क्षेत्रफल (वर्ग फुट)',
      headcount: '2. आवश्यक कर्मचारियों की संख्या (स्टाफ)',
      shifts: '3. कार्य शिफ्ट्स',
      singleShift: 'जनरल शिफ्ट (8 घंटे)',
      doubleShift: '2 शिफ्ट्स (16 घंटे)',
      roundClock: '24/7 ऑपरेशंस (3 शिफ्ट्स)',
      addons: '4. विशेष मशीनरी व अतिरिक्त सेवाएं',
      addonScrubber: 'राइड-ऑन ऑटोमैटिक स्क्रबिंग मशीन',
      addonBiometric: 'क्लाउड एआई बायोमेट्रिक अटेंडेंस',
      addonSupervisor: '24/7 साइट क्वालिटी सुपरवाइजर',
      addonCompliance: '100% कानूनी व पीएफ/ईएसआई ऑडिट शील्ड',
      resultsTitle: 'अनुमानित लागत और स्टाफिंग विवरण',
      monthlyEstimate: 'अनुमानित मासिक बजट',
      recommendedStaff: 'सुझाई गई कुल मैनपॉवर',
      supervisors: 'सुपरवाइजर / टीम लीड',
      skilledStaff: 'कुशल तकनीशियन / ऑपरेटर',
      supportStaff: 'हाउसकीपिंग व सहायक कर्मचारी',
      statutoryBreakup: 'शामिल है: पीएफ, ईएसआई, बोनस, ग्रेच्युटी, यूनिफॉर्म व इंश्योरेंस',
      savingsBadge: 'इन-हाउस हायरिंग की तुलना में 18% - 24% की बचत',
      ctaProposal: 'इंस्टेंट पीडीएफ प्रस्ताव डाउनलोड करें',
      ctaSubmitQuote: 'आधिकारिक कोटेशन का अनुरोध करें',
      quoteFormTitle: 'MANABS विशेषज्ञों से यह कोटेशन लॉक करें',
      nameLabel: 'आपका पूरा नाम',
      phoneLabel: 'मोबाइल फोन नंबर',
      emailLabel: 'ऑफिसियल ईमेल आईडी',
      companyLabel: 'कंपनी / संस्थान का नाम',
      submitBtn: 'प्रस्ताव अनुरोध भेजें',
      proposalSuccess: 'अनुरोध प्राप्त हुआ! हमारे एरिया मैनेजर 15 मिनट में आपसे संपर्क करेंगे।'
    },
    blog: {
      badge: 'नॉलेज हब व लेबर लॉ इनसाइट्स',
      title: 'उद्योग अंतर्दृष्टि, अनुपालन और फैसिलिटी ट्रेंड्स',
      subtitle: 'भारतीय श्रम कानून, आधुनिक मशीनीकृत हाउसकीपिंग, ईएसजी और स्टाफिंग पर हमारे विशेषज्ञों के लेख पढ़ें।',
      searchPlaceholder: 'लेख, अनुपालन अपडेट, कीवर्ड खोजें...',
      allCategories: 'सभी विषय',
      compliance: 'कानूनी अनुपालन',
      facility: 'फैसिलिटी मैनेजमेंट',
      payroll: 'स्टाफिंग व पेरोल',
      technology: 'तकनीक व ऑटोमेशन',
      readTime: 'मिनट पढ़ने का समय',
      readArticle: 'पूरा लेख पढ़ें',
      backToBlogs: 'वापस ब्लॉग पर जाएं',
      publishedOn: 'प्रकाशित तिथि',
      author: 'लेखक',
      share: 'शेयर करें'
    },
    common: {
      instantQuote: 'तुरंत कोटेशन',
      calculating: 'गणना हो रही है...',
      downloading: 'दस्तावेज़ तैयार हो रहा है...',
      notifications: 'सूचनाएं',
      noNotifications: 'कोई नई सूचना नहीं है',
      markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें',
      clearAll: 'सभी हटाएं',
      language: 'भाषा',
      english: 'English',
      hindi: 'हिन्दी',
      close: 'बंद करें',
      submit: 'सबमिट करें',
      success: 'सफलतापूर्वक संपन्न!',
      loading: 'लोड हो रहा है...'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('manabs_preferred_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('manabs_preferred_lang', language);
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
