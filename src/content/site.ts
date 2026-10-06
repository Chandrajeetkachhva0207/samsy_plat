
/**
 * Seeded sample content for मा नर्मदा आध्यात्मिक शिक्षण संस्था.
 * EVERY string here is editable placeholder content and will later be served
 * from the admin panel (CMS). No statistics, registration numbers, bank
 * details or phone numbers are invented — placeholders are used instead.
 */

import type { Bi } from "@/lib/lang";

export const PLACEHOLDER = {
  phone: {
    mr: "+91 73855 01205, +91 79729 61607",
    en: "+91 73855 01205, +91 79729 61607",
  },
  phones: [
    { raw: "7385501205", display: "+91 73855 01205" },
    { raw: "7972961607", display: "+91 79729 61607" },
  ],
  email: {
    mr: "maanarmadasansthan@gmail.com",
    en: "maanarmadasansthan@gmail.com",
  },
  maps: {
    mr: "[अधिकृत Google Maps लोकेशन]",
    en: "[Official Google Maps location]",
  },
  whatsapp: "7385501205",
};

export const socialLinks = {
  youtube: "https://www.youtube.com/@user-qu8kv4fe3l72",
  facebook: "https://www.facebook.com/share/v/1LeUBrXMtD/",
  instagram:
    "https://www.instagram.com/santosh_maharaj_pawar_73?utm_source=qr&stkn=MWo0bWpzdHR0NGs3NQ%3D%3D",
};

export const org = {
  name: {
    mr: "मा नर्मदा आध्यात्मिक शिक्षण संस्था",
    en: "Maa Narmada Adhyatmik Shikshan Sanstha",
  } as Bi,

  gurukul: {
    mr: "मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची",
    en: "Maa Narmada Adhyatmik Gurukul, Alandi Devachi",
  } as Bi,

  tagline: {
    mr: "शिक्षण • संस्कार • अध्यात्म • वारकरी परंपरा",
    en: "Education • Values • Spirituality • Warkari Tradition",
  } as Bi,

  greeting: {
    mr: "॥ राम कृष्ण हरी ॥",
    en: "॥ Ram Krishna Hari ॥",
  } as Bi,

  greeting2: {
    mr: "॥ ज्ञानोबा – तुकाराम ॥",
    en: "॥ Dnyanoba – Tukaram ॥",
  } as Bi,

  founder: {
    mr: "ह.भ.प. संतोष महाराज पवार",
    en: "H.B.P. Santosh Maharaj Pawar",
  } as Bi,

  founderRole: {
    mr: "संस्थापक अध्यक्ष, मा नर्मदा आध्यात्मिक शिक्षण संस्था",
    en: "Founder President, Maa Narmada Adhyatmik Shikshan Sanstha",
  } as Bi,

  address: {
    mr: "मा नर्मदा आध्यात्मिक गुरुकुल, आळंदी देवाची, ता. खेड, जि. पुणे, महाराष्ट्र",
    en: "Maa Narmada Adhyatmik Gurukul, Alandi Devachi, Tal. Khed, Dist. Pune, Maharashtra",
  } as Bi,
};

export const nav: { to: string; label: Bi }[] = [
  { to: "/", label: { mr: "मुख्यपृष्ठ", en: "Home" } },
  { to: "/about", label: { mr: "संस्थाविषयी", en: "About" } },
  {
    to: "/founder",
    label: { mr: "संस्थापक अध्यक्ष", en: "Founder President" },
  },
  { to: "/gurukul", label: { mr: "गुरुकुल", en: "Gurukul" } },
  { to: "/activities", label: { mr: "उपक्रम", en: "Activities" } },
  {
    to: "/students",
    label: { mr: "विद्यार्थी व सुविधा", en: "Students & Facilities" },
  },
  { to: "/events", label: { mr: "कार्यक्रम", en: "Events" } },
  { to: "/gallery", label: { mr: "फोटो गॅलरी", en: "Photo Gallery" } },
  { to: "/videos", label: { mr: "व्हिडिओ", en: "Videos" } },
  { to: "/reports", label: { mr: "कार्य अहवाल", en: "Annual Reports" } },
  { to: "/support", label: { mr: "सहकार्य करा", en: "Support Us" } },
  { to: "/contact", label: { mr: "संपर्क", en: "Contact" } },
];

export const secondaryNav: { to: string; label: Bi }[] = [
  {
    to: "/future-plans",
    label: { mr: "भविष्यातील योजना", en: "Future Plans" },
  },
  {
    to: "/certificates",
    label: {
      mr: "संस्था नोंदणी / प्रमाणपत्रे",
      en: "Registration & Certificates",
    },
  },
  {
    to: "/privacy",
    label: { mr: "गोपनीयता धोरण", en: "Privacy Policy" },
  },
];

export const saints = [
  {
    src: "/images/maa-narmada.jpg",
    name: {
      mr: "माँ नर्मदा देवी",
      en: "Maa Narmada Devi",
    } as Bi,
  },
  {
    src: "/images/vitthal-rakhumai.jpg",
    name: {
      mr: "श्री विठ्ठल – रखुमाई, पंढरपूर",
      en: "Shri Vitthal – Rakhumai, Pandharpur",
    } as Bi,
  },
  {
    src: "/images/sant-dnyaneshwar.jpg",
    name: {
      mr: "संत ज्ञानेश्वर महाराज, आळंदी",
      en: "Sant Dnyaneshwar Maharaj, Alandi",
    } as Bi,
  },
  {
    src: "/images/sant-tukaram.jpg",
    name: {
      mr: "संत तुकाराम महाराज, देहू",
      en: "Sant Tukaram Maharaj, Dehu",
    } as Bi,
  },
];

export const homeIntro: Bi = {
  mr: "आळंदी देवाची या संत ज्ञानेश्वर महाराजांच्या पावन भूमीत गेल्या १२ वर्षांपासून गुरुकुलाच्या माध्यमातून विद्यार्थ्यांना शालेय शिक्षणासोबत आध्यात्मिक संस्कार, वारकरी परंपरा, संतविचार, कीर्तन, प्रवचन आणि भारतीय संस्कृतीची ओळख करून देण्याचा प्रयत्न केला जात आहे.",
  en: "In Alandi Devachi, the sacred land of Sant Dnyaneshwar Maharaj, the gurukul has for the past 12 years sought to give students school education together with spiritual values, the Warkari tradition, the thought of the saints, kirtan, pravachan and an introduction to Indian culture.",
};

