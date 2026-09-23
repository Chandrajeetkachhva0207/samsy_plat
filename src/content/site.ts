/**
 * Seeded sample content for मा नर्मदा आध्यात्मिक शिक्षण संस्था.
 * EVERY string here is editable placeholder content and will later be served
 * from the admin panel (CMS). No statistics, registration numbers, bank
 * details or phone numbers are invented — placeholders are used instead.
 */

import type { Bi } from "@/lib/lang";

export const PLACEHOLDER = {
  phone: { mr: "7385501205", en: "7385501205" },
  email: { mr: "santoshgpawar2q07@gmail.com", en: "santoshgpawar2q07@gmail.com" },
  maps: { mr: "[अधिकृत Google Maps लोकेशन]", en: "[Official Google Maps location]" },
  whatsapp: "7385501205",
};

export const socialLinks = {
  youtube: "https://www.youtube.com/@user-qu8kv4fe3l72",
  facebook: "https://www.facebook.com/share/v/1LeUBrXMtD/",
  instagram: "https://www.instagram.com/santosh_maharaj_pawar_73?utm_source=qr&stkn=MWo0bWpzdHR0NGs3NQ%3D%3D",
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
  greeting: { mr: "॥ राम कृष्ण हरी ॥", en: "॥ Ram Krishna Hari ॥" } as Bi,
  greeting2: { mr: "॥ ज्ञानोबा – तुकाराम ॥", en: "॥ Dnyanoba – Tukaram ॥" } as Bi,
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
  { to: "/about", label: { mr: "आमच्याविषयी", en: "About" } },
  { to: "/founder", label: { mr: "संस्थापक अध्यक्ष", en: "Founder President" } },
  { to: "/gurukul", label: { mr: "गुरुकुल", en: "Gurukul" } },
  { to: "/activities", label: { mr: "उपक्रम", en: "Activities" } },
  { to: "/students", label: { mr: "विद्यार्थी व सुविधा", en: "Students & Facilities" } },
  { to: "/events", label: { mr: "कार्यक्रम", en: "Events" } },
  { to: "/gallery", label: { mr: "फोटो गॅलरी", en: "Photo Gallery" } },
  { to: "/videos", label: { mr: "व्हिडिओ", en: "Videos" } },
  { to: "/reports", label: { mr: "कार्य अहवाल", en: "Annual Reports" } },
  { to: "/support", label: { mr: "सहकार्य करा", en: "Support Us" } },
  { to: "/contact", label: { mr: "संपर्क", en: "Contact" } },
];

export const secondaryNav: { to: string; label: Bi }[] = [
  { to: "/future-plans", label: { mr: "भविष्यातील योजना", en: "Future Plans" } },
  { to: "/certificates", label: { mr: "संस्था नोंदणी / प्रमाणपत्रे", en: "Registration & Certificates" } },
  { to: "/privacy", label: { mr: "गोपनीयता धोरण", en: "Privacy Policy" } },
];

export const saints = [
  {
    src: "/images/vitthal-rakhumai.jpg",
    name: { mr: "श्री विठ्ठल – रखुमाई, पंढरपूर", en: "Shri Vitthal – Rakhumai, Pandharpur" } as Bi,
  },
  {
    src: "/images/sant-dnyaneshwar.jpg",
    name: { mr: "संत ज्ञानेश्वर महाराज, आळंदी", en: "Sant Dnyaneshwar Maharaj, Alandi" } as Bi,
  },
  {
    src: "/images/sant-tukaram.jpg",
    name: { mr: "संत तुकाराम महाराज, देहू", en: "Sant Tukaram Maharaj, Dehu" } as Bi,
  },
];

export const homeIntro: Bi = {
  mr: "आळंदी देवाची या संत ज्ञानेश्वर महाराजांच्या पावन भूमीत गेल्या १२ वर्षांपासून गुरुकुलाच्या माध्यमातून विद्यार्थ्यांना शालेय शिक्षणासोबत आध्यात्मिक संस्कार, वारकरी परंपरा, संतविचार, कीर्तन, प्रवचन आणि भारतीय संस्कृतीची ओळख करून देण्याचा प्रयत्न केला जात आहे.",
  en: "In Alandi Devachi, the sacred land of Sant Dnyaneshwar Maharaj, the gurukul has for the past 12 years sought to give students school education together with spiritual values, the Warkari tradition, the thought of the saints, kirtan, pravachan and an introduction to Indian culture.",
};

