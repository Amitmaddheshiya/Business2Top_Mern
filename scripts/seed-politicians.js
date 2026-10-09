require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('../src/models/Business');

const politicians = [
  {
    uniqueId: "MODI01",
    name: "Office of the Prime Minister of India – Narendra Modi",
    email: "pmosb@pmo.nic.in",
    website: "https://www.pmindia.gov.in/",
    logo: "https://www.pmindia.gov.in/",
    address: "Prime Minister's Office, Seva Teerth, New Delhi, India",
    description: "Narendra Modi is the Prime Minister of India and a senior leader of the Bharatiya Janata Party (BJP).",
    productsAndServices: ["National governance", "public administration", "government policy", "citizen services", "national development"],
    averageRating: 4.8,
    totalVotes: 1250,
    ratings: [],
    isVerified: true,
    hasCrown: true
  },
  {
    uniqueId: "SHAH02",
    name: "Office of Amit Shah – Ministry of Home Affairs",
    email: "contact@mha.gov.in",
    website: "https://www.mha.gov.in/",
    logo: "https://www.mha.gov.in/",
    address: "Ministry of Home Affairs, North Block, New Delhi, India",
    description: "Amit Shah is a senior BJP leader and Union Minister responsible for Home Affairs and Cooperation.",
    productsAndServices: ["Internal security", "public administration", "national security policy", "cooperative sector development", "government services"],
    averageRating: 4.7,
    totalVotes: 980,
    ratings: [],
    isVerified: true,
    hasCrown: true
  },
  {
    uniqueId: "JAI03",
    name: "Office of Dr. S. Jaishankar – Ministry of External Affairs",
    email: "contact@mea.gov.in",
    website: "https://www.mea.gov.in/",
    logo: "https://www.mea.gov.in/",
    address: "Ministry of External Affairs, South Block, New Delhi, India",
    description: "S. Jaishankar is India's Union Minister of External Affairs and a senior BJP leader.",
    productsAndServices: ["Foreign affairs", "diplomacy", "international relations", "consular services", "bilateral cooperation"],
    averageRating: 4.6,
    totalVotes: 850,
    ratings: [],
    isVerified: true,
    hasCrown: true
  },
  {
    uniqueId: "YOGI04",
    name: "Office of the Chief Minister of Uttar Pradesh – Yogi Adityanath",
    email: "cm@up.gov.in",
    website: "https://upcmo.up.nic.in/",
    logo: "https://up.gov.in/",
    address: "Chief Minister's Office, Government of Uttar Pradesh, Lucknow, Uttar Pradesh, India",
    description: "Yogi Adityanath is the Chief Minister of Uttar Pradesh and a senior BJP leader.",
    productsAndServices: ["State governance", "public welfare", "infrastructure development", "law and order", "citizen grievance services"],
    averageRating: 4.5,
    totalVotes: 1100,
    ratings: [],
    isVerified: true,
    hasCrown: true
  },
  {
    uniqueId: "GOY05",
    name: "Office of Piyush Goyal – Ministry of Commerce and Industry",
    email: "contact@commerce.gov.in",
    website: "https://commerce.gov.in/",
    logo: "https://commerce.gov.in/",
    address: "Ministry of Commerce and Industry, Udyog Bhawan, New Delhi, India",
    description: "Piyush Goyal is a Union Minister and senior BJP leader associated with commerce, industry and trade policy.",
    productsAndServices: ["Trade policy", "industrial development", "export promotion", "investment facilitation", "international commerce"],
    averageRating: 4.4,
    totalVotes: 720,
    ratings: [],
    isVerified: true,
    hasCrown: true
  },
  {
    uniqueId: "RAJ06",
    name: "Office of Rajnath Singh – Ministry of Defence",
    email: "contact@mod.gov.in",
    website: "https://mod.gov.in/",
    logo: "https://mod.gov.in/",
    address: "Ministry of Defence, South Block, New Delhi, India",
    description: "Rajnath Singh is India's Union Minister of Defence and a senior BJP leader.",
    productsAndServices: ["Defence administration", "national defence policy", "military modernisation", "defence procurement", "national security"],
    averageRating: 4.3,
    totalVotes: 890,
    ratings: [],
    isVerified: true,
    hasCrown: true
  },
  {
    uniqueId: "SIT07",
    name: "Office of Nirmala Sitharaman – Ministry of Finance",
    email: "contact@finmin.gov.in",
    website: "https://finmin.gov.in/",
    logo: "https://finmin.gov.in/",
    address: "Ministry of Finance, North Block, New Delhi, India",
    description: "Nirmala Sitharaman is India's Union Minister of Finance and a senior BJP leader.",
    productsAndServices: ["National budget", "taxation policy", "public finance", "economic policy", "corporate affairs administration"],
    averageRating: 4.2,
    totalVotes: 950,
    ratings: [],
    isVerified: true,
    hasCrown: true
  },
  {
    uniqueId: "GAD08",
    name: "Office of Nitin Gadkari – Ministry of Road Transport and Highways",
    email: "contact@morth.nic.in",
    website: "https://morth.nic.in/",
    logo: "https://morth.nic.in/",
    address: "Ministry of Road Transport and Highways, Transport Bhawan, New Delhi, India",
    description: "Nitin Gadkari is a senior BJP leader and Union Minister responsible for road transport and highways.",
    productsAndServices: ["Highway development", "road infrastructure", "road safety", "transport policy", "national highway projects"],
    averageRating: 4.1,
    totalVotes: 780,
    ratings: [],
    isVerified: true,
    hasCrown: true
  },
  {
    uniqueId: "NAD09",
    name: "Office of J. P. Nadda – Ministry of Health and Family Welfare",
    email: "contact@mohfw.gov.in",
    website: "https://mohfw.gov.in/",
    logo: "https://mohfw.gov.in/",
    address: "Ministry of Health and Family Welfare, Nirman Bhawan, New Delhi, India",
    description: "J. P. Nadda is a senior BJP leader and Union Minister associated with health and family welfare.",
    productsAndServices: ["Public healthcare policy", "family welfare", "national health programmes", "healthcare administration", "public health services"],
    averageRating: 4.0,
    totalVotes: 650,
    ratings: [],
    isVerified: true,
    hasCrown: true
  },
  {
    uniqueId: "CH10",
    name: "Office of Shivraj Singh Chouhan – Ministry of Agriculture and Farmers Welfare",
    email: "contact@agriwelfare.gov.in",
    website: "https://agriwelfare.gov.in/",
    logo: "https://agriwelfare.gov.in/",
    address: "Ministry of Agriculture and Farmers Welfare, Krishi Bhawan, New Delhi, India",
    description: "Shivraj Singh Chouhan is a senior BJP leader and Union Minister responsible for agriculture and farmers' welfare.",
    productsAndServices: ["Agricultural policy", "farmer welfare", "crop development", "agricultural support programmes", "rural development"],
    averageRating: 3.9,
    totalVotes: 580,
    ratings: [],
    isVerified: true,
    hasCrown: true
  },
  {
    uniqueId: "RAH11",
    name: "Office of Rahul Gandhi – Indian National Congress",
    email: "contact@inc.in",
    website: "https://inc.in/",
    logo: "https://inc.in/",
    address: "Indian National Congress Headquarters, Indira Bhawan, New Delhi, India",
    description: "Rahul Gandhi is a senior Indian National Congress leader and Member of Parliament who has served as Leader of the Opposition in the Lok Sabha.",
    productsAndServices: ["Parliamentary representation", "public policy", "constituency services", "political advocacy", "public engagement"],
    averageRating: 4.5,
    totalVotes: 1200,
    ratings: [],
    isVerified: true,
    hasCrown: false
  },
  {
    uniqueId: "MAM12",
    name: "Office of the Chief Minister of West Bengal – Mamata Banerjee",
    email: "cm@wb.gov.in",
    website: "https://wb.gov.in/",
    logo: "https://aitcofficial.org/",
    address: "Chief Minister's Office, Nabanna, Howrah, West Bengal, India",
    description: "Mamata Banerjee is the Chief Minister of West Bengal and the founder and leader of the All India Trinamool Congress.",
    productsAndServices: ["State governance", "public welfare", "social development", "state infrastructure", "citizen grievance services"],
    averageRating: 4.4,
    totalVotes: 1050,
    ratings: [],
    isVerified: true,
    hasCrown: false
  },
  {
    uniqueId: "KHA13",
    name: "Office of Mallikarjun Kharge – Indian National Congress",
    email: "contact@inc.in",
    website: "https://inc.in/",
    logo: "https://inc.in/",
    address: "Indian National Congress Headquarters, Indira Bhawan, New Delhi, India",
    description: "Mallikarjun Kharge is the President of the Indian National Congress and a senior parliamentary leader.",
    productsAndServices: ["Party administration", "parliamentary representation", "political policy", "public engagement", "organisational leadership"],
    averageRating: 4.3,
    totalVotes: 920,
    ratings: [],
    isVerified: true,
    hasCrown: false
  },
  {
    uniqueId: "AKH14",
    name: "Office of Akhilesh Yadav – Samajwadi Party",
    email: "contact@samajwadiparty.in",
    website: "https://samajwadiparty.in/",
    logo: "https://samajwadiparty.in/",
    address: "Samajwadi Party Office, Lucknow, Uttar Pradesh, India",
    description: "Akhilesh Yadav is the National President of the Samajwadi Party and a Member of Parliament.",
    productsAndServices: ["Political organisation", "parliamentary representation", "public policy", "social welfare advocacy", "constituency services"],
    averageRating: 4.2,
    totalVotes: 870,
    ratings: [],
    isVerified: true,
    hasCrown: false
  },
  {
    uniqueId: "STO15",
    name: "Office of the Chief Minister of Tamil Nadu – M. K. Stalin",
    email: "cm@tn.gov.in",
    website: "https://www.tn.gov.in/",
    logo: "https://dmk.in/",
    address: "Chief Minister's Office, Secretariat, Fort St. George, Chennai, Tamil Nadu, India",
    description: "M. K. Stalin is a senior DMK leader and has served as Chief Minister of Tamil Nadu.",
    productsAndServices: ["State governance", "public welfare", "infrastructure development", "education policy", "industrial development"],
    averageRating: 4.1,
    totalVotes: 980,
    ratings: [],
    isVerified: true,
    hasCrown: false
  },
  {
    uniqueId: "KEJ16",
    name: "Office of Arvind Kejriwal – Aam Aadmi Party",
    email: "contact@aamaadmiparty.org",
    website: "https://aamaadmiparty.org/",
    logo: "https://aamaadmiparty.org/",
    address: "Aam Aadmi Party Headquarters, New Delhi, India",
    description: "Arvind Kejriwal is the National Convenor of the Aam Aadmi Party and a prominent Indian political leader.",
    productsAndServices: ["Party administration", "public policy", "political advocacy", "citizen engagement", "public welfare initiatives"],
    averageRating: 4.0,
    totalVotes: 1100,
    ratings: [],
    isVerified: true,
    hasCrown: false
  },
  {
    uniqueId: "SHA17",
    name: "Office of Sharad Pawar – Nationalist Congress Party (Sharadchandra Pawar)",
    email: "contact@ncpsp.in",
    website: "https://ncpsp.in/",
    logo: "https://ncpsp.in/",
    address: "Party Office, Mumbai, Maharashtra, India",
    description: "Sharad Pawar is a veteran Indian political leader associated with the Nationalist Congress Party (Sharadchandra Pawar).",
    productsAndServices: ["Political leadership", "public policy", "parliamentary representation", "agricultural advocacy", "public engagement"],
    averageRating: 3.9,
    totalVotes: 750,
    ratings: [],
    isVerified: true,
    hasCrown: false
  },
  {
    uniqueId: "CHA18",
    name: "Office of the Chief Minister of Andhra Pradesh – N. Chandrababu Naidu",
    email: "cm@ap.gov.in",
    website: "https://ap.gov.in/",
    logo: "https://www.telugudesam.org/",
    address: "Chief Minister's Office, Government of Andhra Pradesh, Amaravati, Andhra Pradesh, India",
    description: "N. Chandrababu Naidu is the Chief Minister of Andhra Pradesh and a senior Telugu Desam Party leader.",
    productsAndServices: ["State governance", "technology-led development", "infrastructure projects", "investment promotion", "public administration"],
    averageRating: 3.8,
    totalVotes: 820,
    ratings: [],
    isVerified: true,
    hasCrown: false
  },
  {
    uniqueId: "PIN19",
    name: "Office of the Chief Minister of Kerala – Pinarayi Vijayan",
    email: "cm@kerala.gov.in",
    website: "https://kerala.gov.in/",
    logo: "https://www.cpimkerala.org/",
    address: "Chief Minister's Office, Government Secretariat, Thiruvananthapuram, Kerala, India",
    description: "Pinarayi Vijayan is a senior CPI(M) leader who has served as Chief Minister of Kerala.",
    productsAndServices: ["State governance", "public welfare", "healthcare policy", "education", "infrastructure development"],
    averageRating: 3.7,
    totalVotes: 760,
    ratings: [],
    isVerified: true,
    hasCrown: false
  },
  {
    uniqueId: "TEJ20",
    name: "Office of Tejashwi Yadav – Rashtriya Janata Dal",
    email: "contact@rjd.co.in",
    website: "https://rjd.co.in/",
    logo: "https://rjd.co.in/",
    address: "Rashtriya Janata Dal Office, Patna, Bihar, India",
    description: "Tejashwi Yadav is a senior Rashtriya Janata Dal leader and has served as Leader of the Opposition in Bihar.",
    productsAndServices: ["Political organisation", "public policy", "youth engagement", "social welfare advocacy", "constituency services"],
    averageRating: 3.6,
    totalVotes: 690,
    ratings: [],
    isVerified: true,
    hasCrown: false
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trustmark';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing businesses (optional - remove if you want to keep existing data)
    await Business.deleteMany({});
    console.log('Cleared existing businesses');

    // Insert politicians
    const insertedBusinesses = await Business.insertMany(politicians);
    console.log(`Inserted ${insertedBusinesses.length} politician profiles`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
