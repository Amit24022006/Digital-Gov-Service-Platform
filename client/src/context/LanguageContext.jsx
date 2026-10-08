import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    portalName: 'GovDesk',
    tagline: 'All Government Services · One Platform',
    mission: 'Right information at the right time — for every citizen',
    discover: 'Discover',
    understand: 'Understand',
    getGuidance: 'Get Guidance',
    stayInformed: 'Stay Informed',
    home: 'Home',
    services: 'All Services',
    categories: 'Categories',
    eligibilityChecker: 'Check Eligibility',
    officeLocator: 'Find Office',
    compareSchemes: 'Compare Schemes',
    grievance: 'Helpdesk / Grievance',
    login: 'Login',
    register: 'Sign Up',
    myProfile: 'My Profile',
    logout: 'Logout',
    adminPanel: 'Admin Backoffice',
    searchPlaceholder: 'Search by scheme name, benefit, keyword (e.g. Kisan, Scholarship, Ayushman)...',
    searchBtn: 'Search Services',
    exploreByCategory: 'Explore Services by Category',
    categoriesSubtitle: 'Browse authenticated schemes across 10 official citizen categories',
    popularServices: 'Popular & Trending Schemes',
    popularSubtitle: 'Most accessed public services and government schemes this week',
    viewAll: 'View All Schemes',
    viewDetails: 'View Details',
    applyOfficial: 'Apply on Official Portal',
    checkMyEligibility: 'Check If You Are Eligible',
    eligibilityTitle: 'Smart Eligibility Checker',
    eligibilitySubtitle: 'Fill your details to instantly discover which government schemes you qualify for.',
    requiredDocs: 'Required Documents',
    stepByStep: 'Step-by-Step Guidance',
    officeMap: 'Office Location & Map',
    faqs: 'Frequently Asked Questions',
    notifications: 'Notifications',
    markAllRead: 'Mark all as read',
    noNotifications: 'No unread notifications',
    benefits: 'Benefits & Financial Assistance',
    department: 'Department / Ministry',
    schemeType: 'Scheme Type',
    processingTime: 'Processing Time',
    fees: 'Application Fee',
    savedBookmarks: 'Saved Schemes',
    saveScheme: 'Save Scheme',
    saved: 'Saved',
    compare: 'Compare',
    compareSelected: 'Compare Selected',
    trackGrievance: 'Track Grievance',
    lodgeGrievance: 'Lodge Grievance',
    tollFree: 'Toll-Free Helpline: 1800-11-GOVDESK (9:00 AM - 6:00 PM)'
  },
  hi: {
    portalName: 'गोवडेस्क (GovDesk)',
    tagline: 'सभी सरकारी सेवाएं · एक मंच',
    mission: 'सही समय पर सही जानकारी — हर नागरिक के लिए',
    discover: 'खोजें',
    understand: 'समझें',
    getGuidance: 'मार्गदर्शन लें',
    stayInformed: 'अपडेट रहें',
    home: 'होम',
    services: 'सभी सेवाएं व योजनाएं',
    categories: 'श्रेणियां',
    eligibilityChecker: 'पात्रता जांचें',
    officeLocator: 'नजदीकी कार्यालय खोजें',
    compareSchemes: 'योजनाओं की तुलना करें',
    grievance: 'हेल्पडेस्क / शिकायत निवारण',
    login: 'लॉग इन',
    register: 'रजिस्टर करें',
    myProfile: 'मेरी प्रोफाइल',
    logout: 'लॉग आउट',
    adminPanel: 'प्रशासनिक पैनल',
    searchPlaceholder: 'योजना का नाम, लाभ, कीवर्ड खोजें (उदा. किसान, छात्रवृत्ति, आयुष्मान)...',
    searchBtn: 'सेवाएं खोजें',
    exploreByCategory: 'श्रेणी के अनुसार सेवाएं खोजें',
    categoriesSubtitle: '10 आधिकारिक श्रेणियों में प्रमाणित सरकारी योजनाओं का अवलोकन करें',
    popularServices: 'लोकप्रिय और प्रमुख योजनाएं',
    popularSubtitle: 'नागरिकों द्वारा इस सप्ताह सबसे अधिक देखी गई योजनाएं',
    viewAll: 'सभी योजनाएं देखें',
    viewDetails: 'विवरण देखें',
    applyOfficial: 'आधिकारिक पोर्टल पर आवेदन करें',
    checkMyEligibility: 'अपनी पात्रता जांचें',
    eligibilityTitle: 'स्मार्ट पात्रता कैलकुलेटर',
    eligibilitySubtitle: 'अपनी जानकारी भरें और तुरंत जानें कि आप किन सरकारी योजनाओं के लिए पात्र हैं।',
    requiredDocs: 'आवश्यक दस्तावेज',
    stepByStep: 'चरणबद्ध मार्गदर्शन',
    officeMap: 'कार्यालय का स्थान व नक्शा',
    faqs: 'अक्सर पूछे जाने वाले सवाल',
    notifications: 'अधिसूचनाएं',
    markAllRead: 'सभी को पढ़ा हुआ चिन्हित करें',
    noNotifications: 'कोई नई अधिसूचना नहीं है',
    benefits: 'लाभ एवं वित्तीय सहायता',
    department: 'विभाग / मंत्रालय',
    schemeType: 'योजना का प्रकार',
    processingTime: 'प्रक्रिया समय',
    fees: 'आवेदन शुल्क',
    savedBookmarks: 'सहेजी गई योजनाएं',
    saveScheme: 'योजना सहेजें',
    saved: 'सहेजा गया',
    compare: 'तुलना करें',
    compareSelected: 'चुनी गई योजनाओं की तुलना',
    trackGrievance: 'शिकायत ट्रैक करें',
    lodgeGrievance: 'शिकायत दर्ज करें',
    tollFree: 'टोल-फ्री हेल्पलाइन: 1800-11-GOVDESK (सुबह 9:00 - शाम 6:00)'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('govdesk_lang') || 'en';
  });

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    localStorage.setItem('govdesk_lang', next);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