export const keyActivities: { icon: string; title: Bi }[] = [
  {
    icon: "📖",
    title: { mr: "शालेय शिक्षण", en: "School Education" },
  },
  {
    icon: "🪔",
    title: { mr: "आध्यात्मिक शिक्षण", en: "Spiritual Education" },
  },
  {
    icon: "🚩",
    title: { mr: "वारकरी संस्कार", en: "Warkari Values" },
  },
  {
    icon: "🧒",
    title: { mr: "बाल संस्कार शिबिर", en: "Children's Sanskar Camps" },
  },
  {
    icon: "🎶",
    title: { mr: "कीर्तन व प्रवचन", en: "Kirtan & Pravachan" },
  },
  {
    icon: "🎭",
    title: { mr: "सांस्कृतिक कार्यक्रम", en: "Cultural Programmes" },
  },
  {
    icon: "🤝",
    title: { mr: "सामाजिक उपक्रम", en: "Social Initiatives" },
  },
];

export const timeline: { year: Bi; text: Bi }[] = [
  {
    year: { mr: "१. सुरुवात", en: "1. Beginning" },
    text: {
      mr: "आळंदी देवाची येथे काही मोजक्या विद्यार्थ्यांसह मा. नर्मदा आध्यात्मिक वारकरी गुरुकुलाची सुरुवात झाली. शिक्षणासोबत अध्यात्म आणि संस्कार रुजविण्याचा उद्देश ठेवण्यात आला. विद्यार्थ्यांना योग्य मार्गदर्शन आणि आध्यात्मिक वातावरण मिळावे, यासाठी प्रयत्न सुरू झाले. छोट्याशा उपक्रमातून एका प्रेरणादायी प्रवासाचा पाया रचला गेला.",
      en: "Maa Narmada Adhyatmik Warkari Gurukul began its journey in Alandi Devachi with a modest group of students. The core objective was to instill spiritual values alongside regular education. Sincere efforts commenced to provide students with proper academic guidance in a devotional atmosphere, laying the foundation of an inspiring journey from this small beginning.",
    },
  },
  {
    year: { mr: "२. प्रारंभीची वर्षे", en: "2. Early years" },
    text: {
      mr: "गुरुकुलात विद्यार्थ्यांसाठी शालेय अभ्यासाचे मार्गदर्शन सुरू झाले. त्यासोबत नियमित प्रार्थना, नामस्मरण आणि संस्कार वर्गांचे आयोजन करण्यात आले. विद्यार्थ्यांमध्ये शिस्त, भक्ती आणि नैतिक मूल्ये रुजविण्यावर भर दिला गेला. शिक्षण आणि संस्कार यांचा सुंदर समन्वय साधण्यास सुरुवात झाली.",
      en: "Academic guidance for school studies commenced at the Gurukul, accompanied by regular daily prayers, Naam Smaran, and value-based संस्कार sessions. Emphasis was placed on cultivating discipline, devotion, and moral values among students, marking the beginning of a harmonious blend between education and culture.",
    },
  },
  {
    year: { mr: "३. मधली वर्षे", en: "3. Middle years" },
    text: {
      mr: "गुरुकुलाच्या कार्याचा विस्तार होत कीर्तन, प्रवचन आणि वारकरी परंपरेच्या शिक्षणाला चालना मिळाली. बालसंस्कार शिबिरे आणि विविध सांस्कृतिक कार्यक्रमांचे आयोजन करण्यात आले. विद्यार्थ्यांना धार्मिक परंपरा आणि संतांच्या विचारांची ओळख करून देण्यात आली. आध्यात्मिक आणि सांस्कृतिक उपक्रमांमुळे गुरुकुलाची वाटचाल अधिक समृद्ध झाली.",
      en: "As the Gurukul's activities expanded, education in Kirtan, Pravachan, and the sacred Warkari tradition gained momentum. Children's value-based camps and diverse cultural programs were organized, introducing students to devotional traditions and the teachings of the saints, enriching the Gurukul's purposeful path.",
    },
  },
  {
    year: { mr: "४. आज", en: "4. Today" },
    text: {
      mr: "आज गुरुकुल शिक्षण, संस्कार आणि अध्यात्म यांचा समन्वय साधून कार्यरत आहे. विद्यार्थ्यांच्या शैक्षणिक, सांस्कृतिक आणि आध्यात्मिक विकासासाठी विविध उपक्रम राबविले जातात. व्यक्तिमत्त्व विकासासोबत नैतिक मूल्ये आणि वारकरी परंपरेचे जतन करण्यावर भर दिला जातो. धार्मिक आणि सामाजिक कार्यातून समाजात सकारात्मक बदल घडविण्याचा प्रयत्न सुरू आहे.",
      en: "Today, the Gurukul actively functions with a seamless synthesis of education, values, and spirituality. Diverse initiatives are conducted for students' academic, cultural, and spiritual growth. Alongside holistic personality development, deep emphasis is placed on preserving moral values and the Warkari heritage, fostering positive societal transformation through religious and social service.",
    },
  },
];