export const keyActivities: { icon: string; title: Bi }[] = [
  { icon: "📖", title: { mr: "शालेय शिक्षण", en: "School Education" } },
  { icon: "🪔", title: { mr: "आध्यात्मिक शिक्षण", en: "Spiritual Education" } },
  { icon: "🚩", title: { mr: "वारकरी संस्कार", en: "Warkari Values" } },
  { icon: "🧒", title: { mr: "बाल संस्कार शिबिर", en: "Children's Sanskar Camps" } },
  { icon: "🎶", title: { mr: "कीर्तन व प्रवचन", en: "Kirtan & Pravachan" } },
  { icon: "🎭", title: { mr: "सांस्कृतिक कार्यक्रम", en: "Cultural Programmes" } },
  { icon: "🤝", title: { mr: "सामाजिक उपक्रम", en: "Social Initiatives" } },
];

export const timeline: { year: Bi; text: Bi }[] = [
  {
    year: { mr: "सुरुवात", en: "Beginning" },
    text: {
      mr: "आळंदी देवाची येथे थोड्या विद्यार्थ्यांसह गुरुकुलाची नम्र सुरुवात. (संपादनयोग्य मजकूर)",
      en: "A humble beginning of the gurukul at Alandi Devachi with a few students. (Editable text)",
    },
  },
  {
    year: { mr: "प्रारंभीची वर्षे", en: "Early years" },
    text: {
      mr: "शालेय अभ्यासासोबत प्रार्थना, नामस्मरण व संस्कार वर्गांची नियमित रचना. (संपादनयोग्य मजकूर)",
      en: "A regular routine of prayer, namasmaran and sanskar classes alongside school study. (Editable text)",
    },
  },
  {
    year: { mr: "मधली वर्षे", en: "Middle years" },
    text: {
      mr: "कीर्तन, प्रवचन व बाल संस्कार शिबिरांचे आयोजन. (संपादनयोग्य मजकूर)",
      en: "Kirtan, pravachan and children's sanskar camps were organised. (Editable text)",
    },
  },
  {
    year: { mr: "आज", en: "Today" },
    text: {
      mr: "गुरुकुलाची सेवा सुरू असून भविष्यातील सुविधा उभारण्याचा संकल्प आहे. (संपादनयोग्य मजकूर)",
      en: "The gurukul's service continues, with a resolve to build future facilities. (Editable text)",
    },
  },
];

export const about = {
  sections: [
    {
      title: { mr: "स्थापना", en: "Establishment" },
      body: {
        mr: "संस्थेची स्थापना शिक्षण, संस्कार व अध्यात्म या तीन उद्दिष्टांनी करण्यात आली. (संपादनयोग्य मजकूर — अधिकृत तपशील प्रशासनाकडून भरले जातील.)",
        en: "The institution was established with three aims: education, values and spirituality. (Editable text — official details to be filled in by the administration.)",
      },
    },
    {
      title: { mr: "उद्दिष्टे", en: "Objectives" },
      body: {
        mr: "विद्यार्थ्यांना शालेय शिक्षणासोबत आध्यात्मिक संस्कार देणे, वारकरी परंपरेची ओळख करून देणे आणि भारतीय संस्कृतीविषयी आदर निर्माण करणे. (संपादनयोग्य मजकूर)",
        en: "To give students spiritual values along with school education, introduce them to the Warkari tradition, and nurture respect for Indian culture. (Editable text)",
      },
    },
    {
      title: { mr: "१२ वर्षांचा प्रवास", en: "A journey of 12 years" },
      body: {
        mr: "गेल्या १२ वर्षांपासून आळंदी देवाची येथे गुरुकुलाचे कार्य नम्रपणे सुरू आहे. (संपादनयोग्य मजकूर)",
        en: "For the past 12 years the gurukul's work has continued humbly at Alandi Devachi. (Editable text)",
      },
    },
    {
      title: { mr: "आळंदीतील कार्य", en: "Work in Alandi" },
      body: {
        mr: "संत ज्ञानेश्वर महाराजांच्या पावन भूमीत विद्यार्थ्यांसाठी अभ्यास, प्रार्थना व सेवा यांचे वातावरण जपले जाते. (संपादनयोग्य मजकूर)",
        en: "In this sacred land, an atmosphere of study, prayer and service is maintained for the students. (Editable text)",
      },
    },
    {
      title: { mr: "शिक्षण व अध्यात्माचा संगम", en: "School education with spirituality" },
      body: {
        mr: "शाळेचा अभ्यास आणि आध्यात्मिक संस्कार एकत्र चालावेत असा प्रयत्न असतो. (संपादनयोग्य मजकूर)",
        en: "The effort is that school study and spiritual practice go hand in hand. (Editable text)",
      },
    },
    {
      title: { mr: "भविष्यातील उद्दिष्टे", en: "Future goals" },
      body: {
        mr: "गुरुकुलासाठी स्वतःची जागा व आवश्यक सुविधा उभारणे हे प्रस्तावित उद्दिष्ट आहे. (संपादनयोग्य मजकूर)",
        en: "Acquiring the gurukul's own land and building the necessary facilities is a proposed goal. (Editable text)",
      },
    },
  ],
  verified: {
    mr: "पडताळलेली माहिती: [प्रशासनाकडून भरावयाचे]",
    en: "Verified information: [to be filled in by the administration]",
  } as Bi,
};

