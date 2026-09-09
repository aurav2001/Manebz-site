import React, { useEffect } from 'react';

const seoConfig = {
  home: {
    title: 'MANABS / MANEBZ — Strategic Facilities Management & Workforce Solutions',
    description: 'Pioneers in Strategic Facilities Management, HR Staffing & Payroll, Logistics & Warehouse Management, Real Estate Advisory, and 100% Statutory Compliances since 2014 across Delhi NCR, UP, Haryana, Uttarakhand.',
    keywords: 'facilities management Delhi NCR, corporate HR staffing India, payroll outsourcing, warehouse management, real estate advisory, PF ESI compliance, bio-friendly facility maintenance, MANABS, MANEBZ',
    canonical: 'https://manabs.com/#/home',
  },
  about: {
    title: 'About Us | Know MANABS Better — Founded 27th Feb 2014',
    description: 'Founded on 27th February 2014 by facilities & engineering pioneers in Delhi NCR. Learn about our in-house National Resource Cell, 2-week training model, and ISO/EMS Quality Assurance.',
    keywords: 'About MANABS, MANEBZ history, facilities pioneers India, Resource Cell training, statutory compliance HR, ISO 9001 EMS facilities',
    canonical: 'https://manabs.com/#/about',
  },
  services: {
    title: 'Services Spectrum | Integrated Facilities, HR Staffing & Logistics — MANABS',
    description: 'Explore MANABS 5 core verticals: HR Staffing & Payroll, Logistics & Warehouse, Integrated Facilities Management (IFM), Real Estate Advisory, and Compliance Management & Audits.',
    keywords: 'integrated facilities management, corporate staffing services, warehouse maintenance, commercial leasing advisory, statutory audits, 24/7 building upkeep',
    canonical: 'https://manabs.com/#/services',
  },
  payroll: {
    title: 'Automated Payroll & Statutory Compliance Suite | Salary Calculator — MANABS',
    description: 'End-to-end payroll outsourcing, EPFO monthly ECR, ESIC return filings, biometric attendance sync, automated salary computation, and instant digital payslips.',
    keywords: 'payroll outsourcing India, statutory compliance PF ESI, salary calculator CTC, digital payslip generation, biometric attendance sync, EPFO ECR challan',
    canonical: 'https://manabs.com/#/payroll',
  },
  careers: {
    title: 'Careers & Job Openings | Recruit Quality Resources, Nurture & Retain — MANABS',
    description: 'Explore exciting career opportunities in Facilities Management, HR & Payroll, MEP Engineering, and Logistics across Delhi NCR, UP, Haryana, and Uttarakhand.',
    keywords: 'facility manager jobs, HR payroll jobs Delhi NCR, MEP technician careers, warehouse supervisor jobs, MANABS hiring',
    canonical: 'https://manabs.com/#/careers',
  },
  contact: {
    title: 'Contact Us | Corporate Enquiry & Proposal Request — MANABS',
    description: 'Get in touch with MANABS facilities and workforce consultants in Delhi & NCR, Uttar Pradesh, Haryana, Uttarakhand, and Pan-India. 24/7 operations support.',
    keywords: 'contact MANABS, facility management enquiry, hire workforce Delhi NCR, corporate staffing quote, MANEBZ office address',
    canonical: 'https://manabs.com/#/contact',
  },
};

const SEOHead = ({ currentPage }) => {
  useEffect(() => {
    const data = seoConfig[currentPage] || seoConfig.home;

    // 1. Update Title
    document.title = data.title;

    // 2. Helper to set or create meta tag
    const setMeta = (attr, key, content) => {
      let elem = document.querySelector(`meta[${attr}="${key}"]`);
      if (!elem) {
        elem = document.createElement('meta');
        elem.setAttribute(attr, key);
        document.head.appendChild(elem);
      }
      elem.setAttribute('content', content);
    };

    // 3. Primary Meta Tags
    setMeta('name', 'description', data.description);
    setMeta('name', 'keywords', data.keywords);
    setMeta('name', 'author', 'MANABS / MANEBZ Facilities & Workforce Management');
    setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

    // 4. OpenGraph Tags
    setMeta('property', 'og:title', data.title);
    setMeta('property', 'og:description', data.description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', data.canonical);
    setMeta('property', 'og:site_name', 'MANABS / MANEBZ');
    setMeta('property', 'og:locale', 'en_IN');

    // 5. Twitter Card Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', data.title);
    setMeta('name', 'twitter:description', data.description);

    // 6. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', data.canonical);

    // 7. Inject Schema.org JSON-LD Structured Data
    const schemaId = 'manabs-json-ld';
    let schemaScript = document.getElementById(schemaId);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://manabs.com/#organization",
          "name": "MANABS / MANEBZ",
          "url": "https://manabs.com",
          "logo": "https://manabs.com/assets/logo.jpg",
          "foundingDate": "2014-02-27",
          "founders": [
            {
              "@type": "Person",
              "name": "Facilities & Engineering Industry Pioneers"
            }
          ],
          "description": "Strategic Facilities Management, HR Staffing & Payroll, Logistics & Warehouse, and Statutory Compliance.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "New Delhi / Gurugram / Noida",
            "addressRegion": "Delhi NCR",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-11-4982-3000",
            "contactType": "customer support",
            "areaServed": ["IN-DL", "IN-UP", "IN-HR", "IN-UT", "IN"],
            "availableLanguage": ["English", "Hindi"]
          },
          "areaServed": [
            { "@type": "AdministrativeArea", "name": "Delhi & NCR" },
            { "@type": "AdministrativeArea", "name": "Uttar Pradesh" },
            { "@type": "AdministrativeArea", "name": "Haryana" },
            { "@type": "AdministrativeArea", "name": "Uttarakhand" }
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://manabs.com/#website",
          "url": "https://manabs.com",
          "name": "MANABS Facilities & Workforce Management",
          "publisher": {
            "@id": "https://manabs.com/#organization"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://manabs.com/#/home"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": currentPage.charAt(0).toUpperCase() + currentPage.slice(1),
              "item": data.canonical
            }
          ]
        }
      ]
    };

    schemaScript.textContent = JSON.stringify(structuredData);

  }, [currentPage]);

  return null;
};

export default SEOHead;