export const about = {
  sections: [
    {
      title: {
        mr: "स्थापना",
        en: "Establishment",
      },
      body: {
        mr: "मा नर्मदा आध्यात्मिक शिक्षण संस्थेची स्थापना शिक्षण, संस्कार, अध्यात्म आणि वारकरी परंपरेच्या माध्यमातून विद्यार्थ्यांच्या सर्वांगीण विकासासाठी कार्य करण्याच्या उद्देशाने करण्यात आली. आळंदी देवाची येथे गुरुकुलाच्या माध्यमातून हे कार्य गेल्या १२ वर्षांपासून सुरू आहे.",
        en: "Maa Narmada Adhyatmik Shikshan Sanstha was established with the aim of supporting the overall development of students through education, values, spirituality and the Warkari tradition. The Gurukul has been carrying out this work at Alandi Devachi for the past 12 years.",
      },
    },
    {
      title: {
        mr: "उद्दिष्टे",
        en: "Objectives",
      },
      body: {
        mr: "विद्यार्थ्यांना शालेय शिक्षणासोबत आध्यात्मिक संस्कार देणे, वारकरी परंपरेची ओळख करून देणे, संतविचार आणि भारतीय संस्कृतीचे ज्ञान देणे तसेच विद्यार्थ्यांमध्ये शिस्त, सेवा, नम्रता आणि सामाजिक जाणीव निर्माण करणे हे संस्थेचे प्रमुख उद्दिष्ट आहे.",
        en: "The main objective of the institution is to provide students with spiritual values along with school education, introduce them to the Warkari tradition, the teachings of the saints and Indian culture, and develop discipline, humility, a spirit of service and social awareness.",
      },
    },
    {
      title: {
        mr: "१२ वर्षांचा प्रवास",
        en: "A Journey of 12 Years",
      },
      body: {
        mr: "आळंदी देवाची या संत ज्ञानेश्वर महाराजांच्या पावन भूमीत मा नर्मदा आध्यात्मिक वारकरी गुरुकुलाचे कार्य गेल्या १२ वर्षांपासून सुरू आहे. या प्रवासात विद्यार्थ्यांना शिक्षणासोबत प्रार्थना, नामस्मरण, संस्कार, कीर्तन, प्रवचन, सांस्कृतिक उपक्रम आणि वारकरी परंपरेचे शिक्षण देण्याचा सातत्याने प्रयत्न केला जात आहे.",
        en: "Maa Narmada Adhyatmik Warkari Gurukul has been serving students for the past 12 years in Alandi Devachi, the sacred land associated with Sant Dnyaneshwar Maharaj. Throughout this journey, continuous efforts have been made to provide students with education along with prayer, namasmaran, values, kirtan, pravachan, cultural activities and an understanding of the Warkari tradition.",
      },
    },
    {
      title: {
        mr: "आळंदीतील कार्य",
        en: "Work in Alandi",
      },
      body: {
        mr: "संत ज्ञानेश्वर महाराजांच्या पावन भूमीत विद्यार्थ्यांसाठी शैक्षणिक, आध्यात्मिक आणि संस्कारक्षम वातावरण निर्माण करण्याचे कार्य केले जाते. विद्यार्थ्यांना संतपरंपरा, वारकरी संस्कृती, प्रार्थना, नामस्मरण, कीर्तन आणि सेवाभाव यांची ओळख करून दिली जाते.",
        en: "In the sacred land associated with Sant Dnyaneshwar Maharaj, the Gurukul works to create an educational, spiritual and value-based environment for students. Students are introduced to the saint tradition, Warkari culture, prayer, namasmaran, kirtan and the spirit of service.",
      },
    },
    {
      title: {
        mr: "शिक्षण व अध्यात्माचा संगम",
        en: "Education & Spirituality Together",
      },
      body: {
        mr: "शालेय शिक्षण आणि आध्यात्मिक संस्कार यांचा समतोल साधणे हा गुरुकुलाच्या कार्याचा महत्त्वाचा भाग आहे. विद्यार्थ्यांना अभ्यासासोबत प्रार्थना, नामस्मरण, संतविचार, कीर्तन, प्रवचन आणि भारतीय संस्कृतीचे शिक्षण दिले जाते.",
        en: "A key part of the Gurukul's approach is to maintain a balance between school education and spiritual values. Along with their studies, students are introduced to prayer, namasmaran, the teachings of the saints, kirtan, pravachan and Indian culture.",
      },
    },
    {
      title: {
        mr: "भविष्यातील उद्दिष्ट",
        en: "Future Goal",
      },
      body: {
        mr: "गुरुकुलासाठी स्वतःची जागा उपलब्ध करून घेऊन विद्यार्थ्यांसाठी शैक्षणिक, निवासी, आध्यात्मिक आणि सांस्कृतिक सुविधा उभारणे हे संस्थेचे प्रस्तावित भविष्यातील उद्दिष्ट आहे. विद्यार्थ्यांना अधिक चांगले शिक्षण, संस्कार आणि सुरक्षित वातावरण उपलब्ध करून देण्यासाठी गुरुकुलाचा विस्तार करण्याचा संकल्प आहे.",
        en: "The institution's proposed future goal is to have its own land for the Gurukul and develop educational, residential, spiritual and cultural facilities for students. The vision is to expand the Gurukul and provide students with better education, values and a supportive environment.",
      },
    },
  ],
};

export const founderPage = {
  intro: {
    mr: "ह.भ.प. संतोष महाराज पवार हे मा नर्मदा आध्यात्मिक शिक्षण संस्थेचे संस्थापक अध्यक्ष असून त्यांच्या मार्गदर्शनाखाली मा नर्मदा आध्यात्मिक वारकरी गुरुकुलाचे कार्य सुरू आहे.",
    en: "H.B.P. Santosh Maharaj Pawar is the Founder President of Maa Narmada Adhyatmik Shikshan Sanstha, under whose guidance the work of Maa Narmada Adhyatmik Warkari Gurukul is carried out.",
  } as Bi,

  role: {
    mr: "संस्थापक अध्यक्ष म्हणून ते गुरुकुलाच्या कार्याला मार्गदर्शन करतात. विद्यार्थ्यांना शिक्षण, संस्कार, अध्यात्म आणि वारकरी परंपरेचे शिक्षण मिळावे, या उद्देशाने संस्थेचे कार्य पुढे नेले जाते.",
    en: "As the Founder President, he provides guidance to the work of the Gurukul. The institution works with the aim of providing students with education, values, spirituality and knowledge of the Warkari tradition.",
  } as Bi,

  work: {
    mr: "त्यांच्या मार्गदर्शनाखाली गुरुकुलातील शैक्षणिक, आध्यात्मिक, सांस्कृतिक आणि विविध सामाजिक उपक्रम राबविले जातात.",
    en: "Under his guidance, educational, spiritual, cultural and various social activities are conducted through the Gurukul.",
  } as Bi,
};