export const founderPage = {
  intro: {
    mr: "ह.भ.प. संतोष महाराज पवार हे संस्थेचे संस्थापक अध्यक्ष असून त्यांच्या मार्गदर्शनाखाली गुरुकुलाचे कार्य चालते. (संपादनयोग्य मजकूर)",
    en: "H.B.P. Santosh Maharaj Pawar is the Founder President of the institution; the gurukul functions under his guidance. (Editable text)",
  } as Bi,
  role: {
    mr: "संस्थेतील भूमिका: गुरुकुलाचे संचालन, विद्यार्थ्यांचे मार्गदर्शन, कीर्तन-प्रवचन सेवा व संस्थेचे प्रशासकीय कार्य. (संपादनयोग्य मजकूर)",
    en: "Role in the institution: running the gurukul, guiding students, kirtan-pravachan service and the administration of the trust. (Editable text)",
  } as Bi,
  work: {
    mr: "कार्याचा थोडक्यात आढावा येथे प्रशासनाकडून भरला जाईल. कोणतेही आकडे किंवा दावे न पडताळता प्रसिद्ध केले जाणार नाहीत.",
    en: "A brief summary of the work will be filled in by the administration. No figures or claims will be published without verification.",
  } as Bi,
  photoNote: {
    mr: "अधिकृत छायाचित्र येथे लावले जाईल (मूळ छायाचित्र, कोणताही बदल न करता).",
    en: "The official photograph will be placed here (original, unaltered).",
  } as Bi,
};

export const gurukul = {
  identity: {
    mr: "मा नर्मदा आध्यात्मिक गुरुकुल हे आळंदी देवाची येथील निवासी स्वरूपाचे गुरुकुल आहे, जेथे शालेय शिक्षणासोबत आध्यात्मिक संस्कार दिले जातात. (संपादनयोग्य मजकूर)",
    en: "Maa Narmada Adhyatmik Gurukul at Alandi Devachi is a residential gurukul where spiritual values are imparted along with school education. (Editable text)",
  } as Bi,
  eduEnv: {
    mr: "शैक्षणिक वातावरण: नियमित अभ्यास, अभ्यास मार्गदर्शन व शिस्तबद्ध दिनक्रम. (संपादनयोग्य मजकूर)",
    en: "Educational environment: regular study, study guidance and a disciplined routine. (Editable text)",
  } as Bi,
  spiritualEnv: {
    mr: "आध्यात्मिक वातावरण: प्रार्थना, नामस्मरण, संतविचार व कीर्तन-सराव. (संपादनयोग्य मजकूर)",
    en: "Spiritual environment: prayer, namasmaran, the thought of the saints and kirtan practice. (Editable text)",
  } as Bi,
  routine: [
    { time: "[वेळ]", item: { mr: "प्रार्थना", en: "Prayer" } },
    { time: "[वेळ]", item: { mr: "नामस्मरण", en: "Namasmaran" } },
    { time: "[वेळ]", item: { mr: "शालेय अभ्यास", en: "School study" } },
    { time: "[वेळ]", item: { mr: "भोजन व विश्रांती", en: "Meal and rest" } },
    { time: "[वेळ]", item: { mr: "संस्कार वर्ग", en: "Sanskar class" } },
    { time: "[वेळ]", item: { mr: "कीर्तन-सराव", en: "Kirtan practice" } },
    { time: "[वेळ]", item: { mr: "स्वाध्याय व शयन", en: "Self-study and rest" } },
  ],
  method: {
    mr: "कार्यपद्धती: विद्यार्थ्यांच्या वयानुसार अभ्यास व संस्कार यांचे नियोजन केले जाते. (संपादनयोग्य मजकूर)",
    en: "Working method: study and sanskar are planned according to the age of the students. (Editable text)",
  } as Bi,
};

