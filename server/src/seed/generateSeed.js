import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categoriesData = [
  {
    id: "cat_farmer",
    slug: "farmer-agriculture",
    name: "Farmer & Agriculture",
    name_hi: "किसान और कृषि",
    icon: "Wheat",
    description: "Financial support, crop insurance, credit cards, and farming equipment subsidies.",
    description_hi: "वित्तीय सहायता, फसल बीमा, क्रेडिट कार्ड और कृषि उपकरण सब्सिडी।",
    color: "emerald"
  },
  {
    id: "cat_education",
    slug: "education-student",
    name: "Education & Student",
    name_hi: "शिक्षा और विद्यार्थी",
    icon: "GraduationCap",
    description: "Scholarships, college admissions, exam notifications, and student loan schemes.",
    description_hi: "छात्रवृत्ति, कॉलेज प्रवेश, परीक्षा अधिसूचनाएं और छात्र ऋण योजनाएं।",
    color: "blue"
  },
  {
    id: "cat_health",
    slug: "health-family",
    name: "Health & Family",
    name_hi: "स्वास्थ्य और परिवार",
    icon: "HeartPulse",
    description: "Cashless healthcare, health insurance, vaccination, and maternal health benefits.",
    description_hi: "कैशलेस स्वास्थ्य सेवा, स्वास्थ्य बीमा, टीकाकरण और मातृ स्वास्थ्य लाभ।",
    color: "rose"
  },
  {
    id: "cat_employment",
    slug: "employment-business",
    name: "Employment & Business",
    name_hi: "रोजगार और व्यापार",
    icon: "Briefcase",
    description: "Job portals, skill training, MSME loans, subsidies, and business registrations.",
    description_hi: "रोजगार पोर्टल, कौशल प्रशिक्षण, एमएसएमई ऋण, सब्सिडी और व्यवसाय पंजीकरण।",
    color: "amber"
  },
  {
    id: "cat_housing",
    slug: "housing-urban",
    name: "Housing & Urban",
    name_hi: "आवास और शहरी विकास",
    icon: "Home",
    description: "Affordable housing subsidies, ration card, property registration, and urban amenities.",
    description_hi: "किफायती आवास सब्सिडी, राशन कार्ड, संपत्ति पंजीकरण और नागरिक सुविधाएं।",
    color: "indigo"
  },
  {
    id: "cat_identity",
    slug: "identity-certificates",
    name: "Identity & Certificates",
    name_hi: "पहचान और प्रमाण पत्र",
    icon: "CreditCard",
    description: "Aadhaar, PAN card, voter ID, caste/income certificates, birth & death records.",
    description_hi: "आधार, पैन कार्ड, वोटर आईडी, जाति/आय प्रमाण पत्र, जन्म व मृत्यु रिकॉर्ड।",
    color: "cyan"
  },
  {
    id: "cat_transport",
    slug: "transport-vehicles",
    name: "Transport & Vehicles",
    name_hi: "परिवहन और वाहन",
    icon: "Car",
    description: "Driving licenses, vehicle RC registration, RTO services, and PUC certificates.",
    description_hi: "ड्राइविंग लाइसेंस, वाहन आरसी पंजीकरण, आरटीओ सेवाएं और पीयूसी प्रमाण पत्र।",
    color: "teal"
  },
  {
    id: "cat_welfare",
    slug: "social-welfare",
    name: "Social Welfare",
    name_hi: "सामाजिक कल्याण",
    icon: "Users",
    description: "Old age pension, disability certificates, widow assistance, and child protection.",
    description_hi: "वृद्धावस्था पेंशन, दिव्यांग प्रमाण पत्र, विधवा सहायता और बाल सुरक्षा योजनाएं।",
    color: "purple"
  },
  {
    id: "cat_legal",
    slug: "legal-citizen",
    name: "Legal & Citizen Services",
    name_hi: "कानूनी व नागरिक सेवाएं",
    icon: "Scale",
    description: "Police clearance, e-FIR, RTI online requests, free legal aid, and passport seva.",
    description_hi: "पुलिस सत्यापन, ई-एफआईआर, आरटीआई ऑनलाइन, मुफ्त कानूनी सहायता और पासपोर्ट सेवा।",
    color: "slate"
  },
  {
    id: "cat_others",
    slug: "others",
    name: "Others & Utilities",
    name_hi: "अन्य और नागरिक सुविधाएं",
    icon: "Layers",
    description: "Electricity connections, piped drinking water, municipal tax, and grievance redressal.",
    description_hi: "बिजली कनेक्शन, नल जल योजना, नगर पालिका कर और लोक शिकायत निवारण।",
    color: "violet"
  }
];