export const gurukul = {
  identity: {
    mr: "मा नर्मदा आध्यात्मिक वारकरी गुरुकुल हे आळंदी देवाची येथे कार्यरत असून विद्यार्थ्यांना शालेय शिक्षणासोबत आध्यात्मिक संस्कार, वारकरी परंपरा, संतविचार, कीर्तन, प्रवचन आणि भारतीय संस्कृतीची ओळख करून देण्याचा प्रयत्न केला जातो.",
    en: "Maa Narmada Adhyatmik Warkari Gurukul works at Alandi Devachi with an aim to provide students with school education along with spiritual values, the Warkari tradition, the teachings of the saints, kirtan, pravachan and an introduction to Indian culture.",
  } as Bi,

  eduEnv: {
    mr: "विद्यार्थ्यांना शालेय शिक्षणासोबत संस्कार आणि आध्यात्मिक शिक्षण मिळावे, यासाठी शिक्षण व संस्कार यांचा समन्वय साधण्याचा प्रयत्न केला जातो.",
    en: "The Gurukul strives to bring education and values together so that students receive school education along with spiritual and cultural learning.",
  } as Bi,

  spiritualEnv: {
    mr: "गुरुकुलाच्या माध्यमातून विद्यार्थ्यांना अध्यात्म, वारकरी परंपरा, संतविचार, कीर्तन आणि प्रवचन यांची ओळख करून दिली जाते.",
    en: "Through the Gurukul, students are introduced to spirituality, the Warkari tradition, the teachings of the saints, kirtan and pravachan.",
  } as Bi,

  registrationNo: "15 984 (बुलढाणा)",

  routine: [
    {
      time: "पहाटे : ५ ते ६",
      timeEn: "5:00 AM – 6:00 AM",
      period: { mr: "पहाटे", en: "Early Morning" },
      icon: "🥁",
      item: {
        mr: "पखवाज व गायन सराव",
        en: "Pakhawaj & Vocal Music Practice",
      },
    },
    {
      time: "सकाळी : ६ ते ७.००",
      timeEn: "6:00 AM – 7:00 AM",
      period: { mr: "सकाळी", en: "Morning" },
      icon: "🪔",
      item: {
        mr: "स्नानसंध्या",
        en: "Snansandhya (Morning Bath & Daily Prayers)",
      },
    },
    {
      time: "सकाळी : ७ ते ८",
      timeEn: "7:00 AM – 8:00 AM",
      period: { mr: "सकाळी", en: "Morning" },
      icon: "🥣",
      item: {
        mr: "प्रार्थना, नाश्ता",
        en: "Morning Prayer & Breakfast",
      },
    },
    {
      time: "सकाळी : ८ ते १०",
      timeEn: "8:00 AM – 10:00 AM",
      period: { mr: "सकाळी", en: "Morning" },
      icon: "📖",
      item: {
        mr: "गुरुकुलाचा आध्यात्मिक पाठ / क्लास",
        en: "Gurukul Spiritual Lessons / Study Class",
      },
    },
    {
      time: "सकाळी : १० ते १२",
      timeEn: "10:00 AM – 12:00 PM",
      period: { mr: "सकाळी", en: "Morning" },
      icon: "🍲",
      item: {
        mr: "भोजन व शाळेची तयारी",
        en: "Midday Meal (Bhojan) & School Preparation",
      },
    },
    {
      time: "सकाळ : ७ ते १२ व १२ ते ५",
      timeEn: "7:00 AM – 12:00 PM & 12:00 PM – 5:00 PM",
      period: { mr: "सकाळ / दुपार", en: "Morning / Afternoon" },
      icon: "🏫",
      item: {
        mr: "शाळा (शाळेच्या वेळेनुसार)",
        en: "School (as per formal school schedule)",
      },
    },
    {
      time: "सायं : ४ ते ६.००",
      timeEn: "4:00 PM – 6:00 PM",
      period: { mr: "सायंकाळी", en: "Evening" },
      icon: "🎶",
      item: {
        mr: "पखवाज / गायन सराव",
        en: "Pakhawaj / Vocal Music Practice",
      },
    },
    {
      time: "सायं : ६ ते ७.३०",
      timeEn: "6:00 PM – 7:30 PM",
      period: { mr: "सायंकाळी", en: "Evening" },
      icon: "🪘",
      item: {
        mr: "हरिपाठ",
        en: "Haripath Chanting",
      },
    },
    {
      time: "रात्री : ७.३० ते ८.३०",
      timeEn: "7:30 PM – 8:30 PM",
      period: { mr: "रात्री", en: "Night" },
      icon: "🍽️",
      item: {
        mr: "भोजन",
        en: "Evening Dinner / Meal",
      },
    },
    {
      time: "रात्री : ८.३० ते १०.००",
      timeEn: "8:30 PM – 10:00 PM",
      period: { mr: "रात्री", en: "Night" },
      icon: "✍️",
      item: {
        mr: "शाळेचा अभ्यास",
        en: "School Studies & Homework",
      },
    },
    {
      time: "रात्री : १०.०० ते ५",
      timeEn: "10:00 PM – 5:00 AM",
      period: { mr: "रात्री", en: "Night" },
      icon: "🌙",
      item: {
        mr: "विश्रांती",
        en: "Rest & Sleep",
      },
    },
  ],

  specialNotes: [
    {
      mr: "दर एकादशी व गुरुपौर्णिमा भजन / कीर्तन होईल.",
      en: "Special Bhajan / Kirtan programme is held on every Ekadashi and Guru Purnima.",
    },
    {
      mr: "दर शनिवार व रविवार माऊली दर्शन व खेळण्यासाठी सुटी.",
      en: "Every Saturday & Sunday is a holiday for Mauli Darshan and sports / recreational games.",
    },
  ],

  method: {
    mr: "कार्यपद्धती: शालेय शिक्षणासोबत संस्कार, अध्यात्म, वारकरी परंपरा, संतविचार आणि सांस्कृतिक उपक्रम यांचा समन्वय साधण्याचा प्रयत्न केला जातो.",
    en: "Working approach: the Gurukul strives to integrate school education with values, spirituality, the Warkari tradition, the teachings of the saints and cultural activities.",
  } as Bi,
};