export const activities: { icon: string; title: Bi; short: Bi; detail: Bi }[] = [
  {
    icon: "📚",
    title: { mr: "शालेय शिक्षण", en: "School Education" },
    short: { mr: "नियमित शालेय अभ्यास व उपस्थिती.", en: "Regular school study and attendance." },
    detail: {
      mr: "विद्यार्थ्यांचा शालेय अभ्यास नियमित व्हावा यासाठी दैनंदिन नियोजन केले जाते. (संपादनयोग्य मजकूर)",
      en: "Daily planning is done so that the students' school study stays regular. (Editable text)",
    },
  },
  {
    icon: "✍️",
    title: { mr: "अभ्यास मार्गदर्शन", en: "Study Guidance" },
    short: { mr: "अभ्यासात मदत व मार्गदर्शन.", en: "Help and guidance in study." },
    detail: {
      mr: "अभ्यासात अडचण असलेल्या विद्यार्थ्यांना वैयक्तिक मार्गदर्शन दिले जाते. (संपादनयोग्य मजकूर)",
      en: "Students who find study difficult receive individual guidance. (Editable text)",
    },
  },
  {
    icon: "🙏",
    title: { mr: "प्रार्थना", en: "Prayer" },
    short: { mr: "दिवसाची सुरुवात प्रार्थनेने.", en: "The day begins with prayer." },
    detail: {
      mr: "सकाळ व सायंकाळी सामूहिक प्रार्थना घेतली जाते. (संपादनयोग्य मजकूर)",
      en: "Collective prayer is held in the morning and evening. (Editable text)",
    },
  },
  {
    icon: "📿",
    title: { mr: "नामस्मरण", en: "Namasmaran" },
    short: { mr: "नित्य नामस्मरणाचा अभ्यास.", en: "Daily practice of namasmaran." },
    detail: {
      mr: "वारकरी परंपरेनुसार नित्य नामस्मरणाचा सराव केला जातो. (संपादनयोग्य मजकूर)",
      en: "Daily namasmaran is practised in keeping with the Warkari tradition. (Editable text)",
    },
  },
  {
    icon: "🪔",
    title: { mr: "संतविचार", en: "Thought of the Saints" },
    short: { mr: "संतांच्या शिकवणुकीचा परिचय.", en: "Introduction to the saints' teachings." },
    detail: {
      mr: "ज्ञानेश्वरी, गाथा व अभंगांतील विचार सोप्या भाषेत सांगितले जातात. (संपादनयोग्य मजकूर)",
      en: "Thoughts from Dnyaneshwari, Gatha and abhangs are explained simply. (Editable text)",
    },
  },
  {
    icon: "🚩",
    title: { mr: "वारकरी परंपरा", en: "Warkari Tradition" },
    short: { mr: "परंपरेची ओळख व आचरण.", en: "Learning and living the tradition." },
    detail: {
      mr: "वारी, भजन व परंपरेतील आचरण यांची ओळख करून दिली जाते. (संपादनयोग्य मजकूर)",
      en: "Wari, bhajan and the conduct of the tradition are introduced. (Editable text)",
    },
  },
  {
    icon: "🎵",
    title: { mr: "कीर्तन", en: "Kirtan" },
    short: { mr: "कीर्तन सेवा व सराव.", en: "Kirtan service and practice." },
    detail: {
      mr: "विद्यार्थ्यांना कीर्तनाचा सराव व सेवा करण्याची संधी दिली जाते. (संपादनयोग्य मजकूर)",
      en: "Students are given the opportunity to practise and offer kirtan. (Editable text)",
    },
  },
  {
    icon: "🗣️",
    title: { mr: "प्रवचन", en: "Pravachan" },
    short: { mr: "संतवाङ्मयावर प्रवचन.", en: "Discourses on the saints' writings." },
    detail: {
      mr: "वेळोवेळी प्रवचनाचे आयोजन केले जाते. (संपादनयोग्य मजकूर)",
      en: "Pravachans are arranged from time to time. (Editable text)",
    },
  },
  {
    icon: "🧒",
    title: { mr: "बाल संस्कार शिबिरे", en: "Children's Sanskar Camps" },
    short: { mr: "मुलांसाठी संस्कार शिबिरे.", en: "Sanskar camps for children." },
    detail: {
      mr: "सुट्टीच्या काळात बाल संस्कार शिबिरे घेतली जातात. (संपादनयोग्य मजकूर)",
      en: "Sanskar camps are held during holidays. (Editable text)",
    },
  },
  {
    icon: "🎭",
    title: { mr: "सांस्कृतिक कार्यक्रम", en: "Cultural Programmes" },
    short: { mr: "सण व सांस्कृतिक उपक्रम.", en: "Festivals and cultural activities." },
    detail: {
      mr: "सण-उत्सव व सांस्कृतिक कार्यक्रम साजरे केले जातात. (संपादनयोग्य मजकूर)",
      en: "Festivals and cultural programmes are celebrated. (Editable text)",
    },
  },
  {
    icon: "🤝",
    title: { mr: "सामाजिक उपक्रम", en: "Social Initiatives" },
    short: { mr: "समाजासाठी सेवा उपक्रम.", en: "Service activities for society." },
    detail: {
      mr: "स्वच्छता, वृक्षारोपण व सेवाभावी उपक्रम राबवले जातात. (संपादनयोग्य मजकूर)",
      en: "Cleanliness drives, tree planting and service activities are undertaken. (Editable text)",
    },
  },
];

