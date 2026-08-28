import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db.js"; // Adjust relative path if needed (e.g. "../lib/db.js")

const data = [
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "LawBridge",
  //   projectName: "LawBridge",
  //   description:
  //     "A bilingual digital platform acting as a bridge between clients and verified lawyers. It streamlines the legal service journey by allowing users to search by specialization, book and pay for consultations, communicate directly, and access an AI assistant for reliable legal information.",
  //   teamMembers: [
  //     {
  //       studentCode: "29909260100537",
  //       fullName: "Ahmed Maher Salama",
  //     },
  //     {
  //       studentCode: "29609222800866",
  //       fullName: "Youstina Atef Nour Mousa",
  //     },
  //     {
  //       studentCode: "30202220101866",
  //       fullName: "Semon Benyamin Yacoub Ghaly",
  //     },
  //     {
  //       studentCode: "29704270103509",
  //       fullName: "Basma Abdelmoniem Mohammed Abdelhamed",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "SwiftCare",
  //   projectName: "SwiftCare",
  //   description:
  //     "Named 'SwiftCare' to reflect its direct focus on health and emergency support, this web-based platform connects patients with doctors. It streamlines medical records, appointment booking, and emergency data access, while leveraging AI to analyze medical documents and provide rapid health consultations.",
  //   teamMembers: [
  //     {
  //       studentCode: "30308150400561",
  //       fullName: "Karen Ehab Zekry Abd Elnour",
  //     },
  //     {
  //       studentCode: "30201011315208",
  //       fullName: "amany elsayed ali elsayed",
  //     },
  //     {
  //       studentCode: "30006100106747",
  //       fullName: "Afaf Tawfek Hassan Tawfek",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Neura",
  //   projectName: "Neura",
  //   description:
  //     "An integrated healthcare platform dedicated to neurology. It facilitates accurate diagnosis, rapid decision-making for neurological conditions, continuous patient monitoring, and seamless appointment scheduling with specialized neuro-hospitals.",
  //   teamMembers: [
  //     {
  //       studentCode: "29908291200312",
  //       fullName: "Ahmed Talaat Kamel Ali",
  //     },
  //     {
  //       studentCode: "30005081202288",
  //       fullName: "rahma tamer hamed mahmoud mira",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "LogicCore",
  //   projectName: "LogicCore",
  //   description:
  //     "A cloud-native SaaS command center tailored for MENA logistics and transport networks. It centralizes real-time fleet tracking, automated COD settlements, and incident management through dynamic, role-based workspaces to optimize middle-and-last-mile operations.",
  //   teamMembers: [
  //     {
  //       studentCode: "30001011377476",
  //       fullName: "Hazem Abdelazez Abdelrahman Elsayed",
  //     },
  //     {
  //       studentCode: "29809191300532",
  //       fullName: "Hossam Hasan Ismail Muhammad",
  //     },
  //     {
  //       studentCode: "29804038800702",
  //       fullName: "Doaa Abdelhamed Mohamed",
  //     },
  //     {
  //       studentCode: "29802082503364",
  //       fullName: "Doaa Gamal Abd Ellal Ahmed",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Core360",
  //   projectName: "Core360",
  //   description:
  //     "Named 'Core360' to signify a comprehensive, all-around central hub for business operations, this robust system serves both product and service-based companies. It integrates CRM, inventory, supply chain, HRM, and a personalized employee workspace into a single, unified 360-degree platform.",
  //   teamMembers: [
  //     {
  //       studentCode: "29503031300879",
  //       fullName: "Omar Hassan Mahmoud",
  //     },
  //     {
  //       studentCode: "29911011400959",
  //       fullName: "Mohammed Saeed Abdel-Haleem Abdel-Maqsoud",
  //     },
  //     {
  //       studentCode: "29703102400038",
  //       fullName: "Abanoub wagih Hanna abadeer",
  //     },
  //     {
  //       studentCode: "30207241300666",
  //       fullName: "Rowan Mohamed Abdel Maboud Khalil",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Bidzone",
  //   projectName: "Bidzone",
  //   description:
  //     "A comprehensive online e-commerce platform enabling users to buy and sell products through real-time bidding. It ensures secure operations via wallet transactions, QR-code delivery verification, live chat, and an AI-powered assistant.",
  //   teamMembers: [
  //     {
  //       studentCode: "30107231900121",
  //       fullName: "Mariam Gameel Ibrahim Abdelrazik",
  //     },
  //     {
  //       studentCode: "29801221700785",
  //       fullName: "Passant Mohamed Abdel-Majid Selim",
  //     },
  //     {
  //       studentCode: "30209120101502",
  //       fullName: "Esraa Essam Ahmed Osman",
  //     },
  //     {
  //       studentCode: "30003032102615",
  //       fullName: "mohamed wagdi mohamed moslem",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "HireHub",
  //   projectName: "HireHub",
  //   description:
  //     "Acting as a central hub for modern recruitment, this intelligent platform guides candidates through a structured pipeline (chat interviews to placement tests). Powered by an AI ATS that semantically matches skills, it features a unique Recommendation Network that automatically",
  //   teamMembers: [
  //     {
  //       studentCode: "30204110104404",
  //       fullName: "shrouk muhammed sayed saleh",
  //     },
  //     {
  //       studentCode: "30002251201967",
  //       fullName: "Dalia Mahmoud Elshamy",
  //     },
  //     {
  //       studentCode: "30201121603004",
  //       fullName: "Merna Mohamed Saied",
  //     },
  //     {
  //       studentCode: "30009281304277",
  //       fullName: "Hussin Saleh Abdul Aziz Ahmed",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Flugur ERP",
  //   projectName: "Flugur ERP",
  //   description:
  //     "Named after the concept of 'Brilliance,' this AI-powered enterprise management platform is designed to illuminate business operations. It unifies accounting, inventory, HR, and business intelligence, transforming complex data into clear, predictive insights for smarter organizational decision-making.",
  //   teamMembers: [
  //     {
  //       studentCode: "29501240201877",
  //       fullName: "Youssef Safwat Sobhy Tawfik",
  //     },
  //     {
  //       studentCode: "30104150104135",
  //       fullName: "Yahia Ahmed Mohamed Mohamed Yahia",
  //     },
  //     {
  //       studentCode: "29901162403873",
  //       fullName: "amr gamal hassan",
  //     },
  //     {
  //       studentCode: "29308120202051",
  //       fullName: "amr mohamed mohamed elmaadawy",
  //     },
  //     {
  //       studentCode: "30209052201382",
  //       fullName: "Heidi Ramdan Abdallh Kandel",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Herafey",
  //   projectName: "Herafey",
  //   description:
  //     "Derived from the Arabic word for craftsman, this location-based platform bridges customers with nearby handymen. It streamlines the entire service lifecycle—from instant chat and live tracking to payments and reviews—using a structured role-based system.",
  //   teamMembers: [
  //     {
  //       studentCode: "30403010202681",
  //       fullName: "Khloud Ahmed Abdelkawy",
  //     },
  //     {
  //       studentCode: "30205011312891",
  //       fullName: "ahmed khaled ibrahim mostafa",
  //     },
  //     {
  //       studentCode: "30307131400465",
  //       fullName: "Hanem Atef Elsayed Abdelaziz",
  //     },
  //     {
  //       studentCode: "30306061600295",
  //       fullName: "Fathy mohamed Fathy Heeba",
  //     },
  //     {
  //       studentCode: "30203250106095",
  //       fullName: "Omar Mahmoud Ali Mahmoud",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Nefru",
  //   projectName: "Nefru",
  //   description:
  //     "Inspired by the ancient Egyptian word for beauty and perfection, this platform aims to showcase Egypt's true beauty. It provides a safe, organized, and authentic tourism experience by seamlessly connecting travelers with verified historical and cultural journeys.",
  //   teamMembers: [
  //     {
  //       studentCode: "30206161302173",
  //       fullName: "mohamed hany mohamed abdel hamid",
  //     },
  //     {
  //       studentCode: "29907238800158",
  //       fullName: "mohamed fathi gomaa mansour",
  //     },
  //     {
  //       studentCode: "29903272500915",
  //       fullName: "Mohamed Adel Abd-Elaal Hareidy",
  //     },
  //     {
  //       studentCode: "30110150200355",
  //       fullName: "Mazen Amir Mohamed",
  //     },
  //     {
  //       studentCode: "30007080201736",
  //       fullName: "Yousef Ismail Ahmed Ismail",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "S-WINDS",
  //   projectName: "S-WINDS",
  //   description:
  //     "Standing for Smart Weather-Integrated Navigation & Driving System, this enterprise-grade PWA serves as a crucial decision-support tool for fleet dispatchers. Unlike standard routing tools, it evaluates scheduled routes against an ETA-based weather forecasting engine to ensure safe multi-vehicle dispatching and risk mitigation.",
  //   teamMembers: [
  //     {
  //       studentCode: "29412301200159",
  //       fullName: "Elsayed Elsayed Elkhozamy Mohamed",
  //     },
  //     {
  //       studentCode: "29303270201735",
  //       fullName: "Tarek Mohammed Abdelraouf Shaer",
  //     },
  //     {
  //       studentCode: "30109261700235",
  //       fullName: "Omar Ibrahim Elsayed Elsefey",
  //     },
  //     {
  //       studentCode: "30006208801034",
  //       fullName: "Mohammed Khaled Mahmoud Faroouq Ahmed Rahmy",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "MessOps",
  //   projectName: "MessOps",
  //   description:
  //     "Combining 'Military Mess' and 'Operations' for a direct and professional brand, this integrated warehouse management system automates military restaurant logistics. It standardizes inventory, receiving, and spoilage tracking, alongside meal management, all secured by a strict permissions system and real-time analytics.",
  //   teamMembers: [
  //     {
  //       studentCode: "30012131401755",
  //       fullName: "Altarek Mohamed Alsaied Tawfiek",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Addadak",
  //   projectName: "Addadak",
  //   description:
  //     "Named 'Addadak' (Your Meter) to build a highly relatable brand across Egyptian households, this all-in-one utility management ecosystem enables both single and multi-facility users to monitor consumption, forecast usage, and process seamless payments",
  //   teamMembers: [
  //     {
  //       studentCode: "30308031300362",
  //       fullName: "Maiar Emam Mohamed Metwally",
  //     },
  //     {
  //       studentCode: "30209071200885",
  //       fullName: "Amira Hamada Mohamed Deef",
  //     },
  //     {
  //       studentCode: "30206052500402",
  //       fullName: "sarah abdelsamie ahmed abdelsamie",
  //     },
  //     {
  //       studentCode: "29905240201714",
  //       fullName: "Abdelrahman Mohamed Antar Mohamed",
  //     },
  //     {
  //       studentCode: "29901100200828",
  //       fullName: "Toka Mamdouh Moustafa",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Atmex",
  //   projectName: "Atmex",
  //   description:
  //     "Blending 'ATM' and 'Execution,' this real-time digital platform modernizes ATM maintenance. It replaces slow, manual workflows by centralizing fault reporting, seamlessly assigning engineers, and tracking the execution of maintenance tasks from start to finish.",
  //   teamMembers: [
  //     {
  //       studentCode: "30101012640507",
  //       fullName: "Esraa Alaa Abdulraheem",
  //     },
  //     {
  //       studentCode: "30105031701679",
  //       fullName: "Amr Muhammad Bayoumi",
  //     },
  //     {
  //       studentCode: "29904221400572",
  //       fullName: "Abdelrahman Tarek Abdelbary Ibrahim",
  //     },
  //     {
  //       studentCode: "30112102200699",
  //       fullName: "Eslam mohamed badawy abduallh",
  //     },
  //     {
  //       studentCode: "30207230105829",
  //       fullName: "Amira Ashraf Ibrahim Mohamed",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Safarni",
  //   projectName: "Safarni",
  //   description:
  //     "Meaning 'Make Me Travel,' this unified booking platform aims to eliminate market fragmentation and high customer drop-off rates. It seamlessly scales to centralize flights, hotels, tours, and car rentals into a single, cohesive travel experience.",
  //   teamMembers: [
  //     {
  //       studentCode: "29604141300735",
  //       fullName: "mohamed khairi mohamed bendari",
  //     },
  //     {
  //       studentCode: "29312250105216",
  //       fullName: "Ahmed Fouad Fawzy Essawy",
  //     },
  //     {
  //       studentCode: "30011041701052",
  //       fullName: "Yousef Asaad Gerges Eshaq",
  //     },
  //     {
  //       studentCode: "29809061400241",
  //       fullName: "Wesam Osama Ali Slama",
  //     },
  //     {
  //       studentCode: "29808041700552",
  //       fullName: "ahmed elsayed moselhy qutb",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "System Atlas",
  //   projectName: "System Atlas",
  //   description:
  //     "Just as a traditional atlas maps the physical world, System Atlas maps complex software architectures. It centralizes scattered documentation (from Markdowns, GitHub, and Jira) into interactive graphs, enabling rapid employee onboarding, seamless navigation, and precise impact analysis for any architectural changes.",
  //   teamMembers: [
  //     {
  //       studentCode: "30101010225758",
  //       fullName: "Muhammad Ahmed Abd Al-Salam Rashwan",
  //     },
  //     {
  //       studentCode: "30102201901083",
  //       fullName: "Eman saad mohamed ali",
  //     },
  //     {
  //       studentCode: "30312012103502",
  //       fullName: "shahd khairy abdallah",
  //     },
  //     {
  //       studentCode: "30103252501728",
  //       fullName: "Hager Mohamed Farghly Ahmed",
  //     },
  //     {
  //       studentCode: "29403318800436",
  //       fullName: "Mohamed omer ALI alminyawi",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Kemet Gate",
  //   projectName: "Kemet Gate",
  //   description:
  //     "Combining Egypt's ancient name 'Kemet' with a digital 'Gate,' this tourism platform serves as an interactive gateway to the country's heritage. It promotes both domestic and international tourism through 360° virtual tours, historical audio storytelling, and integrated booking for verified tourism companies.",
  //   teamMembers: [
  //     {
  //       studentCode: "30306121601725",
  //       fullName: "Shahd Yasser Mohammed Elkelany",
  //     },
  //     {
  //       studentCode: "30010012422679",
  //       fullName: "Ebram Samuel Helmy Mekhail",
  //     },
  //     {
  //       studentCode: "30204201302551",
  //       fullName: "mohamed elshahat ibrahim mohamed",
  //     },
  //     {
  //       studentCode: "30205192700863",
  //       fullName: "Mariam Khaled Abd ElWhab",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "HealMind",
  //   projectName: "HealMind",
  //   description:
  //     "Focused on healing the mind and promoting psychological awareness, this mental health platform provides accessible support and community interaction through educational content and direct communication channels with mental health specialists to help users",
  //   teamMembers: [
  //     {
  //       studentCode: "30211270201682",
  //       fullName: "sama yasser gemeay mahmoud",
  //     },
  //     {
  //       studentCode: "30201212500607",
  //       fullName: "Farah Mostafa Nagaty Abdelwahab",
  //     },
  //     {
  //       studentCode: "30312288800622",
  //       fullName: "Mirna Shawky Shawky Dweeb",
  //     },
  //     {
  //       studentCode: "30009091801789",
  //       fullName: "Haidy Sobhy Eldenshaly",
  //     },
  //     {
  //       studentCode: "30402211400221",
  //       fullName: "Hager Sherif Ibrahim Ahmed",
  //     },
  //     {
  //       studentCode: "30009202601024",
  //       fullName: "Mai Khaled Mostafa Mohammed",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "Avicena",
  //   projectName: "Avicena",
  //   description:
  //     "Inspired by the renowned physician Avicenna, this cloud-based SaaS healthcare platform centralizes the medical journey. It seamlessly connects patients, doctors, laboratories, and radiology centers, offering streamlined appointment booking, video/chat consultations, and comprehensive medical record management through an intuitive admin dashboard.",
  //   teamMembers: [
  //     {
  //       studentCode: "29405251100674",
  //       fullName: "mohammed hassan hamed saeed",
  //     },
  //     {
  //       studentCode: "30110071400195",
  //       fullName: "Mohamed Ali Mohamed Ali",
  //     },
  //     {
  //       studentCode: "29908291400478",
  //       fullName: "Mahmoud Elsayed Moselhy Mohamed",
  //     },
  //     {
  //       studentCode: "30104302101609",
  //       fullName: "Shrouk Hossam Eldin Helmy Mohamed",
  //     },
  //     {
  //       studentCode: "29812291200978",
  //       fullName: "Zyad Mohammed Mohammed Abdelal",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "MediMind",
  //   projectName: "MediMind",
  //   description:
  //     'Acting as a digital "Medication Mind," this AI-powered management platform is designed to eliminate missed doses and improve treatment adherence. It utilizes AI to log medications via package photos and features visual reminders, precise dosage schedules, inventory tracking, and caregiver alerts to ensure patient safety and compliance.',
  //   teamMembers: [
  //     {
  //       studentCode: "30110291201215",
  //       fullName: "abdelrahman mahmoud elsaeed hassan",
  //     },
  //     {
  //       studentCode: "29808100104217",
  //       fullName: "Mostafa Salama Khalill Abd Al All",
  //     },
  //     {
  //       studentCode: "30105032600752",
  //       fullName: "Mostafa Maged Najdy Mehran",
  //     },
  //     {
  //       studentCode: "30101010123106",
  //       fullName: "Mariam Mohamed Ramadan Mohamed",
  //     },
  //     {
  //       studentCode: "30206022400055",
  //       fullName: "Rabea Shaban Ebrahim Mostafa",
  //     },
  //     {
  //       studentCode: "30104031700935",
  //       fullName: "Mohamed Jameel Fouad Elsayed",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "EduCommunity",
  //   projectName: "EduCommunity",
  //   description:
  //     "Living up to its name by fostering a collaborative learning environment, this full-stack educational web application organizes the Egyptian student's journey. It integrates structured study materials, rated educators, live/recorded sessions, and gamified challenges to ensure an engaging, equitable, and highly interactive educational community across all academic stages.",
  //   teamMembers: [
  //     {
  //       studentCode: "30104071602839",
  //       fullName: "Andrew Ehab Sobhy Labib",
  //     },
  //     {
  //       studentCode: "30005118800865",
  //       fullName: "Alaa Ahmed hassan",
  //     },
  //     {
  //       studentCode: "30003201200192",
  //       fullName: "Fared Mansour Ibrahim Mohamed",
  //     },
  //     {
  //       studentCode: "30106221201636",
  //       fullName: "Ahmed Adel El-Tantawy Atwa",
  //     },
  //     {
  //       studentCode: "30008262501332",
  //       fullName: "Mohamed Ahmed Zaghlol Abdo",
  //     },
  //     {
  //       studentCode: "30008031802771",
  //       fullName: "Mohamed Ibrahim Wesal Elsefey",
  //     },
  //   ],
  // },
  // {
  //   trackId: "fa13bbc4-c2f3-4ab2-8cb7-a9b26a2055e8",
  //   name: "DeviceCare",
  //   projectName: "DeviceCare",
  //   description:
  //     "An integrated platform for managing the lifecycle of medical devices, including tracking device data, preventive and corrective maintenance, calibration, and fault reporting. The system uses automation for maintenance scheduling, sending alerts, and tracking work orders. Additionally, it features an AI-based RAG Chatbot that provides engineers with smart access to technical documents and answers inquiries based on the devices' knowledge base. It also utilizes QR Codes for quick access to device data, maintenance history, and fault reporting.",
  //   teamMembers: [
  //     {
  //       studentCode: "29906271700529",
  //       fullName: "Sondos Mohammed Kamal Eldeen Shabaan",
  //     },
  //   ],
  // },
  // // AI - DS
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "ANKH",
    projectName:
      "ANKH(Multimodal AI Tourism Assistant Built Specifically For Egypt)",
    description:
      "ANKH is an AI-powered Egyptian Heritage Platform that makes exploring and understanding Egypt’s cultural heritage more interactive, accessible, and personalized. It combines Computer Vision, RAG, NLP, and Generative AI to identify archaeological artifacts and landmarks from images, retrieve reliable historical information, and generate personalized descriptions, stories, and audio narratives. The platform also includes hieroglyph recognition and translation, document intelligence for summarization and visual question answering, and a multilingual conversational AI assistant for source-grounded heritage Q&A. In addition, its geolocation-based recommendation engine suggests nearby historical sites based on distance and relevance. By bringing these capabilities together, ANKH transforms Egypt’s rich heritage into an intelligent digital experience for tourists, students, researchers, and heritage enthusiasts.",
    labId: "S-SF-03",
    teamMembers: [
      {
        studentCode: "30301021600762",
        fullName: "Hagar Mohamed Hamada Gamal ELden",
      },
      { studentCode: "30210131401867", fullName: "Rawda Khaled Mohamed" },
      {
        studentCode: "30208032701102",
        fullName: "sarah sayed abdelrehim mansour",
      },
      { studentCode: "30301211602907", fullName: "Farah Fawzy Awad Doso" },
      {
        studentCode: "30402221602361",
        fullName: "Habiba Alaa Abdulmwla Mawla",
      },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "Team 3",
    projectName: "AI Compass - AI News Aggregator",
    description:
      "AI Compass is an intelligent AI news aggregation and personalization platform that collects content from trusted AI-related sources.",
    labId: "S-SF-03",
    teamMembers: [
      { studentCode: "30102280201695", fullName: "Mohammed Eid Abdelmeguid" },
      { studentCode: "29907128800519", fullName: "Ahmed Hossam Rashad" },
      {
        studentCode: "30109031501411",
        fullName: "Abdelrahman Saeed Mohammed Elsheikh",
      },
      {
        studentCode: "29901011727537",
        fullName: "Muhammed Salama Elsharkawey",
      },
      {
        studentCode: "30101092402156",
        fullName: "Abdelrahman Hussein Mohamed Salama",
      },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "مُحَكِّم Muhakem",
    projectName: "Muhakem (Legal AI Assistant)",
    description:
      "AI-powered legal assistant designed to support Egyptian lawyers and legal professionals in legal research, contract preparation, and defense memo generation.",
    labId: "S-SF-03",
    teamMembers: [
      { studentCode: "30210298800089", fullName: "Heba Reda Mohamed Omran" },
      {
        studentCode: "30104091500404",
        fullName: "Manal gamil hassan alaaeldin",
      },
      {
        studentCode: "30112111200421",
        fullName: "Mariam Magdy Abdo Mohamed Elatbany",
      },
      {
        studentCode: "30103200103147",
        fullName: "Nehal Hammam Hassan Abdelhamed",
      },
      {
        studentCode: "29503071400906",
        fullName: "Omnia Mahfouz Abdellatif Mostafa",
      },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "DermSkin AI",
    projectName: "DermSkin AI",
    description:
      "Intelligent chatbot-based web application designed to provide users with accessible and continuous skin care support.",
    labId: "S-SF-03",
    teamMembers: [
      { studentCode: "30209011609261", fullName: "Salma Magdy Abdelshafy Eid" },
      {
        studentCode: "30101161400446",
        fullName: "Asmaa Reda Mohamed Elquasry",
      },
      {
        studentCode: "30208060102125",
        fullName: "Maya Ahmed Abdelsattar Ahmed",
      },
      {
        studentCode: "30105012101407",
        fullName: "Asmaa Mahmoud Mohammed skran",
      },
      { studentCode: "30304011212607", fullName: "Shadya Elsayed Mosaad" },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "DAAS Team",
    projectName: "DAAS (Data Analysis Automation System)",
    description:
      "AI-powered, multi-agent business intelligence platform that lets a non-technical owner of a small or medium business go from raw data to decisions.",
    labId: "S-SF-03",
    teamMembers: [
      {
        studentCode: "3030302181500051",
        fullName: "Ahmed AbuAlftouh Metawea Metawea",
      },
      {
        studentCode: "30303161700654",
        fullName: "Amr Mohamed Ahmed Khalafalla",
      },
      {
        studentCode: "30101010220098",
        fullName: "Mohamed Emad El Din Soliman El Fakharany",
      },
      {
        studentCode: "30101012132714",
        fullName: "Ahmed Farahat Ahmed Farahat",
      },
      { studentCode: "30109181402519", fullName: "Mohamed Salah Eldin Eraqy" },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "Fighters",
    projectName: "Decivio: ERP Sales Insights and Intelligent system",
    description:
      "AI-powered platform designed to transform ERP sales data into actionable business insights using interactive dashboards and multi-agent assistants.",
    labId: "S-SF-04",
    teamMembers: [
      {
        studentCode: "30109131402313",
        fullName: "Mohamed Hamdy Abdelazez Mohamed",
      },
      { studentCode: "30104080200654", fullName: "Ahned Eid Hassen Aly" },
      { studentCode: "29912020200616", fullName: "Ahmed Aly Ahmed Aly" },
      {
        studentCode: "30009301411652",
        fullName: "Mohamed Ahmed Hassen El-feky",
      },
      {
        studentCode: "29901281200557",
        fullName: "Youssef Ahmed Mohamed Ahmed",
      },
      {
        studentCode: "30011010205014",
        fullName: "Mohamed Abdelghany Mohamed Abdelghany",
      },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "Game Changers",
    projectName: "SiaCore",
    description:
      "AI-powered decision intelligence system continuously monitoring internal supply chain data and external sources to analyze disruption signals.",
    labId: "S-SF-03",
    teamMembers: [
      { studentCode: "30201131602162", fullName: "Saja Rafat Gaber Mahmoud" },
      {
        studentCode: "30401012311442",
        fullName: "Nourhan Mohsen Mohamed Abdulrahman",
      },
      { studentCode: "30109161200847", fullName: "Nada Ayman Elsayed Shady" },
      {
        studentCode: "30201011211003",
        fullName: "Marwa Ashraf Mohammed Elsayed",
      },
      { studentCode: "30305111800847", fullName: "Dina Ali Ali Alharidy" },
      { studentCode: "30203221700727", fullName: "Nada Emad Mahmoud Hassan" },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "khulasa tech",
    projectName: "arabic meeting summarizer (khulasa tech)",
    description:
      "End-to-end intelligent platform designed to transform unstructured Arabic meeting recordings into structured, actionable intelligence.",
    labId: "S-SF-04",
    teamMembers: [
      { studentCode: "29711038800909", fullName: "سميه محمود سعيد مصطفى" },
      { studentCode: "29801212600441", fullName: "رحمه محمود حسن محمد" },
      { studentCode: "30202281801186", fullName: "تقى طارق محمود القاضي" },
      { studentCode: "30006262502026", fullName: "دانا علاء الدين فاروق ثابت" },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "Grinely",
    projectName: "Dental Assistant",
    description:
      "AI-powered dental platform organized into six specialty modules built around independently developed clinical AI models.",
    labId: "S-SF-04",
    teamMembers: [
      { studentCode: "30001222101248", fullName: "Mayar Mostafa" },
      { studentCode: "30310012630461", fullName: "Shahd Omar" },
      { studentCode: "30211162600465", fullName: "Nour Aleman Khaled" },
      { studentCode: "30308011321827", fullName: "Aya Ibrahim" },
      { studentCode: "30304011706766", fullName: "Aya Saleh" },
      { studentCode: "30104052501282", fullName: "Alaa Hesham" },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "Adzy",
    projectName: "Autonomous AI Marketing Intelligence",
    description:
      "Agentic AI marketing platform that autonomously transforms a business website into an evidence-grounded marketing workflow.",
    labId: "S-SF-04",
    teamMembers: [
      { studentCode: "30209011406085", fullName: "asmaa samy hagag" },
      {
        studentCode: "30306160201661",
        fullName: "shahd abdelfattah abdelaziz sawla",
      },
      { studentCode: "30310011532245", fullName: "rawda mohamed kamel" },
      { studentCode: "30308308800147", fullName: "arwa mohamed abouattia" },
      { studentCode: "30001251603082", fullName: "merna baher badry" },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "Fashion AI",
    projectName: "Fashion AI recommendation system",
    description:
      "AI-powered fashion recommendation and virtual try-on platform that integrates RAG, multimodal similarity search, computer vision, and sentiment analysis.",
    labId: "S-SF-03",
    teamMembers: [
      { studentCode: "30106171202466", fullName: "Hager Tarek Ahmed Radwan" },
      { studentCode: "30005142100505", fullName: "Aya Ibrahim Ramadan" },
      { studentCode: "30101012151522", fullName: "Heba ibrahim sayed" },
      { studentCode: "29702191400601", fullName: "Hend Ali Mohamed" },
      { studentCode: "30205011500647", fullName: "Afnan Fathy Ahmed" },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "Marketly.AI",
    projectName: "Ai marketing companion (Marketly.AI)",
    description:
      "AI-powered marketing platform that helps users do market research, plan a marketing strategy, and generate social media content.",
    labId: "S-SF-04",
    teamMembers: [
      {
        studentCode: "30105240102359",
        fullName: "Nour eldeen Hossam Tawfik Mohamed",
      },
      { studentCode: "30103131500732", fullName: "Ahmed Sedeq Qasim" },
      { studentCode: "30007192104091", fullName: "Fady Atef Kamal" },
      { studentCode: "29807012203853", fullName: "Abdelrhman Mahmoud Fawzy" },
      {
        studentCode: "30211102102695",
        fullName: "Mohamed Hesham Mahmoud Ragheb",
      },
      { studentCode: "30110052500251", fullName: "Michael Ibrahim Fahim" },
    ],
  },
  {
    trackId: "07a0838a-663b-4471-b359-5c474373810a",
    name: "Smart Surveillance",
    projectName: "smart surveillance system",
    description:
      "AI-powered security solution that uses Computer Vision to monitor CCTV cameras in real time and detect suspicious activities.",
    labId: "S-SF-04",
    teamMembers: [
      { studentCode: "30008140202695", fullName: "Adham Nasr Mohamed" },
      { studentCode: "29804281400496", fullName: "Mohamed Atef El Sayed" },
      { studentCode: "30210010124939", fullName: "abdalrahman ehab mohamed" },
      { studentCode: "29901012725759", fullName: "Gamal Adel Hamdto" },
    ],
  },
  // // AI & DA
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-Based Stock Market Direction Prediction for Egyptian Stocks",
    projectName:
      "AI-Based Stock Market Direction Prediction for Egyptian Stocks",
    description:
      "An AI-based forecasting system tailored to the Egyptian Exchange (EGX), focusing on forecasting the one-day-ahead log return of the EGX 30 index using historical prices, technical indicators, and macroeconomic variables.",
    labId: "S-FF-06",
    teamMembers: [
      { studentCode: "30205192100947", fullName: "Alaa Khaled Ramadan Awad" },
      { studentCode: "29705011602501", fullName: "Aya Abd Elkader Ewais" },
      { studentCode: "30109221802582", fullName: "Alaa Esawy Mohamed Esawy" },
      { studentCode: "30110301600245", fullName: "Amira Salama Abdullah" },
      { studentCode: "30003110100489", fullName: "Noha Sayed Mohamed" },
      { studentCode: "29512012507445", fullName: "Eman Taha" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Solar Guardian AI",
    projectName: "Solar Guardian AI",
    description:
      "An enterprise-grade SaaS decision support and predictive maintenance platform designed to maximize solar plant availability, forecast AC power output, detect anomalies, and optimize operational revenue.",
    labId: "S-FF-06",
    teamMembers: [
      { studentCode: "29310202400548", fullName: "Asmaa Salah Soliman" },
      { studentCode: "29510081600543", fullName: "Asmaa Mohamed Helmy" },
      { studentCode: "30101222101587", fullName: "Aya Abdelnaem" },
      { studentCode: "29906231601269", fullName: "Eman Ahmed El-Gebairy" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Dynacell-AI",
    projectName:
      "Dynacell-AI: A Multi-Omic Virtual Cell for Predictive Pathological Simulation using Neural Stochastic Differential Equation",
    description:
      "A multi-omic virtual cell for predictive pathological simulation using Neural Stochastic Differential Equations aimed at disease detection by DNA sequence sampling.",
    labId: "S-FF-06",
    teamMembers: [
      { studentCode: "30011061700923", fullName: "Eman Yaser" },
      {
        studentCode: "30105248800748",
        fullName: "Alaa ahmed Abdel Basset Elgendy",
      },
      {
        studentCode: "30108011804128",
        fullName: "Mai Mohamed Ibrahim Beltagy",
      },
      {
        studentCode: "30102011316184",
        fullName: "Ibthal Ahmed Hussainy Mohammed",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "CropMind (DeepAgriScan)",
    projectName:
      "DeepAgriScan: AI-Powered Virtual Drone System for Plant Disease Diagnosis",
    description:
      "An AI-powered operating system for modern farms unifying field data, business intelligence, and market access using autonomous AI agents, computer vision, and the Farm DNA Score metric.",
    labId: "S-FF-06",
    teamMembers: [
      { studentCode: "30110092401272", fullName: "Elia Fahmy Thabet barsom" },
      { studentCode: "30104021600991", fullName: "Goda Emad Goda" },
      { studentCode: "29809012717779", fullName: "El-Waffa Mohamed" },
      { studentCode: "30102051702656", fullName: "Ebrahim Abdl-Toab" },
      { studentCode: "30103212201217", fullName: "Ahmed Salama" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Arabic Sign Language Translator",
    projectName: "Arabic Sign Language Translator",
    description:
      "A real-time, CPU-only desktop application employing a dual-pipeline architecture (YOLOv8 + EfficientNetB0 and MediaPipe + MLP/ONNX) to translate MSA alphabet letters and Yemeni sign language words.",
    labId: "S-SF-07",
    teamMembers: [
      { studentCode: "30103201400676", fullName: "Mostafa Abdallah Shawki" },
      { studentCode: "30103011702218", fullName: "Mostafa Shafia Ahmed" },
      { studentCode: "29404161802991", fullName: "Mostafa Hassan Aboub" },
      { studentCode: "29702112102594", fullName: "Ahmed Alaa abo el Fadel" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Arabic Fake News Detection",
    projectName: "AI-Based Fake News Detection and Classification System",
    description:
      "An automated credibility assessment system using deep learning and fine-tuned transformer models (AraBERT, CAMeL-BERT, mBERT) to classify Arabic news articles into credibility tiers.",
    labId: "S-FF-03",
    teamMembers: [
      {
        studentCode: "30201112100539",
        fullName: "Abdullah Ehab Abdullah El-Sayed",
      },
      {
        studentCode: "29910162500479",
        fullName: "Omar Ahmed Omar Abdel Fattah",
      },
      { studentCode: "29803151603879", fullName: "Mohamed Ezzat Mohamed" },
      {
        studentCode: "29501011516198",
        fullName: "Mohamed Elsayed Ibrahim Dashisha",
      },
      { studentCode: "29408293300079", fullName: "Muhammad Al-Sayyid Abbas" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Driver Safety & Fatigue Monitoring",
    projectName: "AI-Based Driver Safety and Assistance System",
    description:
      "A practical driver safety and fatigue monitoring system built on object-detection models (YOLO, RF-DETR) and temporal sequence modeling using frame-annotated yawning behavior.",
    labId: "S-FF-03",
    teamMembers: [
      { studentCode: "30008121602216", fullName: "Ali Ibrahim Ahmed Othman" },
      { studentCode: "29505151601018", fullName: "Karim Mustafa Ali Ibrahim" },
      { studentCode: "29707160100872", fullName: "Michael Magdy Amin Sidhom" },
      { studentCode: "29803031202137", fullName: "Mohamed Mostafa Mohamed" },
      {
        studentCode: "30105062100835",
        fullName: "Mohamed Osama Bahnasy Abdel Halim",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "LeafFusionNet",
    projectName: "AI-Based Plant Disease Classification and Detection System",
    description:
      "A computer vision solution for automated plant disease classification evaluating MobileNetV2, Vision Transformers, and a custom dual-branch CNN architecture named LeafFusionNet.",
    labId: "S-FF-03",
    teamMembers: [
      { studentCode: "30002201501552", fullName: "Mohammed Hilal Ibrahim" },
      {
        studentCode: "29909192704674",
        fullName: "Abdullah Mohammed Siddiq Hamed",
      },
      {
        studentCode: "30310270201656",
        fullName: "Saleh Ahmed Yousef Abdullah",
      },
      { studentCode: "30001070100577", fullName: "Mohamed Tharwat Galal Ali" },
      { studentCode: "30006120100834", fullName: "Mohamed Sayed Okasha Sayed" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "NileGuard",
    projectName:
      "NileGuard: AI Based system for Spatio-temporal drought forecasting in Egypt",
    description:
      "A spatio-temporal early recommendation system for drought forecasting and climate shift analysis in Upper Egypt, offering agricultural ROI advisory and cross-industry planning capabilities.",
    labId: "S-FF-03",
    teamMembers: [
      {
        studentCode: "30104220101503",
        fullName: "Mariam Muhammad Abdul Latif",
      },
      {
        studentCode: "29811241700868",
        fullName: "Ghada Sobhi Abdel Qawi Farjani",
      },
      { studentCode: "30011151601347", fullName: "Verina Fouad Farid Khalil" },
      { studentCode: "30011182702664", fullName: "Maret Refat Jabra Hanna" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "THABAT",
    projectName: "Multi-Modal Early Detection of Parkinson's Disease",
    description:
      "An AI-powered Clinical Decision Support System that analyzes voice recordings, spiral drawings, and DaTSCAN medical images to estimate multi-modal Parkinson's disease risk levels.",
    labId: "S-FF-03",
    teamMembers: [
      {
        studentCode: "29901011203007",
        fullName: "Ru'a Mustafa Omar Musa Abdul Karim",
      },
      { studentCode: "30301012653764", fullName: "Ru'a Khalid Kamel Ahmed" },
      { studentCode: "30401121601868", fullName: "Mai Hamdi Nasr Allam" },
      { studentCode: "30211092602244", fullName: "Alaa Mohamed Ahmed Youssef" },
      {
        studentCode: "30306041700846",
        fullName: "Toka Reda Mohamed Abdel Razek Bishr",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Entibah",
    projectName: "AI-Based Classroom Attention Monitoring System",
    description:
      "A smart classroom attention monitoring system using computer vision and deep learning to analyze student behaviors and classify attention levels in real time.",
    labId: "S-FF-03",
    teamMembers: [
      {
        studentCode: "30202051702162",
        fullName: "Haya Magdy Abdel Salam El Desouky",
      },
      { studentCode: "30307072603144", fullName: "Amani Atef Ahmed Mahmoud" },
      { studentCode: "30304061302208", fullName: "Iman Anwar Mohammed Saeed" },
      {
        studentCode: "30110011605588",
        fullName: "Ghenna Bahy Muhammad Al-Najjar",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-Driven Waste-to-Energy Optimization and Circular Economy Trading Platform",
    projectName:
      "AI-Driven Waste-to-Energy Optimization and Circular Economy Trading Platform",
    description:
      "An AI-driven system targeting waste management challenges in Egypt, focusing on informal recycling sector integration, supply chain optimization, and waste-to-energy circular economy trading.",
    labId: "S-FF-03",
    teamMembers: [
      {
        studentCode: "30201042300462",
        fullName: "Rahma Muhammad Ali Muhammad",
      },
      { studentCode: "29309012406223", fullName: "Ohoud Taha Ahmed Hussein" },
      {
        studentCode: "30309252503825",
        fullName: "Alaa Mohamed Abdel Azim Mohamed",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-Based System for Real Estate Price Prediction",
    projectName: "AI-Based System for Real Estate Price Prediction",
    description:
      "The Egyptian real estate sector is undergoing a structural transformation driven by rapid urbanization, massive infrastructure programmers such as the New Administrative Capital, and the progressive digitization of property listings. Despite this dynamism, prevailing valuation practices remain heavily reliant on subjective broker assessments and manual comparative analysis, generating significant information asymmetry across market participants. This study, constituting Chapter One of a master’s thesis in Artificial Intelligence and Data Analysis, establishes the conceptual, contextual, and technical foundation for a machine learning-based automated valuation model (AVM) tailored to the Egyptian residential property market. Drawing on property listing data consolidated from multiple Kaggle datasets and scrapped data, the research frames a predictive framework centered on two state-of-the-art algorithms—Extreme Gradient Boosting (XGBoost) and Artificial Neural Networks (ANN)—benchmarked against each other using standard regression performance metrics, namely Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and the coefficient of determination (R²). The chapter situates the study within the broader Prop Tech literature, identifies critical gaps specific to emerging market contexts, and articulates the scientific and societal significance of transitioning from heuristic to evidence-based property valuation in Egypt.",
    labId: "S-FF-04",
    teamMembers: [
      {
        studentCode: "29401012116393",
        fullName: "Mahmoud Ahmed Mahmoud Ibrahim",
      },
      { studentCode: "29909190200539", fullName: "Abdulrahman Ibrahim Othman" },
      {
        studentCode: "29901012120237",
        fullName: "Abdulrahman Ahmed Jad Ahmed",
      },
      {
        studentCode: "30011252104638",
        fullName: "Abdulrahman Khalid Abdulmonem",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-Based Real-Time Sign Language Translation System",
    projectName: "AI-Based Real-Time Sign Language Translation System",
    description:
      "An AI-powered system that recognizes sign language in real time through a camera and translates it into readable text, helping improve communication between deaf and hearing people.",
    labId: "S-FF-04",
    teamMembers: [
      {
        studentCode: "30208011502037",
        fullName: "Ahmed Abdel Aziz Attallah Badawi",
      },
      {
        studentCode: "30104062300331",
        fullName: "Bashar Sayed Mohamed Abdel-Razek",
      },
      {
        studentCode: "30207230104415",
        fullName: "Abdulrahman Ehab Sobhi Abdo",
      },
      {
        studentCode: "30103211605152",
        fullName: "Abdulrahman Adel Ashour Mohammed",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-Based Skin Analysis and Disease Prediction System",
    projectName: "AI-Based Skin Analysis and Disease Prediction System",
    description:
      "Skin cancer is among the most prevalent cancers worldwide, and timely and accurate identification of suspicious skin lesions is essential for improving patient outcomes. Despite the diagnostic value of dermoscopic imaging, automated skin lesion classification remains challenging due to the visual similarity between lesion categories, substantial class imbalance, variations in image acquisition, and the clinical significance of false-negative predictions. These challenges highlight the need for reliable deep learning methods for computer-aided skin lesion analysis. This project develops a deep learning framework for automated classification of dermoscopic skin lesions using the HAM10000 dataset, comprising 10,015 images across seven diagnostic categories. To provide a reliable evaluation and reduce the risk of data leakage, the dataset is partitioned at the lesion level, ensuring that images from the same lesion are not distributed across different data subsets. The study investigates two complementary approaches. The first is a comparative framework covering different representation-learning paradigms: a ResNet-based model trained from scratch, EfficientNet-B3 fine-tuned using transfer learning, and DINOv2 visual representations. Their complementary predictive characteristics are further investigated through ensemble learning. The second approach introduces a hierarchical three-stage cascade as an alternative to conventional flat seven-class classification. The first stage performs benign-versus-malignant triage, followed by dedicated specialist classifiers for benign and malignant subtypes. This cascade uses a custom ResNet-style architecture with Squeeze-and-Excitation attention blocks, trained from scratch with imbalance-aware optimization and advanced augmentation. Since errors at the first stage propagate to subsequent stages, its decision threshold is optimized under a minimum malignant-recall constraint to reduce the risk of missed malignant cases. Stage-1 misrouting is also analyzed separately to distinguish triage errors from downstream classification errors. The models and classification pipelines are evaluated using accuracy, balanced accuracy, precision, recall, F1-score, macro F1-score, ROC-AUC, confusion matrices, and per-class error analysis, with particular attention to malignant recall, minority-class performance, and false-negative errors. Test-time augmentation is used where applicable to improve prediction stability. In addition, Grad-CAM is employed to visualize the image regions contributing to model predictions and to examine whether model attention is directed toward relevant lesion regions rather than potential imaging artifacts. The resulting framework is integrated into a user-facing computer-aided skin lesion analysis application that presents classification predictions, confidence information, and visual explanations. Overall, the project provides a systematic evaluation of from-scratch learning, transfer learning, foundation-model representations, ensemble learning, and hierarchical classification within dermoscopic image analysis. The system is designed as a decision-support tool rather than a replacement for professional dermatological diagnosis, while demonstrating the importance of lesion-level evaluation, imbalance-aware training, clinically informed threshold selection, rigorous error analysis, and explainability in medical imaging applications.",
    labId: "S-FF-04",
    teamMembers: [
      {
        studentCode: "29603102801381",
        fullName: "Sara Abdelshafy Abdellatif Abdelsalam",
      },
      {
        studentCode: "30008121302344",
        fullName: "Mariz Malak Abdel Latif Khalifa",
      },
      {
        studentCode: "30109038800783",
        fullName: "Shahd Najeh Ibrahim Mustafa",
      },
      {
        studentCode: "30106091701968",
        fullName: "Shaimaa Ibrahim Abdo Al-Khatib",
      },
      {
        studentCode: "29907062301443",
        fullName: "Shaimaa Mohamed Kamal Abbas",
      },
      {
        studentCode: "29712098800742",
        fullName: "Aisha Mohamed Gaber El-Saadani",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-Based Brain CT Scan Classification System",
    projectName: "AI-Based Brain CT Scan Classification System",
    description:
      "This project presents an AI-based system for automated brain CT scan analysis to support stroke diagnosis. The system uses a multi-stage deep learning pipeline that first classifies CT scans into Normal, Ischemic Stroke, or Hemorrhagic Stroke. It then performs lesion segmentation to identify and localize affected brain regions. For hemorrhagic cases, the system further classifies the hemorrhage into five subtypes: Epidural, Subdural, Subarachnoid, Intraventricular, and Intraparenchymal hemorrhage. The project utilizes the TEKNO21 and RSNA Intracranial Hemorrhage datasets, with dedicated preprocessing pipelines and multiple deep learning models evaluated and compared for each task. The complete system integrates classification, lesion segmentation, and hemorrhage subtype classification into a modular AI-assisted framework for comprehensive brain CT analysis.",
    labId: "S-FF-04",
    teamMembers: [
      {
        studentCode: "30106170101968",
        fullName: "Haidy Mohsen Abdel Hamid Osman",
      },
      {
        studentCode: "30006010105547",
        fullName: "Mayar Mahmoud Abdullah Mohammed",
      },
      { studentCode: "29812210100702", fullName: "Sara Mamdouh Hassan Hasibo" },
      { studentCode: "30109290110803", fullName: "Salma Mohamed Ahmed Ali" },
      {
        studentCode: "29807012402562",
        fullName: "Ayat Rajab Abdul Hamid Muhammad",
      },
      { studentCode: "29604290200123", fullName: "Samaa Reda Ali Mohammed" },
      { studentCode: "29803300101644", fullName: "Samaa Saeed Ismail Ibrahim" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-Based Diabetes Prediction and Classification System",
    projectName: "AI-Based Diabetes Prediction and Classification System",
    description:
      "Diabetes is a major global health concern, and early identification of individuals at risk can support timely intervention and improve health outcomes This project presents GlucoGuide, an AI-powered web-based system designed for preliminary diabetes risk assessment and clinical decision support. GlucoGuide combines a machine learning prediction model with an interactive website that collects demographic, clinical, lifestyle, and medical history data, including BMI, blood glucose, HbA1c, cholesterol, blood pressure, and insulin levels The system also integrates Optical Character Recognition (OCR) to extract relevant laboratory values from uploaded medical reports, reducing manual data entry and improving the efficiency of the assessment process. The collected data are processed and passed through a prediction API to the trained machine learning model, which generates an estimated diabetes risk assessment The results are then presented through a clear and user-friendly web interface to support risk awareness and interpretation. Overall, GlucoGuide demonstrates how Artificial Intelligence, Machine Learning, OCR, and web technologies can be integrated into a unified healthcare system to provide accessible and efficient preliminary diabetes risk assessment The system is intended to support, not replace, professional medical diagnosis and clinical judgment. Keywords: Diabetes Risk Assessment, Artificial Intelligence, Machine Learning, OCR, Clinical Decision Support, Healthcare, Web-Based System",
    labId: "S-FF-04",
    teamMembers: [
      {
        studentCode: "29503061101161",
        fullName: "Sally Elsayed Mostafa Elsherbini",
      },
      {
        studentCode: "30111291801006",
        fullName: "Samah Mohamed Moselhy Mohamed",
      },
      {
        studentCode: "30203090201428",
        fullName: "Samar Ahmed Mahmoud Abdelrahman",
      },
      {
        studentCode: "30109102600181",
        fullName: "Haidy Ashraf Abdel-Azim Mohamed",
      },
      {
        studentCode: "30209110104961",
        fullName: "Shahinaz Abdul-Awad Najeh Abdul-Rahim",
      },
      {
        studentCode: "29908230202681",
        fullName: "Safaa Sami Mohamed Abu Al-Saud",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-Driven Smart Inventory Analytics System for Predicting Product Expiry and Reducing Inventory Waste Risk",
    projectName:
      "AI-Driven Smart Inventory Analytics System for Predicting Product Expiry and Reducing Inventory Waste Risk",
    description:
      "Food waste at the retail stage of the supply chain remains a persistent economic, social, and environmental problem, particularly for perishable goods where static reorder rules fail to account for shelf life and demand variability. This project presents a Smart Inventory Analytics System that forecasts short-term product demand, estimates the probability that a given inventory batch will spoil before sale, and combines both into a prioritized risk score for inventory managers. The demand-forecasting and spoilage-classification components are built entirely on real, publicly documented data: daily point-of-sale records from Walmart's M5 forecasting-competition dataset provide genuine retail demand, while shelf-life values are drawn from the USDA FoodKeeper reference database. Batch-level inventory and spoilage outcomes are reconstructed deterministically from real sales using a periodic order-up-to replenishment policy and First-In-First-Out consumption, rather than generated synthetically. A demand-forecasting model and a spoilage-classification model are developed and benchmarked against multiple statistical and machine-learning baselines; a hybrid risk-scoring layer combines both outputs to rank inventory batches for manager attention, with impact evaluated against a First-In-First-Out/First-Expired-First-Out no-intervention baseline. By grounding every reported result in real, traceable data, the project delivers a transparent, reproducible framework for perishable-inventory decision support, with documented scope limitations and a defined path toward future regional (Egyptian) validation.",
    labId: "S-FF-07",
    teamMembers: [
      { studentCode: "30001011113924", fullName: "Hayam Medhat Ahmed Noshy" },
      {
        studentCode: "30112230102047",
        fullName: "Hoda Mohamed Ezzat Elhamahmy",
      },
      { studentCode: "30202201204689", fullName: "Nada Fahmy Fahmy Altohamy" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-Powered Plant Disease Detection and Crop Health Analysis System",
    projectName:
      "AI-Powered Plant Disease Detection and Crop Health Analysis System",
    description:
      "AgriVision AI is an integrated AI-powered Smart Agriculture ecosystem designed to support farmers throughout the agricultural lifecycle by combining Artificial Intelligence, Deep Learning, Computer Vision, satellite data, drone technology, weather information, and intelligent decision-support systems. The system enables plant health monitoring and disease detection through both mobile images and drone imagery. AI models analyze plant images to identify diseases, assess their severity, and provide appropriate treatment recommendations, while Explainable AI techniques such as Grad-CAM help visualize the regions influencing the model's predictions. Satellite-based monitoring provides large-scale field analysis by identifying stressed, damaged, or potentially water-stressed areas within a farm. These insights are combined with weather data and other agricultural information to generate intelligent recommendations, such as whether a specific area requires irrigation or fertilization. Drones can then be used for targeted inspection of identified areas in greater detail, creating a multi-level monitoring system that progresses from satellite-scale analysis to drone inspection and mobile-based plant diagnosis. AgriVision AI also incorporates intelligent irrigation and fertilization models, an agricultural AI chatbot, and a database that maintains the digital history and a unique digital agricultural profile for each field, including crop health, previous diseases, treatments, irrigation, fertilization, and monitoring records. An interactive user interface and dashboard visualize these insights and recommendations in a simple and accessible way for farmers. Beyond crop management, AgriVision AI includes an intelligent agricultural fire detection and early-response component that detects fires and activates an automated water-based gel suppression mechanism designed to reduce fire spread while minimizing potential harm to crops and humans. The ecosystem also provides a technology guide that introduces farmers to modern agricultural tools and explains their practical use. AgriVision AI extends beyond farming operations by supporting research and entrepreneurship, allowing students and researchers to explore and apply emerging agricultural technologies. It also promotes sustainability and social impact by enabling agricultural harvesting residues to be transformed into valuable products, creating potential employment and entrepreneurship opportunities for women. An integrated agricultural marketplace further connects the ecosystem with the economic side of agriculture by providing opportunities to sell agricultural products and useful agricultural by-products. Through this integration, AgriVision AI aims to create a complete agricultural ecosystem that can Sense, Analyze, Decide, Act, Learn, and Create Value—helping farmers improve crop health and productivity, optimize water and fertilizer use, respond to agricultural emergencies, reduce waste, support innovation, and build a more sustainable agricultural future.",
    labId: "S-FF-07",
    teamMembers: [
      {
        studentCode: "30112111301147",
        fullName: "Esraa Mohamed Atia Alsayed Ahmed",
      },
      {
        studentCode: "30108181703008",
        fullName: "Eman Mansour Abdel Halim Barrin",
      },
      { studentCode: "29608282800044", fullName: "Haya hassan Ahmed Abdallah" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Intelligent Library Analytics and Book Recommendation System",
    projectName: "Intelligent Library Analytics and Book Recommendation System",
    description:
      "The rapid growth of digital book collections has made it increasingly difficult for readers to efficiently discover relevant books and for libraries to analyze large-scale reading data. Traditional recommendation approaches often rely on either book characteristics or user interactions alone, which may not fully capture diverse user preferences. This project presents an integrated AI-driven platform for intelligent library analytics and personalized book recommendation using the Goodreads dataset, which contains large-scale book metadata, user ratings, and reviews. The data is cleaned, structured, and stored in a PostgreSQL database to support efficient analysis, retrieval, and integration across system components. The proposed system implements a Hybrid Book Recommendation System that combines Content-Based Filtering and Collaborative Filtering to provide more personalized recommendations. The Content-Based component uses book characteristics such as genres, authors, descriptions, and other relevant metadata to identify similar books. The Collaborative Filtering component analyzes user-book interactions and ratings to identify similar user preferences. Combining both approaches enables the system to consider both item similarity and user behavior when generating recommendations. A Sentiment Analysis module processes unstructured book reviews to identify sentiment polarity and extract insights from reader opinions beyond numerical ratings. This provides an additional layer of understanding of how readers perceive books. To support intelligent search and question answering, a Retrieval-Augmented Generation (RAG) module is integrated into the system. It retrieves relevant book information from the underlying knowledge base and generates context-aware responses to natural-language queries. The system follows an end-to-end architecture integrating data processing, database management, the hybrid recommendation system, sentiment analysis, RAG, backend APIs, and an interactive frontend. Power BI is also integrated to provide analytical dashboards covering book statistics, ratings, reviews, genres, user behavior, and other library-related trends. Overall, the proposed system combines Data Engineering, Machine Learning, Deep Learning, and Recommendation Systems, Natural Language Processing, Hybrid Recommendation Systems, Retrieval-Augmented Generation, Database Engineering, Backend Development, Frontend Development, and Business Intelligence within a unified platform. The system aims to improve personalized book discovery while providing intelligent search capabilities and data-driven insights for library and book-related applications.",
    labId: "S-FF-07",
    teamMembers: [
      { studentCode: "30209220104444", fullName: "Esraa Shawky Hosny Mahmoud" },
      { studentCode: "30202251600127", fullName: "Yasmeen Ayman Abdelghani" },
      { studentCode: "29608031801041", fullName: "Huda Mohamed Abdelaziz" },
      { studentCode: "30108162301004", fullName: "Walaa Emad Abbas Mohammed" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "NILEX.AI",
    projectName:
      "NILEX.AI: AI-Powered Smart Green Ecosystem for Egyptian Agricultural Exports",
    description:
      "Establishing an integrated ecosystem for Egyptian agricultural exports, starting from diagnosing field diseases to inspecting and reviewing fruits before export, as well as an integrated trading system that brings together exporters and importers, in addition to Financial, technical, and logistical services",
    labId: "S-FF-07",
    teamMembers: [
      { studentCode: "30107082600179", fullName: "Ahmed Abd Al-Hafez Mohamed" },
      { studentCode: "29809151807596", fullName: "Ahmed Khaled Gamal Hossam" },
      { studentCode: "30107161600532", fullName: "Ibrahim Ahmed Atya Karm" },
      { studentCode: "30110011715871", fullName: "Ahmed Gamal Sobhy Arrafa" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Early Detection of Poultry Diseases Using Artificial Intelligence and Computer Vision",
    projectName:
      "Early Detection of Poultry Diseases Using Artificial Intelligence and Computer Vision",
    description:
      "- from A-Z poultry Care\n- Early Detection for Disease \n- Full Production Analysis",
    labId: "S-FF-07",
    teamMembers: [
      { studentCode: "30209020202034", fullName: "Ahmed Mostafa Abd Alsalem" },
      { studentCode: "30001012733055", fullName: "Ahmed Mahmoud Khalifa Ali" },
      { studentCode: "29807231202455", fullName: "Ibrahim Ahmed Ibrahim Amer" },
      {
        studentCode: "30204011601471",
        fullName: "Ibrahim Mostafa Ibrahim Mohamed",
      },
      {
        studentCode: "29603201400495",
        fullName: "Ibrahim Atta Abdelmonem Refai",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "DELIVERY DELAY PREDICTION SYSTEM",
    projectName: "DELIVERY DELAY PREDICTION SYSTEM",
    description:
      "This project aims to develop an advanced machine learning framework for predicting delivery delays in global and e-commerce supply chains. By leveraging historical logistical data, the proposed models forecast the probability and exact duration of shipment delays. Furthermore, the project introduces a Promise Compression at Matched Service Level (PCMS) approach to dynamically optimize promised delivery dates. The ultimate goal is to provide decision-makers with a proactive risk management tool that mitigates operational bottlenecks, reduces unnecessary buffer times, and enhances overall customer satisfaction.",
    labId: "S-FF-07",
    teamMembers: [
      { studentCode: "30001291900292", fullName: "Eslam TagElsir Ali Mohamed" },
      { studentCode: "29705201203719", fullName: "Ahmed Shehta Zoghli Osman" },
      {
        studentCode: "29606031100431",
        fullName: "Osama Mohamed Kamel Elbasiouny",
      },
      {
        studentCode: "29604150103632",
        fullName: "Mohamed Hassan Ahmed Mohamed",
      },
      {
        studentCode: "29710011809657",
        fullName: "Ahmed Ibrahim Zain El-Abedeen",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-Powered Marketplace Intelligence Platform for Emerging Markets",
    projectName:
      "AI-Powered Marketplace Intelligence Platform for Emerging Markets",
    description:
      "E-commerce businesses generate large amounts of data across customers, products, transactions, marketing, reviews, and purchasing behavior. MarketPulse is an enterprise analytics and intelligence platform designed to transform this data into clear insights and smarter business decisions. The project represents a modern e-commerce organization through four independent business domains: Olist Marketplace, Olist Marketing Funnel, Amazon Reviews, and Instacart. Each domain addresses a different business perspective, including Marketplace Operations & Executive Intelligence, Marketing & Customer Acquisition, Customer & Product Intelligence, and Customer & Merchandising Analytics. MarketPulse combines Data Analytics, Business Intelligence, Machine Learning, Enterprise Data Warehousing, KPI Engineering, Semantic Modeling, and Interactive Visualization to solve practical business problems within each domain. The domains remain analytically independent while collectively demonstrating how different business functions can use data to improve performance, understand customers, identify opportunities, and manage risks. The Olist Marketplace domain serves as the primary enterprise BI implementation, covering the journey from data exploration and predictive analytics through enterprise data warehousing, KPI engineering, semantic modeling, and interactive dashboards. The other domains provide complementary perspectives on marketing performance, customer feedback, product intelligence, and purchasing behavior. The project follows a simple principle: turn data into insight, and insight into action. MarketPulse demonstrates an end-to-end approach to modern enterprise analytics, showing how data and AI can support real business decisions and create measurable value across an e-commerce organization.",
    labId: "S-FF-07",
    teamMembers: [
      {
        studentCode: "29501142103255",
        fullName: "Maged Awadalla Yacoub Awadalla",
      },
      { studentCode: "29905101602739", fullName: "Ahmed khaled tolba elfky" },
      { studentCode: "30208111401874", fullName: "Islam Ramadan Abdeldayem" },
      {
        studentCode: "29709281501311",
        fullName: "Mostafa El-Sayed Abdel Aziz",
      },
      { studentCode: "30107012703272", fullName: "Saeed Saad Abdo Saeed" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "EgyTeraVolt AI",
    projectName:
      "EgyTeraVolt AI: Smart Energy Consumption Forecasting & Optimization System",
    description:
      "EgyTera Volt AI is an AI-powered smart energy consumption forecasting system designed to predict future electricity demand and support more efficient energy management. The project addresses the challenges of increasing energy consumption, demand fluctuations, and the need for accurate forecasting to improve decision-making and resource planning. The proposed system utilizes historical energy consumption data along with relevant temporal and environmental factors to identify consumption patterns and generate reliable forecasts. Multiple machine learning and deep learning techniques are considered and evaluated to determine the most suitable model for accurate energy prediction. The system integrates data preprocessing, predictive modeling, and visualization into a unified platform that enables users to monitor historical consumption, analyze trends, and compare actual energy usage with predicted values. Through an interactive dashboard and intelligent forecasting capabilities, EgyTera Volt AI aims to transform raw energy data into actionable insights, helping users better understand consumption behavior, anticipate future demand, and improve energy efficiency. The project demonstrates how artificial intelligence and data analytics can contribute to smarter and more sustainable energy management.",
    labId: "S-FF-06",
    teamMembers: [
      { studentCode: "30106251702443", fullName: "Toka Mohammed Elshablangy" },
      {
        studentCode: "30008212103468",
        fullName: "Manar Harby Abd Elmoneam Ali",
      },
      {
        studentCode: "30401020101368",
        fullName: "Gannatallah Emad Abdelkader",
      },
      { studentCode: "29404051301903", fullName: "Aya Shaaban Gameel" },
      { studentCode: "30012141400269", fullName: "Aya Samir Abd El Salam" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Intelligent Analytical Framework for ADHD Pattern Investigation Using AI and Data Analysis",
    projectName:
      "Intelligent Analytical Framework for ADHD Pattern Investigation Using AI and Data Analysis",
    description:
      "An intelligent, multimodal ADHD clinical-support ecosystem designed to bridge the gap between AI-driven assessment and real-world patient care. The platform combines neuroimaging and clinical-data intelligence to identify meaningful patterns associated with ADHD, alongside a real-time behavioral intelligence layer that captures engagement and affective signals through facial landmarks. Rather than relying on a single diagnostic signal, the system creates a longitudinal view of the patient, connecting clinical insights with behavioral patterns, daily progress, and contextual observations from home and clinical environments. Through dedicated Clinical, Parent, and Patient portals, complex AI outputs are transformed into clear, explainable insights, automated reports, personalized interventions, progress tracking, and continuous communication. The result is a secure, human-centered clinical decision-support ecosystem that empowers healthcare professionals with richer evidence, helps families understand progress, and delivers more personalized support for children and adolescents with ADHD—while keeping final clinical decisions firmly in the hands of qualified professionals.",
    labId: "S-FF-06",
    teamMembers: [
      {
        studentCode: "29609010201024",
        fullName: "Aya Ashraf Elias AbdelMaksoud",
      },
      { studentCode: "30106101703522", fullName: "Aya Emad Ramadan" },
      { studentCode: "30201210201149", fullName: "Amal Sherif Nasif Eldsoky" },
      { studentCode: "29811248800922", fullName: "Aml Wajeh Mamdouh Mohamed" },
      {
        studentCode: "29509182602921",
        fullName: "Rawia Moatasem Sayed AbdelFattah",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Smart Customer Feedback Analytics",
    projectName: "Smart Customer Feedback Analytics",
    description:
      "This project presents an AI-powered customer review intelligence system designed to analyze and understand customer feedback from multiple data sources, including databases, social media platforms, and online review platforms. The system applies Artificial Intelligence and Natural Language Processing (NLP) techniques to process large volumes of unstructured customer feedback and transform it into meaningful and actionable insights. The system focuses on Aspect-Based Sentiment Analysis (ABSA), identifying key aspects such as food quality, service, and atmosphere, while determining the sentiment associated with each aspect. It also includes data preprocessing, language detection, duplicate and near-duplicate detection, sentiment analysis, and automated review processing. By analyzing customer feedback from different sources, the system helps businesses understand customer opinions, identify strengths and weaknesses, detect recurring issues, and make data-driven decisions to improve customer experience and service quality. The final insights are presented through analytical dashboards that provide a clear and comprehensive view of customer feedback and overall sentiment.",
    labId: "S-FF-06",
    teamMembers: [
      {
        studentCode: "30211228800789",
        fullName: "Fatma Abdel Fattah Abdel Razek",
      },
      { studentCode: "30107252503343", fullName: "Alaa Atef Ahmed" },
      { studentCode: "30110300400366", fullName: "Nourseen Mohamed Abass" },
      { studentCode: "30201011370365", fullName: "Iman Moustafa Abdelsalam" },
      { studentCode: "29305298800483", fullName: "Alaa Salah Mahmoud Hassan" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "An adaptable Human-in-the-Loop system for joint Brain tumor segmentation and classification",
    projectName:
      "An adaptable Human-in-the-Loop system for joint Brain tumor segmentation and classification",
    description:
      "Automated brain-tumour MRI systems commonly couple lesion classification and localisation within a single dependent forward path, so that an attention drift in the classifier propagates into the localisation stage and corrupts every downstream artefact — the mask, the morphometric measurements and the generated report. We term this failure an attention cascade, and it is clinically consequential because it produces a set of mutually consistent panels that are all wrong, leaving the reader no internal disagreement to notice. A second, quieter problem affects the public four-class benchmarks used throughout this literature: they carry label noise that inflates reported accuracy and misattributes the residual error to model capacity. This thesis presents MindScan, a decoupled parallel multi-pathway architecture in which classification and localisation run as independent, simultaneously initiated checkpoints over the same MRI slice and are combined only at the output by a structured payload builder. The classification pathway is a dual-backbone late-fusion network (EfficientNet-B2 and Xception) with adaptive decision-level probability fusion. Training is preceded by a non-destructive audit that scores every glioma training image with a held classifier: 6.93% of the glioma training folder is flagged as suspect, of which exactly one image meets the strict 0.90-confidence threshold for automated quarantine, applied to the training split only. The localisation pathway is a four-tier segmentation engine — a clinician-verified perceptual-hash cache, an Attention U-Net, a MedSAM delineation prompted by a context-bounded Compact-Blob box, and an intensity fallback — that never consumes the classifier’s attention map. On a seeded, stratified, image-level held-out split of 800 images, the production model attains 94.88% accuracy with macro precision 0.951, macro recall 0.949, macro F1 0.948 and macro ROC-AUC 0.988; five-fold cross-validation gives 92.75% ± 0.61% with macro AUC 0.992. A full confusion-matrix and per-class ROC analysis shows that the tumour-free and pituitary classes are classified with perfect recall, meningioma reaches 0.965, and glioma is the binding constraint at 0.830 recall with the highest precision of any class. Dual-backbone fusion did not improve on the single cleaned backbone, a negative result reported in full. Segmentation is deployed as a standalone service behind a clinician brush canvas; a nearest-neighbour alignment step reconciles the canvas and MRI-matrix resolutions to give pixel-faithful overlap metrics, and a patient-keyed registry archives every evaluation and quantifies learning velocity, the rate at which the system aligns to clinician corrections. Throughout, localisation is characterised as a weak, not clinically validated signal, and classification is reported on an explicitly image-level split, so that the system’s honest capabilities and its clearly stated limitations are what the reader receives. Keywords: brain-tumour MRI, EfficientNet, late fusion, decision fusion, label-noise audit, weakly-supervised localisation, MedSAM, explainable AI, human-in-the-loop, active learning, clinical decision support.",
    labId: "S-FF-05",
    teamMembers: [
      { studentCode: "30112011709386", fullName: "Rahma Ahmed Hussein" },
      { studentCode: "29911031402141", fullName: "Rowan harby" },
      { studentCode: "30107070400069", fullName: "Rawan yahia" },
      { studentCode: "29911201704407", fullName: "Habbiba Emam" },
      { studentCode: "30308050105325", fullName: "Nouran Anwer" },
      { studentCode: "29811131200746", fullName: "Zeinab Elkeilany" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI Driven Drug Repurpose",
    projectName: "AI Driven Drug Repurpose",
    description:
      "This project presents an advanced, leak-free computational pipeline for AI-driven drug repurposing using heterogeneous biomedical knowledge graphs. By integrating graph analytics, machine learning,deep learning and rigorous feature interpretation, the system systematically identifies novel therapeutic indications for existing approved drugs. This approach bypasses traditional, time-consuming discovery pipelines, offering a faster, cost-effective pathway to accelerate translational research and clinical candidate selection",
    labId: "S-FF-05",
    teamMembers: [
      { studentCode: "29407032501461", fullName: "Gehan Abdelhameed" },
      { studentCode: "30002052300506", fullName: "Rahma Gamal" },
      { studentCode: "30112171400446", fullName: "Bassant Adel" },
      { studentCode: "30011068800567", fullName: "Ruwayda Salah" },
      { studentCode: "30202058800704", fullName: "Manar Mohamed" },
      { studentCode: "29902231900287", fullName: "Passant Mahmoud" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Electricity Theft Detection",
    projectName: "Electricity Theft Detection",
    description:
      "An adaptive deep learning framework designed to accurately detect non-technical losses in smart grids by continuously analyzing power consumption patterns using the State Grid Corporation of China (SGCC) dataset.",
    labId: "S-SF-07",
    teamMembers: [
      { studentCode: "29805092101174", fullName: "Tarek Said Mohamed" },
      { studentCode: "30101152101959", fullName: "Mostafa Mohamed Ebrahim" },
      { studentCode: "30009232600499", fullName: "Mahmoud Ahmed Rashad" },
      { studentCode: "29807271401477", fullName: "Mohamed Hossam Eldin" },
      { studentCode: "30011101303213", fullName: "Mohamed Elshahat Mohamed" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Deep Learning for intelligent steel defect detection and seismic interpretation",
    projectName:
      "Deep Learning for intelligent steel defect detection and seismic interpretation",
    description:
      "An integrated computer vision framework applying YOLOv8 on the NEU-DET dataset for steel surface defect detection and a 3D U-Net semantic segmentation model on FaultSeg3D for automated seismic fault interpretation.",
    labId: "S-FF-05",
    teamMembers: [
      { studentCode: "29306060202959", fullName: "Hazem Shokr" },
      { studentCode: "29602201301113", fullName: "Hossam el nagar" },
      { studentCode: "30009301204533", fullName: "Khaled Awad" },
      { studentCode: "29411102600991", fullName: "Bassem Salah" },
      { studentCode: "29903181402155", fullName: "Hazem Mohamed" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "BoviScan",
    projectName: "Food and Mouth disease (FMD) Multimodel Detection",
    description:
      "An AI-based intelligent decision support system (BoviScan) utilizing CNNs and transfer learning to analyze images of cattle for early detection and diagnosis of Foot-and-Mouth Disease (FMD).",
    labId: "S-SF-07",
    teamMembers: [
      { studentCode: "29806010107427", fullName: "Neama EID Darwesh" },
      { studentCode: "29911170104546", fullName: "NadaKhalid Mahmoud" },
      { studentCode: "30209300201467", fullName: "MennaTallah Ibrahim" },
      { studentCode: "30208141100984", fullName: "Merna Abdelhalim Ahmed" },
      { studentCode: "29808221802281", fullName: "Nancy Fakhry Elbesomy" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Theqa",
    projectName: "Interview IQ",
    description:
      "A web-based multimodal mock-interview coaching platform (Theqa) decoupling factual response correctness from behavioral presentation using NLP (BGE-M3, NLI), audio emotion analysis (Wav2Vec2, BiLSTM), and video poise tracking.",
    labId: "S-FF-05",
    teamMembers: [
      { studentCode: "29408100204612", fullName: "Baher Mikhael Habib" },
      { studentCode: "30106241700434", fullName: "Hossam Abdelaziz" },
      { studentCode: "30102151204459", fullName: "Ahmed Fouad hashem" },
      { studentCode: "30202091303414", fullName: "Abdelrahman Mmohamed" },
      { studentCode: "29412022101418", fullName: "Khaled Ahmed Mohamed" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "MindSync",
    projectName: "A Multimodal system for Automated Depression Detection",
    description:
      "A multimodal deep learning framework (MindSync) for depression-indicator detection combining audio features (MFCC, BiLSTM) and video features (3D-ResNet) fused with an MLP classifier and rule-based inference engine.",
    labId: "S-FF-05",
    teamMembers: [
      { studentCode: "30107111700749", fullName: "Basma Ftoh" },
      { studentCode: "29306272200808", fullName: "Bothaina Ramadan" },
      { studentCode: "29504261700384", fullName: "Zahraa Mostafa Eliwa" },
      { studentCode: "29606031300767", fullName: "khlood Mahmoud" },
      { studentCode: "29608172102627", fullName: "Rehab Moawed" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-powered Smart water Quality Prediction",
    projectName: "AI-powered Smart water Quality Prediction",
    description:
      "A two-phase water quality monitoring framework combining Random Forest virtual sensing for nitrate estimation with TranAD multivariate time-series anomaly detection, presented through an interactive map-based dashboard.",
    labId: "S-SF-07",
    teamMembers: [
      { studentCode: "30106241302668", fullName: "Nada Ahmed Seddik" },
      { studentCode: "30005133200041", fullName: "Rehab Ashraf" },
      { studentCode: "29809150202208", fullName: "Mona Yasser" },
      { studentCode: "29709292602683", fullName: "Nada Gaber" },
      { studentCode: "30107151500904", fullName: "Fatma Youssef Kamal" },
      { studentCode: "29804111401561", fullName: "Hager Roshdy" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Solar Power Generation",
    projectName: "Solar Power Generation",
    description:
      "A comparative forecasting study evaluating Random Forest and LSTM network models for short-term (15 min) and day-ahead (24 hour) solar photovoltaic power generation using the BR_PV Gen dataset.",
    labId: "S-SF-07",
    teamMembers: [
      { studentCode: "29806010207537", fullName: "Mostafa Mahmoud Mohamed" },
      { studentCode: "29804282100836", fullName: "Mohamed Abdelhaliem" },
      { studentCode: "29805131401652", fullName: "Ahmed Hassan Mohamed" },
      { studentCode: "29704221600874", fullName: "Mostafa Khalifa Mohamd" },
      { studentCode: "29909222102739", fullName: "Youssef Mahmoud Ali" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AI-based Prediction of Wheat hybrid performance and parental compatibility",
    projectName:
      "AI-based Prediction of Wheat hybrid performance and parental compatibility",
    description:
      "An end-to-end genomic breeding decision-support framework leveraging deep neural networks (ResNets, Transformers, VGG-inspired CNNs) and CatBoost to predict wheat hybrid performance and parental compatibility from SNP markers.",
    labId: "S-SF-07",
    teamMembers: [
      { studentCode: "30201070104148", fullName: "Hana Mohamed AlaaEldin" },
      { studentCode: "30007231201407", fullName: "Nurhan Abdelkhaleq" },
      { studentCode: "30206022501242", fullName: "Nada Khaled Abdelsattar" },
      { studentCode: "29603100400508", fullName: "Nehal Ali" },
      { studentCode: "30011201800044", fullName: "Hagar Ashraf" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "AgriVision",
    projectName:
      "Plant Disease Detection and Water Management in Smart Farming",
    description:
      "An AI-powered smart agriculture platform using computer vision and deep learning to analyze crop images, deliver automated disease diagnoses, and offer actionable farming recommendations.",
    labId: "S-FF-02",
    teamMembers: [
      { studentCode: "29601062402728", fullName: "Marwa Raouf" },
      { studentCode: "30207011207047", fullName: "Bassant Hussein Ashour" },
      { studentCode: "30302051500963", fullName: "Alaa Abdel Moneim Gadallah" },
      {
        studentCode: "30001011116729",
        fullName: "Yomna Ashraf Ahmad Elshorbagy",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "ADPilot",
    projectName:
      "An AI-Powered Autonomous Marketing Agency Using Collaborative Multi-Agent Systems and Large Language Models",
    description:
      "An autonomous marketing OS integrating LLMs, multi-agent collaboration, RAG, and computer vision to automate campaign strategy, content creation, analytics, and ROI optimization with human-in-the-loop oversight.",
    labId: "S-FF-02",
    teamMembers: [
      { studentCode: "30108112602372", fullName: "Mohamed Khaled Mahmod" },
      { studentCode: "29410168800978", fullName: "Mohamed Awni Ghaith" },
      {
        studentCode: "29909111800259",
        fullName: "Mohamed Abd Elsalam Mohamed",
      },
      { studentCode: "29703131201478", fullName: "Mohamed Mahmoud Mohamed" },
      {
        studentCode: "30105052700974",
        fullName: "Mohamed Karem Mahmoud Ahmed",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Real-Time Weapon Threat Detection in Grayscale CCTV Surveillance Using AI Techniques",
    projectName:
      "Real-Time Weapon Threat Detection in Grayscale CCTV Surveillance Using AI Techniques",
    description:
      "An intelligent multi-camera surveillance architecture featuring YOLO11s threat detection, threat-person association, threat-triggered tracking, and person re-identification (Re-ID) for cross-camera tracking.",
    labId: "S-FF-02",
    teamMembers: [
      {
        studentCode: "30201101702235",
        fullName: "Youssef Mohamed Abdel-Samie",
      },
      {
        studentCode: "29605120300235",
        fullName: "Mohamed Tarek Abdo Abu El Kheir",
      },
      {
        studentCode: "30109011224837",
        fullName: "Mohamed Wael Mohamed Elsayed",
      },
      {
        studentCode: "30110011206837",
        fullName: "Mohamed Kamal Abd ElFattah Beah",
      },
      {
        studentCode: "30107061601779",
        fullName: "Mahmoud Ahmed Mohamed ElKholy",
      },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "DigiSteel-YOLO",
    projectName: "AI-Based Steel Surface Defect Detection",
    description:
      "A lightweight deep-learning framework (DigiSteel-YOLO) utilizing YOLO11n equipped with a novel Defect-Aware Feature Enhancement Gate (DAFEGate) module for automated detection of steel surface anomalies.",
    labId: "S-FF-02",
    teamMembers: [
      { studentCode: "30108212101575", fullName: "Yousef Sherif Ramadan" },
      { studentCode: "29806140101897", fullName: "Momen Esmat Omar Mohamed" },
      {
        studentCode: "30109070103199",
        fullName: "Mahmoud Hesham Mohamed Zaki",
      },
      {
        studentCode: "30303053400431",
        fullName: "Hazem Khaled Ezat Abdul Halim",
      },
      { studentCode: "30007240104171", fullName: "Mohamed Salah Abbas" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Deep Learning-Based Document Classification for Customer Review Analysis in Decision Support Systems",
    projectName:
      "Deep Learning-Based Document Classification for Customer Review Analysis in Decision Support Systems",
    description:
      "An AI-powered customer review analysis framework combining RoBERTa sentiment classification with targeted Qwen LLM qualitative interpretation for business intelligence and decision support.",
    labId: "S-FF-02",
    teamMembers: [
      { studentCode: "30202102102157", fullName: "Mahmoud Maher" },
      {
        studentCode: "29911121401691",
        fullName: "Mahmoud Saad Abd Elazeem Ahmed",
      },
      { studentCode: "30110011838434", fullName: "Mohamed Abdellah Dogheim" },
      {
        studentCode: "29708231303393",
        fullName: "Eissam Mohamed Mahmoud Abdelrazik",
      },
      { studentCode: "30105102400578", fullName: "Mohamed Eid Abdel-Khaleq" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Baseera",
    projectName:
      "An Intelligent Multi-Stage Pipeline for Fake News Detection and Harmful Content Classification",
    description:
      "An integrated e-commerce analytics platform (Baseera) featuring data pipelines, RFM segmentation, review sentiment classification (multilingual BERT & CNN2D), fake review detection, and SHAP explainability.",
    labId: "S-FF-02",
    teamMembers: [
      {
        studentCode: "29504011400083",
        fullName: "Radwa Elsayed Mohamed Elmahdy",
      },
      {
        studentCode: "30002080101845",
        fullName: "Marwa Alaaeldin Ahmed Baraka",
      },
      {
        studentCode: "29909301311947",
        fullName: "Basma Mansour Hussien Ibrahim",
      },
      { studentCode: "30102193400088", fullName: "Shrouk Khaled Ezzat" },
    ],
  },
  {
    trackId: "f61a42de-fb92-4e2b-989f-c7e282b915e5",
    name: "Tomato-Plant Disease Detection and Classification Using AI Techniques",
    projectName:
      "Tomato-Plant Disease Detection and Classification Using AI Techniques",
    description:
      "An end-to-end computer vision pipeline comparing a custom CNN baseline against a transfer learning MobileNetV2 architecture on the PlantVillage dataset for automated tomato leaf disease classification.",
    labId: "S-FF-02",
    teamMembers: [
      { studentCode: "30006061303564", fullName: "Sohad Abd El-Mohsen" },
      { studentCode: "30005101703025", fullName: "Aya Mostafa Ali" },
      {
        studentCode: "29707122500565",
        fullName: "Salwa Gamal Abdelmoneim Ahmed",
      },
      { studentCode: "30208081802305", fullName: "Maha Khaled Mohamed Ali" },
    ],
  },
  // // Cyber
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "Argus",
    projectName: "Argus",
    description: "Pentest",
    teamMembers: [
      {
        studentCode: "30005101500752",
        fullName: "Momen Medhat Farouk Mostafa",
      },
      {
        studentCode: "30110202500697",
        fullName: "Philopater Shenouda Sedkiy Shenouda",
      },
      {
        studentCode: "29810292400544",
        fullName: "Fatma Ali Hassan Abd Elwahab",
      },
      {
        studentCode: "30208072501327",
        fullName: "Habiba Ashraf Moatamed Ahmed",
      },
      {
        studentCode: "30011240100068",
        fullName: "Salma Nasser Mohamed Hassan",
      },
      {
        studentCode: "30307090104015",
        fullName: "Moustafa Hussein Ebrahim Mahfouuz",
      },
      { studentCode: "29707051602752", fullName: "Mohamed Ibrahim Shehata" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "APEX __X-SOAR",
    projectName: "APEX __X-SOAR",
    description: "SOC",
    labId: "S-SF-02",
    teamMembers: [
      {
        studentCode: "30401151700097",
        fullName: "Mohamed Yasser Mohamed Reda Rabie",
      },
      {
        studentCode: "30203061303033",
        fullName: "Mostafa Mohammed AbdEl-Kader Boghdady",
      },
      {
        studentCode: "30012031801616",
        fullName: "Yahia Refaat ElSaeed Shalapy",
      },
      { studentCode: "30306271600689", fullName: "Farah Hazem Mohammed Badie" },
      {
        studentCode: "30108181301724",
        fullName: "Safaa Mohamed Ahmed Elmhalawy",
      },
      {
        studentCode: "30206061304527",
        fullName: "Nourhan Mohamed Ibrahim Anwar",
      },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "Darknode",
    projectName: "Darknode",
    description: "SOC",
    labId: "S-SF-05",
    teamMembers: [
      { studentCode: "30002291801053", fullName: "Kareem Adel Hewaidy" },
      { studentCode: "30103210300293", fullName: "Abdelrhman Mohamed Ali" },
      { studentCode: "29811071601495", fullName: "Hassan Anwar Hassan" },
      { studentCode: "30212102300566", fullName: "Mariam Sayed Ewis" },
      { studentCode: "30206048801007", fullName: "Hadeer Emad Abd El-hameed" },
      { studentCode: "30107151605005", fullName: "Naira Khaled EL-Rifai" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "BlueWall",
    projectName: "BlueWall",
    description: "SOC",
    labId: "S-SF-05",
    teamMembers: [
      { studentCode: "30003310200313", fullName: "Mazen Hamdy Ahmed" },
      { studentCode: "29901011306094", fullName: "Marwan Ahmed Barakat" },
      { studentCode: "30205171600176", fullName: "Mahmoud Esam Elsaid Sharf" },
      { studentCode: "30104051800154", fullName: "Mohamed Sherif Mahmoud" },
      { studentCode: "30102111100715", fullName: "Mohamed Magdy Hasaan" },
      { studentCode: "29507240201336", fullName: "George Talaat Iskander" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "SurfX",
    projectName: "SurfX",
    description: "AI-Powered Attack Surface Management Platform",
    labId: "S-SF-05",
    teamMembers: [
      { studentCode: "29411302201217", fullName: "Hossam ahmed abdelazeem" },
      { studentCode: "30001011357858", fullName: "Andrew ashraf ghali" },
      { studentCode: "29912060200716", fullName: "Filobateir maged younan" },
      { studentCode: "30104182200845", fullName: "Mariam hatem tawfik" },
      { studentCode: "30205151305348", fullName: "Mariam fawzy abdelaziz" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "AECERF Resilience Framework",
    projectName: "AECERF Resilience Framework",
    description: "GRC",
    labId: "S-SF-02",
    teamMembers: [
      {
        studentCode: "29501050103712",
        fullName: "Mohamed Rafat Sayed Mahmoud Al-Khooly",
      },
      { studentCode: "29909131701192", fullName: "Mohamed Elsayed Dowidar" },
      { studentCode: "30009091306001", fullName: "Rana Mahmoud Ahmed Elzayat" },
      { studentCode: "30109031303784", fullName: "Faten Magdy Sharaf" },
      { studentCode: "30304012704007", fullName: "Esraa Nasser Hanfy" },
      { studentCode: "29502120102278", fullName: "Abdallah Mossad" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "Wadjet",
    projectName: "Wadjet",
    description: "GRC",
    labId: "S-SF-05",
    teamMembers: [
      { studentCode: "30001262502172", fullName: "Mohamed AbdElhameed" },
      { studentCode: "30105131602228", fullName: "Lamis Fatoh" },
      { studentCode: "30101101600829", fullName: "Eman Elshatlawi" },
      {
        studentCode: "29905231200373",
        fullName: "Mohamed yasser mohamed meshaly",
      },
      { studentCode: "30108121601087", fullName: "Mirna emad Ali" },
      { studentCode: "30004182104531", fullName: "Youssef Elnagar" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "Injectra",
    projectName: "Injectra",
    description: "Pentest",
    labId: "S-SF-02",
    teamMembers: [{ studentCode: "30303031605277", fullName: "Mohamed Karam" }],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "D1- جبار - Here",
    projectName: "D1- جبار - Here",
    description: "SOC",
    labId: "S-SF-01",
    teamMembers: [
      { studentCode: "30102171302171", fullName: "Bassel Alaa Elagroudi" },
      { studentCode: "30011011322456", fullName: "Amr Mohsen Sakr" },
      { studentCode: "29902161201297", fullName: "Muhammed Abdellatef" },
      { studentCode: "30210012433025", fullName: "Roba Amer Abdelshafy" },
      { studentCode: "30309142301844", fullName: "Mariam Mahmoud Mohammed" },
      { studentCode: "30204122200271", fullName: "Mohamed Yasser Abdelati" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "RAQIB",
    projectName: "RAQIB",
    description: "GRC",
    labId: "S-SF-01",
    teamMembers: [
      { studentCode: "30011080200079", fullName: "Moataz Mohamed Awod" },
      {
        studentCode: "29412152502252",
        fullName: "Shehab El-Din Mustafa Elsalmy",
      },
      { studentCode: "30205282401601", fullName: "Habiba Hany Mohamed" },
      { studentCode: "30201072403525", fullName: "Ebtehal Gomaa Sayed" },
      { studentCode: "29405201802635", fullName: "Akram Khalifa" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "DFAI",
    projectName: "DFAI",
    description: "Digital Forensics by Artificial Intelligence",
    labId: "S-SF-01",
    teamMembers: [
      { studentCode: "29411032101291", fullName: "Amr Mohsen Mahmoud" },
      { studentCode: "30004102304012", fullName: "Mahmoud Salama Ali" },
      { studentCode: "29910010125419", fullName: "Peter Samir Ibrahim" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "PhishShield",
    projectName: "PhishShield",
    description: "SOC",
    labId: "S-SF-06",
    teamMembers: [
      { studentCode: "29601272201156", fullName: "Ahmed Abd-Elwahab Qurany" },
      { studentCode: "30103292300377", fullName: "Abdulrahman Ali Ahmed" },
      { studentCode: "30008100105158", fullName: "Alaa Ahmed Mohamed Omar" },
      {
        studentCode: "30011182201371",
        fullName: "Adham Nasser Ibrahem Mahmoud",
      },
      {
        studentCode: "30108230104034",
        fullName: "Ahmed Muhamed Ahmed Abdullatif",
      },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "Smart Alert Filter and Incident Responder",
    projectName: "Smart Alert Filter and Incident Responder",
    description: "SOC",
    labId: "S-SF-06",
    teamMembers: [
      { studentCode: "30104141600812", fullName: "Ahmed Essam Abdelmoneim" },
      { studentCode: "30008140105452", fullName: "Ahmed Abdelrahman Elhadary" },
      { studentCode: "30108141700251", fullName: "Ali Omara" },
      { studentCode: "30010231401385", fullName: "Basant Ahmed Mohamed" },
      { studentCode: "30208011608145", fullName: "Alaa Hossam Elbagory" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "AegisXAI",
    projectName: "AegisXAI",
    description: "SOC",
    labId: "S-SF-06",
    teamMembers: [
      { studentCode: "30003081200894", fullName: "Aziz Ragab" },
      { studentCode: "29702152507171", fullName: "Emad Hassan" },
      { studentCode: "30102071602453", fullName: "Mohamed Hany" },
      { studentCode: "30209091702275", fullName: "Taha AlGhunaimi" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "ThreatLens",
    projectName: "ThreatLens",
    description: "",
    labId: "",
    teamMembers: [
      { studentCode: "30202231701318", fullName: "Sherif magdy Marwan" },
      { studentCode: "30112250104836", fullName: "Yahia amr Talaat" },
      { studentCode: "30104262100094", fullName: "Eslam mohsen saber" },
      { studentCode: "30010151901034", fullName: "Mohamed lotfy ahmed" },
      { studentCode: "30207031100877", fullName: "Hazem hany Mohamed" },
      { studentCode: "30007180200192", fullName: "Mahmoud ahmed abdelrazik" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "INTELLIGENT SOC",
    projectName: "INTELLIGENT SOC",
    description: "",
    teamMembers: [
      { studentCode: "30303090105091", fullName: "Mohamed Sabry" },
      { studentCode: "30006151701976", fullName: "Mohamed Badawy" },
      { studentCode: "30109300300991", fullName: "Ahmed Khalifa" },
      { studentCode: "30212020300452", fullName: "Mohamed Salah" },
      { studentCode: "30210010108003", fullName: "Farah Badawy" },
      { studentCode: "29705208800372", fullName: "Almoatesim Bellah" },
    ],
  },
  {
    trackId: "5cdc7f88-820f-48b9-ba13-4ef5c56d16e3",
    name: "campus",
    projectName: "campus",
    description: "Network Security",
    teamMembers: [
      { studentCode: "30107123100097", fullName: "Ali Ashraf Hassan" },
    ],
  },
];
async function main() {
  console.log("🌱 Starting Teams admin seeding...");

  for (const item of data) {
    const team = await prisma.team.create({
      data: {
        name: item.name,
        projectName: item.projectName,
        description: item.description,
        track: {
          connect: { id: item.trackId },
        },
        // If students/teamMembers exist as a relation on Team:
        students: {
          create: item.teamMembers.map((member) => ({
            studentCode: member.studentCode,
            fullName: member.fullName,
          })),
        },
      },
    });

    console.log("Created team:", team.name);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding initial teams:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