export const activities: {
  icon: string;
  title: Bi;
  short: Bi;
  detail: Bi;
  image?: string;
}[] = [
  {
    icon: "🧒",
    title: {
      mr: "बाल संस्कार शिबिर",
      en: "Children's Sanskar Camp",
    },
    image: "/images/children-sanskar-camp.png",
    short: {
      mr: "मुलांच्या व्यक्तिमत्त्व विकासासाठी संस्कार व आध्यात्मिक शिबिर.",
      en: "A values-based and spiritual camp for the personality development of children.",
    },
    detail: {
      mr: "मुलांच्या व्यक्तिमत्त्व विकासासाठी संस्कार व आध्यात्मिक मूल्यांवर आधारित शिबिर आयोजित केले जाते.",
      en: "A camp focused on values and spiritual learning is organized for the personality development of children.",
    },
  },

  {
    icon: "🎵",
    title: {
      mr: "कीर्तन महोत्सव",
      en: "Kirtan Festival",
    },
    image: "/images/kirtan-festival.jpg",
    short: {
      mr: "भक्ती, संतविचार आणि समाजप्रबोधनाचा संदेश देणारा उपक्रम.",
      en: "An initiative promoting devotion, the teachings of the saints and social awareness.",
    },
    detail: {
      mr: "प्रसिद्ध कीर्तनकारांच्या माध्यमातून भक्ती, संतविचार आणि समाजप्रबोधनाचा संदेश विद्यार्थ्यांपर्यंत व समाजापर्यंत पोहोचविला जातो.",
      en: "Through renowned kirtankars, messages of devotion, the teachings of the saints and social awareness are shared with students and the community.",
    },
  },

  {
    icon: "🚩",
    title: {
      mr: "वारकरी उपक्रम",
      en: "Warkari Activities",
    },
    image: "/images/warkari-activities.png",
    short: {
      mr: "वारी, दिंडी, अभंग, भजन आणि संतपरंपरेशी संबंधित कार्यक्रम.",
      en: "Activities related to Wari, Dindi, abhang, bhajan and the saint tradition.",
    },
    detail: {
      mr: "वारी, दिंडी, अभंग, भजन आणि संतपरंपरेशी संबंधित विविध कार्यक्रमांच्या माध्यमातून वारकरी संस्कृतीची ओळख करून दिली जाते.",
      en: "Various activities related to Wari, Dindi, abhang, bhajan and the saint tradition are conducted to introduce students to Warkari culture.",
    },
  },

  {
    icon: "📚",
    title: {
      mr: "शैक्षणिक उपक्रम",
      en: "Educational Activities",
    },
    image: "/images/educational-activities.jpg",
    short: {
      mr: "विद्यार्थ्यांच्या शालेय अभ्यासासाठी मार्गदर्शन व शैक्षणिक वातावरण.",
      en: "Study guidance and an educational environment for students.",
    },
    detail: {
      mr: "विद्यार्थ्यांच्या शालेय अभ्यासासाठी मार्गदर्शन आणि अभ्यासासाठी योग्य शैक्षणिक वातावरण उपलब्ध करून देण्याचा प्रयत्न केला जातो.",
      en: "Efforts are made to provide students with study guidance and a suitable educational environment for their school education.",
    },
  },

  {
    icon: "🎭",
    title: {
      mr: "सांस्कृतिक कार्यक्रम",
      en: "Cultural Programmes",
    },
    image: "/images/cultural-programmes.png",
    short: {
      mr: "गायन, भजन, वक्तृत्व, कथाकथन आणि विविध सांस्कृतिक कार्यक्रम.",
      en: "Singing, bhajan, public speaking, storytelling and various cultural programmes.",
    },
    detail: {
      mr: "गायन, भजन, वक्तृत्व, कथाकथन आणि विविध सांस्कृतिक कार्यक्रमांच्या माध्यमातून विद्यार्थ्यांच्या कलागुणांना व सहभागाला प्रोत्साहन दिले जाते.",
      en: "Students are encouraged to participate and develop their talents through singing, bhajan, public speaking, storytelling and various cultural programmes.",
    },
  },

  {
    icon: "🪔",
    title: {
      mr: "संत जयंती व धार्मिक उत्सव",
      en: "Saint Jayanti & Religious Festivals",
    },
    image: "/images/saint-jayanti-festivals.jpg",
    short: {
      mr: "संतांचे जीवन व विचार विद्यार्थ्यांपर्यंत पोहोचविणारे कार्यक्रम.",
      en: "Programmes introducing students to the lives and teachings of the saints.",
    },
    detail: {
      mr: "संतांचे जीवन, विचार आणि आध्यात्मिक मूल्ये विद्यार्थ्यांपर्यंत पोहोचविण्यासाठी संत जयंती व विविध धार्मिक उत्सवांचे आयोजन केले जाते.",
      en: "Saint Jayanti and various religious festivals are organized to introduce students to the lives, teachings and spiritual values of the saints.",
    },
  },
];

export const facilities: {
  icon: string;
  title: Bi;
  text: Bi;
}[] = [
  {
    icon: "🏠",
    title: { mr: "निवास", en: "Accommodation" },
    text: {
      mr: "विद्यार्थ्यांसाठी निवासाची व्यवस्था. (संपादनयोग्य)",
      en: "Accommodation for students. (Editable)",
    },
  },
  {
    icon: "🍲",
    title: { mr: "भोजन", en: "Meals" },
    text: {
      mr: "सात्त्विक भोजनाची व्यवस्था. (संपादनयोग्य)",
      en: "Simple satvik meals. (Editable)",
    },
  },
  {
    icon: "📖",
    title: { mr: "अभ्यासिका", en: "Study Room" },
    text: {
      mr: "अभ्यासासाठी शांत जागा. (संपादनयोग्य)",
      en: "A quiet place to study. (Editable)",
    },
  },
  {
    icon: "🪔",
    title: { mr: "संस्कार वर्ग", en: "Sanskar Classes" },
    text: {
      mr: "नियमित संस्कार वर्ग. (संपादनयोग्य)",
      en: "Regular sanskar classes. (Editable)",
    },
  },
  {
    icon: "🎭",
    title: { mr: "सांस्कृतिक उपक्रम", en: "Cultural Activities" },
    text: {
      mr: "सण व कार्यक्रमांत सहभाग. (संपादनयोग्य)",
      en: "Participation in festivals and programmes. (Editable)",
    },
  },
  {
    icon: "🏏",
    title: { mr: "क्रीडा", en: "Sports" },
    text: {
      mr: "मैदानी खेळांची संधी. (संपादनयोग्य)",
      en: "Opportunity for outdoor games. (Editable)",
    },
  },
  {
    icon: "📚",
    title: {
      mr: "ग्रंथालय / अभ्यास साहित्य",
      en: "Library / Study Material",
    },
    text: {
      mr: "ग्रंथ व अभ्यास साहित्य. (संपादनयोग्य)",
      en: "Books and study material. (Editable)",
    },
  },
  {
    icon: "🧹",
    title: { mr: "स्वच्छता", en: "Cleanliness" },
    text: {
      mr: "स्वच्छतेची नियमित काळजी. (संपादनयोग्य)",
      en: "Regular care for cleanliness. (Editable)",
    },
  },
  {
    icon: "➕",
    title: { mr: "इतर सुविधा", en: "Other Facilities" },
    text: {
      mr: "[प्रशासनाकडून भरावयाचे]",
      en: "[To be filled in by the administration]",
    },
  },
];