export const facilities: { icon: string; title: Bi; text: Bi }[] = [
  { icon: "🏠", title: { mr: "निवास", en: "Accommodation" }, text: { mr: "विद्यार्थ्यांसाठी निवासाची व्यवस्था. (संपादनयोग्य)", en: "Accommodation for students. (Editable)" } },
  { icon: "🍲", title: { mr: "भोजन", en: "Meals" }, text: { mr: "सात्त्विक भोजनाची व्यवस्था. (संपादनयोग्य)", en: "Simple satvik meals. (Editable)" } },
  { icon: "📖", title: { mr: "अभ्यासिका", en: "Study Room" }, text: { mr: "अभ्यासासाठी शांत जागा. (संपादनयोग्य)", en: "A quiet place to study. (Editable)" } },
  { icon: "🪔", title: { mr: "संस्कार वर्ग", en: "Sanskar Classes" }, text: { mr: "नियमित संस्कार वर्ग. (संपादनयोग्य)", en: "Regular sanskar classes. (Editable)" } },
  { icon: "🎭", title: { mr: "सांस्कृतिक उपक्रम", en: "Cultural Activities" }, text: { mr: "सण व कार्यक्रमांत सहभाग. (संपादनयोग्य)", en: "Participation in festivals and programmes. (Editable)" } },
  { icon: "🏏", title: { mr: "क्रीडा", en: "Sports" }, text: { mr: "मैदानी खेळांची संधी. (संपादनयोग्य)", en: "Opportunity for outdoor games. (Editable)" } },
  { icon: "📚", title: { mr: "ग्रंथालय / अभ्यास साहित्य", en: "Library / Study Material" }, text: { mr: "ग्रंथ व अभ्यास साहित्य. (संपादनयोग्य)", en: "Books and study material. (Editable)" } },
  { icon: "🧹", title: { mr: "स्वच्छता", en: "Cleanliness" }, text: { mr: "स्वच्छतेची नियमित काळजी. (संपादनयोग्य)", en: "Regular care for cleanliness. (Editable)" } },
  { icon: "➕", title: { mr: "इतर सुविधा", en: "Other Facilities" }, text: { mr: "[प्रशासनाकडून भरावयाचे]", en: "[To be filled in by the administration]" } },
];

export const futurePlans: { title: Bi; status: "प्रस्तावित" | "सुरू" | "पूर्ण" }[] = [
  { title: { mr: "गुरुकुलासाठी स्वतःची जागा", en: "Own land for the gurukul" }, status: "प्रस्तावित" },
  { title: { mr: "विद्यार्थी निवास", en: "Student accommodation" }, status: "प्रस्तावित" },
  { title: { mr: "भोजन कक्ष", en: "Dining hall" }, status: "प्रस्तावित" },
  { title: { mr: "वर्गखोल्या", en: "Classrooms" }, status: "प्रस्तावित" },
  { title: { mr: "अभ्यासिका", en: "Study room" }, status: "प्रस्तावित" },
  { title: { mr: "प्रार्थना / ध्यान मंदिर", en: "Prayer and meditation hall" }, status: "प्रस्तावित" },
  { title: { mr: "कीर्तन व सांस्कृतिक सभागृह", en: "Kirtan and cultural hall" }, status: "प्रस्तावित" },
  { title: { mr: "क्रीडांगण", en: "Playground" }, status: "प्रस्तावित" },
  { title: { mr: "पिण्याचे पाणी", en: "Drinking water" }, status: "प्रस्तावित" },
  { title: { mr: "स्वच्छतागृहे", en: "Toilets" }, status: "प्रस्तावित" },
  { title: { mr: "स्वयंपाकगृह", en: "Kitchen" }, status: "प्रस्तावित" },
  { title: { mr: "ग्रंथालय", en: "Library" }, status: "प्रस्तावित" },
  { title: { mr: "इतर आवश्यक सुविधा", en: "Other necessary facilities" }, status: "प्रस्तावित" },
];