const servicesData = [
  // 1. Farmer & Agriculture (8)
  {
    id: "srv_pmkisan",
    category_id: "cat_farmer",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    title_hi: "पीएम-किसान सम्मान निधि योजना",
    department: "Ministry of Agriculture & Farmers Welfare",
    scheme_type: "Central",
    mode: "Online",
    state: "All India",
    benefits: "Direct income support of ₹6,000 per year transferred in 3 equal four-monthly installments into bank accounts.",
    benefits_hi: "बैंक खातों में 3 समान किस्तों में प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।",
    processing_time: "15 to 30 Days",
    fee: "Free of cost",
    official_url: "https://pmkisan.gov.in",
    is_popular: true,
    description: "PM-KISAN is a central sector scheme to augment income of small and marginal landholding farmer families across the country for procurement of agricultural inputs.",
    description_hi: "पीएम-किसान योजना देश भर के छोटे और सीमांत किसान परिवारों को कृषि आदानों की खरीद के लिए आय सहायता प्रदान करती है।",
    tags: ["farmer", "agriculture", "kisan", "pm kisan", "cash transfer", "kheti", "dbt"],
    keywords: ["kisan", "pm kisan", "pm-kisan", "pmkisan", "farmer", "agriculture", "kheti", "kisan samman nidhi", "6000", "fasal", "krishi"],
    eligibility_rules: { min_age: 18, max_age: 100, occupations: ["farmer", "agricultural_worker", "landholder"], max_annual_income: 600000 },
    documents: [
      { id: "doc_1", name: "Aadhaar Card", mandatory: true },
      { id: "doc_2", name: "Land Ownership Record (Khata/Khasra/ROR)", mandatory: true },
      { id: "doc_3", name: "Bank Passbook with IFSC", mandatory: true }
    ],
    guidance_steps: [
      { step_no: 1, title: "Self Registration", description: "Visit the PM-KISAN official portal or nearest CSC Kendra and click 'New Farmer Registration'." },
      { step_no: 2, title: "Aadhaar Authentication", description: "Enter your 12-digit Aadhaar number and OTP." },
      { step_no: 3, title: "Fill Land & Bank Details", description: "Provide state, district, block, land survey number, and bank details." }
    ]
  },
  {
    id: "srv_pmfby",
    category_id: "cat_farmer",
    title: "PM Fasal Bima Yojana (PMFBY)",
    title_hi: "प्रधानमंत्री फसल बीमा योजना",
    department: "Ministry of Agriculture & Farmers Welfare",
    scheme_type: "Central",
    mode: "Hybrid",
    state: "All India",
    benefits: "Comprehensive insurance cover for crop failure due to natural calamities, pests, and diseases at low premium rates (1.5% to 2%).",
    benefits_hi: "प्राकृतिक आपदाओं, कीटों और बीमारियों के कारण फसल नुकसान पर व्यापक बीमा कवर।",
    processing_time: "7 to 15 Days post claim",
    fee: "1.5% for Rabi, 2% for Kharif crops",
    official_url: "https://pmfby.gov.in",
    is_popular: true,
    description: "Financial support to farmers suffering crop loss/damage arising out of unforeseen events, encouraging farmers to continue farming.",
    description_hi: "अप्रत्याशित घटनाओं के कारण फसल नुकसान से पीड़ित किसानों को वित्तीय सहायता।",
    tags: ["fasal bima", "crop insurance", "kisan", "pmfby", "agriculture insurance"],
    keywords: ["fasal", "bima", "fasal bima", "pmfby", "crop insurance", "insurance", "kisan bima", "calamity"],
    eligibility_rules: { min_age: 18, max_age: 100, occupations: ["farmer", "agricultural_worker"] },
    documents: [
      { id: "doc_pmfby_1", name: "Land Sowing Certificate", mandatory: true },
      { id: "doc_pmfby_2", name: "Aadhaar Card & Bank Account", mandatory: true }
    ],
    guidance_steps: [
      { step_no: 1, title: "Apply at Bank/CSC", description: "Fill crop sowing form at bank or CSC center before cutoff date." },
      { step_no: 2, title: "Premium Payment", description: "Pay subsidized premium amount." }
    ]
  },
  {
    id: "srv_kcc",
    category_id: "cat_farmer",
    title: "Kisan Credit Card (KCC) Scheme",
    title_hi: "किसान क्रेडिट कार्ड (KCC)",
    department: "Department of Agriculture and Farmers Welfare / NABARD",
    scheme_type: "Central",
    mode: "Hybrid",
    state: "All India",
    benefits: "Institutional credit up to ₹3 Lakh at concessional interest rate of 4% per annum with prompt repayment incentive.",
    benefits_hi: "4% प्रति वर्ष की रियायती ब्याज दर पर ₹3 लाख तक का संस्थागत ऋण।",
    processing_time: "14 Days",
    fee: "Nil for loans up to ₹1.6 Lakh",
    official_url: "https://agricoop.nic.in",
    is_popular: true,
    description: "KCC provides timely credit to farmers for agricultural inputs like seeds, fertilizers, pesticides, and allied activities like animal husbandry.",
    description_hi: "किसानों को बीज, उर्वरक, कीटनाशकों के लिए समय पर ऋण उपलब्ध कराता है।",
    tags: ["kcc", "kisan credit card", "farm loan", "nabard", "credit"],
    keywords: ["kcc", "kisan credit card", "credit card", "farm loan", "kisan loan", "nabard", "krishi loan"],
    eligibility_rules: { min_age: 18, max_age: 75, occupations: ["farmer", "agricultural_worker"] },
    documents: [
      { id: "doc_kcc_1", name: "Land Revenue Receipt / Pattadar Passbook", mandatory: true },
      { id: "doc_kcc_2", name: "Aadhaar & PAN Card", mandatory: true }
    ],
    guidance_steps: [
      { step_no: 1, title: "Submit Application", description: "Submit KCC form at local bank branch along with land documents." }
    ]
  },
  {
    id: "srv_pmksy",
    category_id: "cat_farmer",
    title: "PM Krishi Sinchayee Yojana (PMKSY) - Micro Irrigation",
    title_hi: "प्रधानमंत्री कृषि सिंचाई योजना",
    department: "Ministry of Agriculture & Farmers Welfare",
    scheme_type: "Central",
    mode: "Hybrid",
    state: "All India",
    benefits: "Up to 55% subsidy for small/marginal farmers on drip and sprinkler irrigation installations.",
    benefits_hi: "ड्रिप और स्प्रिंकलर सिंचाई प्रतिष्ठानों पर 55% तक सब्सिडी।",
    processing_time: "30 Days",
    fee: "Free application",
    official_url: "https://pmksy.gov.in",
    is_popular: false,
    description: "Per Drop More Crop focus providing micro irrigation technologies to maximize water use efficiency for farming.",
    description_hi: "प्रति बूंद अधिक फसल पर ध्यान केंद्रित करने वाली सूक्ष्म सिंचाई योजना।",
    tags: ["irrigation", "drip irrigation", "sprinkler", "pmksy", "sinchayee"],
    keywords: ["pmksy", "sinchayee", "irrigation", "drip", "sprinkler", "water subsidy", "farm water"],
    eligibility_rules: { min_age: 18, max_age: 100, occupations: ["farmer"] },
    documents: [
      { id: "doc_pmksy_1", name: "Land record with water source proof", mandatory: true }
    ],
    guidance_steps: [
      { step_no: 1, title: "Register on State Horticulture Portal", description: "Apply online and select approved vendor." }
    ]
  },
  {
    id: "srv_shc",
    category_id: "cat_farmer",
    title: "Soil Health Card Scheme",
    title_hi: "मृदा स्वास्थ्य कार्ड योजना",
    department: "Department of Agriculture, Cooperation & Farmers Welfare",
    scheme_type: "Central",
    mode: "Hybrid",
    state: "All India",
    benefits: "Free soil testing and customized crop-wise fertilizer dosage recommendations issued every 3 years.",
    benefits_hi: "निःशुल्क मिट्टी परीक्षण और प्रत्येक 3 वर्ष में फसल-वार उर्वरक खुराक की सिफारिशें।",
    processing_time: "20 Days",
    fee: "Free of cost",
    official_url: "https://soilhealth.dac.gov.in",
    is_popular: false,
    description: "Helps farmers improve productivity by calling out nutrient deficiencies and recommending balanced fertilizer usage.",
    description_hi: "मिट्टी में पोषक तत्वों की कमी का पता लगाकर उर्वरक के संतुलित उपयोग की सलाह देती है।",
    tags: ["soil test", "soil health card", "kisan", "fertilizer recommendation"],
    keywords: ["soil health", "soil card", "soil test", "mitti parikshan", "shc", "fertilizer"],
    eligibility_rules: { min_age: 18, max_age: 100, occupations: ["farmer"] },
    documents: [{ id: "doc_shc_1", name: "Khasra / Land Details", mandatory: true }],
    guidance_steps: [{ step_no: 1, title: "Soil Sample Collection", description: "Agriculture official collects soil sample from field." }]
  },
  {
    id: "srv_pmkmy",
    category_id: "cat_farmer",
    title: "PM Kisan Maandhan Yojana (Pension for Farmers)",
    title_hi: "प्रधानमंत्री किसान मानधन योजना",
    department: "Ministry of Agriculture & LIC",
    scheme_type: "Central",
    mode: "Online",
    state: "All India",
    benefits: "Assured monthly pension of ₹3,000 to small and marginal farmers upon attaining the age of 60 years.",
    benefits_hi: "60 वर्ष की आयु प्राप्त करने पर छोटे और सीमांत किसानों को ₹3,000 की मासिक निश्चित पेंशन।",
    processing_time: "7 Days",
    fee: "Monthly contribution ₹55 to ₹200 (50% matched by Govt)",
    official_url: "https://maandhan.in",
    is_popular: false,
    description: "Voluntary and contributory pension scheme for small and marginal farmers having cultivable land up to 2 hectares.",
    description_hi: "छोटे और सीमांत किसानों के लिए स्वैच्छिक और अंशदायी पेंशन योजना।",
    tags: ["kisan pension", "pmkmy", "maandhan", "farmer pension"],
    keywords: ["kisan pension", "pmkmy", "maandhan", "farmer pension", "3000 pension", "lic kisan"],
    eligibility_rules: { min_age: 18, max_age: 40, occupations: ["farmer"], max_annual_income: 300000 },
    documents: [{ id: "doc_pmkmy_1", name: "Aadhaar Card & Savings Bank Account", mandatory: true }],
    guidance_steps: [{ step_no: 1, title: "Enrollment at CSC", description: "Enroll through nearest CSC with Aadhaar and auto-debit consent." }]
  },
  {
    id: "srv_pkvy",
    category_id: "cat_farmer",
    title: "Paramparagat Krishi Vikas Yojana (Organic Farming)",
    title_hi: "परम्परागत कृषि विकास योजना",
    department: "Ministry of Agriculture & Farmers Welfare",
    scheme_type: "Central",
    mode: "Hybrid",
    state: "All India",
    benefits: "Financial assistance of ₹50,000 per hectare for organic inputs, certification, and marketing.",
    benefits_hi: "जैविक आदानों, प्रमाणीकरण और विपणन के लिए ₹50,000 प्रति हेक्टेयर की वित्तीय सहायता।",
    processing_time: "30 Days",
    fee: "Free of cost",
    official_url: "https://pgsindia-ncof.gov.in",
    is_popular: false,
    description: "Promotes organic farming through cluster approach and Participatory Guarantee System (PGS) certification.",
    description_hi: "जैविक खेती को बढ़ावा देने और प्रमाणीकरण प्रदान करने की योजना।",
    tags: ["organic farming", "pkvy", "jaivik kheti", "fertilizer free"],
    keywords: ["organic farming", "jaivik kheti", "pkvy", "pgs india", "organic subsidy"],
    eligibility_rules: { min_age: 18, max_age: 100, occupations: ["farmer"] },
    documents: [{ id: "doc_pkvy_1", name: "Farmer Cluster Registration", mandatory: true }],
    guidance_steps: [{ step_no: 1, title: "Form Cluster of 20 Farmers", description: "Form local cluster to register for PGS organic certification." }]
  },
  {
    id: "srv_nlm",
    category_id: "cat_farmer",
    title: "National Livestock Mission (NLM) Subsidy",
    title_hi: "राष्ट्रीय पशुधन मिशन (NLM)",
    department: "Department of Animal Husbandry and Dairying",
    scheme_type: "Central",
    mode: "Online",
    state: "All India",
    benefits: "50% capital subsidy up to ₹50 Lakhs for poultry, sheep, goat farming, and fodder entrepreneurship.",
    benefits_hi: "पोल्ट्री, भेड़, बकरी पालन और चारा उद्यमिता के लिए ₹50 लाख तक 50% पूंजी सब्सिडी।",
    processing_time: "45 Days",
    fee: "Free application",
    official_url: "https://nlm.udyamimitra.in",
    is_popular: false,
    description: "Sustainable development of livestock sector focusing on breed improvement, fodder availability, and entrepreneurship.",
    description_hi: "पशुधन क्षेत्र का सतत विकास और पशुपालन उद्यमिता प्रोत्साहन।",
    tags: ["livestock", "dairy subsidy", "goat farming", "poultry loan", "nlm"],
    keywords: ["nlm", "livestock", "dairy loan", "goat farming", "poultry loan", "pashupalan", "subsidy"],
    eligibility_rules: { min_age: 18, max_age: 70, occupations: ["farmer", "business_owner", "artisan"] },
    documents: [{ id: "doc_nlm_1", name: "Project DPR & Land Lease Agreement", mandatory: true }],
    guidance_steps: [{ step_no: 1, title: "Submit DPR on NLM Portal", description: "Upload detailed project report and land documents." }]
  }
];

console.log("Initial Services set:", servicesData.length);