export const futurePlans: {
  title: Bi;
  status: "प्रस्तावित" | "सुरू" | "पूर्ण";
}[] = [
  {
    title: {
      mr: "गुरुकुलासाठी स्वतःची जागा",
      en: "Own land for the gurukul",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "विद्यार्थी निवास",
      en: "Student accommodation",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "भोजन कक्ष",
      en: "Dining hall",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "वर्गखोल्या",
      en: "Classrooms",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "अभ्यासिका",
      en: "Study room",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "प्रार्थना / ध्यान मंदिर",
      en: "Prayer and meditation hall",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "कीर्तन व सांस्कृतिक सभागृह",
      en: "Kirtan and cultural hall",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "क्रीडांगण",
      en: "Playground",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "पिण्याचे पाणी",
      en: "Drinking water",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "स्वच्छतागृहे",
      en: "Toilets",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "स्वयंपाकगृह",
      en: "Kitchen",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "ग्रंथालय",
      en: "Library",
    },
    status: "प्रस्तावित",
  },
  {
    title: {
      mr: "इतर आवश्यक सुविधा",
      en: "Other necessary facilities",
    },
    status: "प्रस्तावित",
  },
];

export const supportTypes: {
  icon: string;
  title: Bi;
  text: Bi;
}[] = [
  {
    icon: "🪙",
    title: { mr: "आर्थिक सहकार्य", en: "Financial Support" },
    text: {
      mr: "गुरुकुलाच्या दैनंदिन खर्चासाठी सहकार्य. (संपादनयोग्य)",
      en: "Support for the gurukul's daily expenses. (Editable)",
    },
  },
  {
    icon: "🍛",
    title: { mr: "अन्नदान / भोजन", en: "Annadan / Meals" },
    text: {
      mr: "विद्यार्थ्यांच्या भोजनासाठी सहकार्य. (संपादनयोग्य)",
      en: "Support for students' meals. (Editable)",
    },
  },
  {
    icon: "📘",
    title: { mr: "शैक्षणिक साहित्य", en: "Educational Material" },
    text: {
      mr: "वह्या, पुस्तके व साहित्य. (संपादनयोग्य)",
      en: "Notebooks, books and materials. (Editable)",
    },
  },
  {
    icon: "🎁",
    title: { mr: "वस्तुरूप मदत", en: "Support in Kind" },
    text: {
      mr: "आवश्यक वस्तूंच्या स्वरूपात मदत. (संपादनयोग्य)",
      en: "Help in the form of required goods. (Editable)",
    },
  },
  {
    icon: "⏳",
    title: { mr: "वेळ / सेवा", en: "Time / Service" },
    text: {
      mr: "शिकवणी, सेवा व स्वयंसेवा. (संपादनयोग्य)",
      en: "Teaching, service and volunteering. (Editable)",
    },
  },
];

export const bankDetails = [
  {
    key: "accountName",
    label: { mr: "खातेदाराचे नाव", en: "Account Holder Name" } as Bi,
    value: "Maa Narmada Adyatmik Shikshan Sansta",
    copyable: true,
  },
  {
    key: "accountNumber",
    label: { mr: "बँक खाते क्रमांक", en: "Bank Account Number" } as Bi,
    value: "50337323879",
    copyable: true,
  },
  {
    key: "bankName",
    label: { mr: "बँकेचे नाव", en: "Bank Name" } as Bi,
    value: "Indian Bank / Allahabad Bank (इंडियन बँक / अलाहाबाद बँक)",
    copyable: false,
  },
  {
    key: "ifsc",
    label: { mr: "IFSC कोड", en: "IFSC Code" } as Bi,
    value: "ALLA0213158",
    copyable: true,
  },
  {
    key: "branch",
    label: { mr: "शाखा", en: "Branch" } as Bi,
    value: "BULDHANA (बुलढाणा)",
    copyable: false,
  },
  {
    key: "branchAddress",
    label: { mr: "शाखेचा पत्ता", en: "Branch Address" } as Bi,
    value: "DSD City Mall, Chetanyawadi, Near Bank of India & Tehsil Office, Buldhana, Maharashtra - 443001",
    copyable: false,
  },
  {
    key: "upi",
    label: { mr: "अधिकृत UPI ID", en: "Official UPI ID" } as Bi,
    value: "917385501205@ybl",
    copyable: true,
  },
];

export interface CertificateItem {
  name: Bi;
  number?: string;
  numberLabel?: Bi;
  validity: string;
  subTitle?: Bi;
  pdf?: string;
  pdfName?: string;
  image?: string;
  badge?: Bi;
  isVerified?: boolean;
}

export const trustRegistrationDetails = {
  title: {
    mr: "संस्था व विश्वस्त नोंदणी प्रमाणपत्र (Trust Registration)",
    en: "Trust & Society Registration Certificate",
  } as Bi,
  subTitle: {
    mr: "मुंबई सार्वजनिक विश्वस्तव्यवस्था अधिनियम, १९५० — धर्मादाय आयुक्त कार्यालय, बुलडाणा",
    en: "Bombay Public Trusts Act, 1950 — Office of Charity Commissioner, Buldhana",
  } as Bi,
  trustNumber: "एफ-१५९८४ (बुलढाणा)",
  trustNumberEn: "F-15984 (Buldhana)",
  societyNumber: "महा-६७/२०१४ (बुलढाणा)",
  trustRegDate: "05/05/2014",
  societyRegDate: "01/02/2014",
  name: "माँ नर्मदा अध्यात्मिक शिक्षण संस्था, आजिसपूर ता. जि. बुलडाणा",
  president: "श्री संतोषराव गुलाबराव पवार",
  authority: {
    mr: "सहाय्यक धर्मादाय आयुक्त, बुलडाणा विभाग, बुलडाणा",
    en: "Assistant Charity Commissioner, Buldhana Division",
  } as Bi,
  pdfUrl: "/certificates/Trust_Registration_Certificate.pdf",
  pdfFileName: "Trust_Registration_Certificate_15984.pdf",
  page1Image: "/certificates/trust_registration_page_1.jpg",
  page2Image: "/certificates/trust_registration_page_2.jpg",
  validity: {
    mr: "कायमस्वरूपी अधिकृत नोंदणी (Official Registration)",
    en: "Official Registration (Permanent)",
  } as Bi,
};