export const supportTypes: { icon: string; title: Bi; text: Bi }[] = [
  { icon: "🪙", title: { mr: "आर्थिक सहकार्य", en: "Financial Support" }, text: { mr: "गुरुकुलाच्या दैनंदिन खर्चासाठी सहकार्य. (संपादनयोग्य)", en: "Support for the gurukul's daily expenses. (Editable)" } },
  { icon: "🍛", title: { mr: "अन्नदान / भोजन", en: "Annadan / Meals" }, text: { mr: "विद्यार्थ्यांच्या भोजनासाठी सहकार्य. (संपादनयोग्य)", en: "Support for students' meals. (Editable)" } },
  { icon: "📘", title: { mr: "शैक्षणिक साहित्य", en: "Educational Material" }, text: { mr: "वह्या, पुस्तके व साहित्य. (संपादनयोग्य)", en: "Notebooks, books and materials. (Editable)" } },
  { icon: "🎁", title: { mr: "वस्तुरूप मदत", en: "Support in Kind" }, text: { mr: "आवश्यक वस्तूंच्या स्वरूपात मदत. (संपादनयोग्य)", en: "Help in the form of required goods. (Editable)" } },
  { icon: "⏳", title: { mr: "वेळ / सेवा", en: "Time / Service" }, text: { mr: "शिकवणी, सेवा व स्वयंसेवा. (संपादनयोग्य)", en: "Teaching, service and volunteering. (Editable)" } },
];

export const bankDetails = [
  { label: { mr: "बँकेचे नाव", en: "Bank Name" } as Bi, value: "[Bank Name]" },
  { label: { mr: "खातेदाराचे नाव", en: "Account Name" } as Bi, value: "[Account Name]" },
  { label: { mr: "खाते क्रमांक", en: "A/C No." } as Bi, value: "[A/C No.]" },
  { label: { mr: "IFSC", en: "IFSC" } as Bi, value: "[IFSC]" },
  { label: { mr: "UPI ID", en: "UPI ID" } as Bi, value: "[UPI ID]" },
];

export const certificates = [
  { name: { mr: "संस्था नोंदणी (Trust Registration)", en: "Trust Registration" } as Bi, number: "[नोंदणी क्रमांक]", validity: "[वैधता]" },
  { name: { mr: "12A", en: "12A" } as Bi, number: "[क्रमांक]", validity: "[वैधता]" },
  { name: { mr: "80G", en: "80G" } as Bi, number: "[क्रमांक]", validity: "[वैधता]" },
  { name: { mr: "PAN", en: "PAN" } as Bi, number: "[क्रमांक]", validity: "[वैधता]" },
];

export const reports = [
  { year: "२०२५–२६", yearEn: "2025–26", file: "" },
  { year: "२०२६–२७", yearEn: "2026–27", file: "" },
];

export const videos: { title: Bi; date: string; youtubeId: string; description: Bi }[] = [];

export const galleryCategories: Bi[] = [
  { mr: "सर्व", en: "All" },
  { mr: "गुरुकुल", en: "Gurukul" },
  { mr: "विद्यार्थी", en: "Students" },
  { mr: "कीर्तन", en: "Kirtan" },
  { mr: "वारकरी कार्यक्रम", en: "Warkari programmes" },
  { mr: "बाल संस्कार शिबिर", en: "Children's camps" },
  { mr: "धार्मिक कार्यक्रम", en: "Religious programmes" },
  { mr: "सांस्कृतिक कार्यक्रम", en: "Cultural programmes" },
  { mr: "सामाजिक उपक्रम", en: "Social initiatives" },
  { mr: "विशेष कार्यक्रम", en: "Special programmes" },
];

export const galleryPhotos: { src: string; category: string; caption: Bi }[] = [];