export const form10AC = {
  title: {
    mr: "फॉर्म क्र. १०AC — कलम 80G तात्पुरती मंजुरी आदेश",
    en: "FORM NO. 10AC — Order for Provisional Approval under Section 80G",
  } as Bi,
  subRule: {
    mr: "(नियम 17A / 11AA अंतर्गत — आयकर विभाग, भारत सरकार)",
    en: "(See rule 17A/11AA — Income Tax Department, Govt. of India)",
  } as Bi,
  pdfUrl: "/certificates/FORM_NO_10AC.pdf",
  pdfFileName: "FORM_NO_10AC_80G_MAA_NARMADA.pdf",
  page1Image: "/certificates/form_10ac_page_1.jpg",
  page2Image: "/certificates/form_10ac_page_2.jpg",
  pan: "AAWAM9501F",
  name: "MAA NARMADA ADHYATMIK SANSTHA AJISPUR",
  activities: {
    mr: "धर्मादाय / सेवाभावी (Charitable)",
    en: "Charitable",
  } as Bi,
  address: "AT-Ajispur Po - Nandra Koli, Buldana H.O, Buldana, Maharashtra - 443001, INDIA",
  din: "AAWAM9501FF2025101",
  applicationNumber: "896593150250825",
  urn: "AAWAM9501FF20251",
  section: "12-Sub-clause (A) of clause (iv) of first proviso to sub-section (5) of section 80G",
  approvalDate: "01-09-2025",
  assessmentYears: {
    mr: "AY 2026-27 ते AY 2028-2029",
    en: "From AY 2026-27 to AY 2028-2029",
  } as Bi,
  authority: {
    mr: "प्रधान आयकर आयुक्त / आयकर आयुक्त (Principal Commissioner of Income Tax)",
    en: "Principal Commissioner of Income Tax / Commissioner of Income Tax",
  } as Bi,
};

export const panCardDetails = {
  title: {
    mr: "स्थायी लेखा संख्या कार्ड (PAN Card)",
    en: "Permanent Account Number Card (PAN)",
  } as Bi,
  panNumber: "AAWAM9501F",
  name: "MAA NARMADA ADHYATMIK SANSTHA AJISPUR",
  incorporationDate: "01/02/2014",
  authority: {
    mr: "आयकर विभाग — भारत सरकार",
    en: "Income Tax Department — Government of India",
  } as Bi,
  pdfUrl: "/certificates/PAN_CARD_AAWAM9501F.pdf",
  pdfFileName: "PAN_CARD_AAWAM9501F.pdf",
  imageUrl: "/certificates/pan_card.png",
  validity: {
    mr: "कायमस्वरूपी (Permanent)",
    en: "Permanent",
  } as Bi,
};

export const csrDetails = {
  title: {
    mr: "सीएसआर नोंदणी (CSR-1 Registration)",
    en: "CSR Registration (Form CSR-1)",
  } as Bi,
  subTitle: {
    mr: "कॉर्पोरेट व्यवहार मंत्रालय, भारत सरकार (Ministry of Corporate Affairs, Govt. of India)",
    en: "Ministry of Corporate Affairs, Office of the Registrar of Companies (ROC Delhi)",
  } as Bi,
  registrationNumber: "CSR00101084",
  srn: "AB9581986",
  approvalDate: "06/12/2025",
  applicationDate: "05/12/2025",
  pan: "AAWAM9501F",
  name: "MAA NARMADA ADHYATMIK SANSTHA AJISPUR",
  authority: {
    mr: "कंपनी निबंधक (Registrar of Companies), ROC Delhi",
    en: "Registrar of Companies, ROC Delhi",
  } as Bi,
  pdfUrl: "/certificates/CSR_Registration.pdf",
  pdfFileName: "CSR_Registration_CSR00101084.pdf",
  imageUrl: "/certificates/csr_registration_page_1.jpg",
  validity: {
    mr: "मान्यताप्राप्त / अधिकृत (Approved for CSR Activities)",
    en: "Approved for CSR Activities",
  } as Bi,
};

export const certificates: CertificateItem[] = [
  {
    name: {
      mr: "संस्था नोंदणी (Trust Registration)",
      en: "Trust Registration",
    } as Bi,
    number: "15 984 (बुलढाणा)",
    numberLabel: { mr: "नोंदणी क्रमांक", en: "Registration Number" } as Bi,
    validity: "अधिकृत नोंदणी (Official Registration)",
    subTitle: {
      mr: "मुंबई सार्वजनिक विश्वस्तव्यवस्था अधिनियम, १९५० — नोंदणी क्र. एफ-१५९८४",
      en: "Bombay Public Trusts Act, 1950 — Reg No. F-15984",
    } as Bi,
    pdf: "/certificates/Trust_Registration_Certificate.pdf",
    pdfName: "Trust_Registration_Certificate_15984.pdf",
    image: "/certificates/trust_registration_page_1.jpg",
    badge: { mr: "प्रमाणित प्रत उपलब्ध", en: "Verified Certificate Available" } as Bi,
    isVerified: true,
  },
  {
    name: { mr: "80G (फॉर्म क्र. १०AC)", en: "80G Provisional Approval (Form 10AC)" } as Bi,
    number: "AAWAM9501FF20251",
    numberLabel: { mr: "युनिक नोंदणी क्रमांक (URN)", en: "Unique Registration No. (URN)" } as Bi,
    validity: "AY 2026-27 ते AY 2028-2029 (01-09-2025)",
    subTitle: {
      mr: "आयकर विभाग मंजुरी आदेश (कलम 80G)",
      en: "Income Tax Approval Order (Section 80G)",
    } as Bi,
    pdf: "/certificates/FORM_NO_10AC.pdf",
    pdfName: "FORM_NO_10AC_80G.pdf",
    image: "/certificates/form_10ac_page_1.jpg",
    badge: { mr: "अधिकृत PDF उपलब्ध", en: "Official PDF Available" } as Bi,
    isVerified: true,
  },
  {
    name: { mr: "PAN (स्थायी खाते क्रमांक)", en: "PAN (Permanent Account Number)" } as Bi,
    number: "AAWAM9501F",
    numberLabel: { mr: "पॅन क्रमांक", en: "PAN Number" } as Bi,
    validity: "कायमस्वरूपी (Permanent)",
    subTitle: {
      mr: "गठन तारीख: 01/02/2014 | MAA NARMADA ADHYATMIK SANSTHA AJISPUR",
      en: "Formation Date: 01/02/2014 | MAA NARMADA ADHYATMIK SANSTHA AJISPUR",
    } as Bi,
    pdf: "/certificates/PAN_CARD_AAWAM9501F.pdf",
    pdfName: "PAN_CARD_AAWAM9501F.pdf",
    image: "/certificates/pan_card.png",
    badge: { mr: "अधिकृत PAN PDF उपलब्ध", en: "Official PAN PDF Available" } as Bi,
    isVerified: true,
  },
  {
    name: {
      mr: "CSR नोंदणी (CSR_Registration)",
      en: "CSR Registration (Form CSR-1)",
    } as Bi,
    number: "CSR00101084",
    numberLabel: { mr: "नोंदणी क्रमांक", en: "Registration Number" } as Bi,
    validity: "अधिकृत नोंदणी (Approved — 06/12/2025)",
    subTitle: {
      mr: "कॉर्पोरेट व्यवहार मंत्रालय (MCA) — CSR उपक्रमांसाठी मान्यता",
      en: "Ministry of Corporate Affairs (MCA) — Approved for CSR Activities",
    } as Bi,
    pdf: "/certificates/CSR_Registration.pdf",
    pdfName: "CSR_Registration_CSR00101084.pdf",
    image: "/certificates/csr_registration_page_1.jpg",
    badge: { mr: "अधिकृत CSR PDF उपलब्ध", en: "Official CSR PDF Available" } as Bi,
    isVerified: true,
  },
];

export const reports = [
  {
    year: "२०२५–२६",
    yearEn: "2025–26",
    file: "",
  },
  {
    year: "२०२६–२७",
    yearEn: "2026–27",
    file: "",
  },
];

export const videos: {
  title: Bi;
  date: string;
  youtubeId: string;
  description: Bi;
}[] = [];

/* =========================================================
   GALLERY CATEGORIES
   IMPORTANT:
   These values must match the category keys used by Admin Gallery.
   ========================================================= */

export const galleryCategories: Bi[] = [
  {
    mr: "सर्व",
    en: "All",
  },
  {
    mr: "सामान्य",
    en: "General",
  },
  {
    mr: "गुरुकुल",
    en: "Gurukul",
  },
  {
    mr: "विद्यार्थी",
    en: "Students",
  },
  {
    mr: "कीर्तन",
    en: "Kirtan",
  },
  {
    mr: "वारकरी कार्यक्रम",
    en: "Warkari Programmes",
  },
  {
    mr: "बाल संस्कार शिबिर",
    en: "Children's Camps",
  },
  {
    mr: "धार्मिक कार्यक्रम",
    en: "Religious Programmes",
  },
  {
    mr: "सांस्कृतिक कार्यक्रम",
    en: "Cultural Programmes",
  },
  {
    mr: "सामाजिक उपक्रम",
    en: "Social Initiatives",
  },
  {
    mr: "विशेष कार्यक्रम",
    en: "Special Programmes",
  },
];

/*
 * Gallery photos are loaded dynamically from the API.
 * Do not manually add uploaded photos here.
 */
export const galleryPhotos: {
  src: string;
  category: string;
  caption: Bi;
}[] = [
  {
    src: "/images/children-sanskar-camp.png",
    category: "बाल संस्कार शिबिर",
    caption: {
      mr: "बाल संस्कार शिबिर — ह.भ.प. संतोष महाराज पवार व गुरुकुलातील विद्यार्थी",
      en: "Children's Sanskar Camp — H.B.P. Santosh Maharaj Pawar with Gurukul students",
    },
  },
  {
    src: "/images/warkari-activities.png",
    category: "वारकरी कार्यक्रम",
    caption: {
      mr: "वारकरी उपक्रम — गुरुकुलातील विद्यार्थी मृदंग / पखवाज वादन व वारकरी संस्कार शिकताना",
      en: "Warkari Activities — Gurukul students learning Mridangam / Pakhawaj and Warkari traditions",
    },
  },
  {
    src: "/images/kirtan-festival.jpg",
    category: "कीर्तन",
    caption: {
      mr: "कीर्तन महोत्सव — ह.भ.प. संतोष महाराज पवार वीणा घेऊन कीर्तन सेवा सादर करताना",
      en: "Kirtan Festival — H.B.P. Santosh Maharaj Pawar performing Kirtan seva with Veena",
    },
  },
  {
    src: "/images/educational-activities.jpg",
    category: "विद्यार्थी",
    caption: {
      mr: "शैक्षणिक उपक्रम — गुरुकुलातील विद्यार्थी एकत्र प्रार्थना, नामस्मरण व संस्कार वर्गात सहभागी होताना",
      en: "Educational Activities — Gurukul students participating in prayer, namasmaran, and learning sessions",
    },
  },
  {
    src: "/images/cultural-programmes.png",
    category: "सांस्कृतिक कार्यक्रम",
    caption: {
      mr: "सांस्कृतिक कार्यक्रम — निवासी बालसंस्कार शिबीर व सांस्कृतिक उपक्रमात संत-महंतांचे मार्गदर्शन",
      en: "Cultural Programmes — Spiritual guidance and felicitation during Cultural & Sanskar Camp",
    },
  },
  {
    src: "/images/saint-jayanti-festivals.jpg",
    category: "धार्मिक कार्यक्रम",
    caption: {
      mr: "संत जयंती व धार्मिक उत्सव — ज्ञानेश्वरी पारायण व अखंड हरिनाम सप्ताहात मान्यवर व भाविक",
      en: "Saint Jayanti & Religious Festivals — Dnyaneshwari Parayan and Harinam Saptah celebration",
    },
  },
];

