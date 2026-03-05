// i18n logic
const translations = {
    en: {
        app_title: "Public Issue Reporting",
        welcome: "Welcome to Lonere Grampanchayat Services",
        subtitle: "Report and track civic issues easily.",
        categories: "Categories",
        cleanliness: "Cleanliness Issues",
        roads: "Road Problems",
        food: "Food Safety",
        gardens: "Public Gardens",
        sign_in: "Sign In",
        raise_complaint: "Raise Complaint",
        home: "Home",
        complaint: "Complaint",
        explore: "Explore",
        data: "Data",
        recent_works: "Completed Works",
        hello: "Hello",
        my_complaints: "My Complaints",
        logout: "Log Out",
        status_pending: "Pending",
        status_in_progress: "In Progress",
        status_completed: "Completed"
    },
    mr: {
        app_title: "सार्वजनिक समस्या अहवाल",
        welcome: "लोणेरे ग्रामपंचायत सेवांमध्ये आपले स्वागत आहे",
        subtitle: "नागरी समस्यांची सहज नोंदणी करा आणि मागोवा घ्या.",
        categories: "श्रेण्या",
        cleanliness: "स्वच्छता समस्या",
        roads: "रस्त्यांच्या समस्या",
        food: "अन्न सुरक्षा",
        gardens: "सार्वजनिक उद्याने",
        sign_in: "साइन इन करा",
        raise_complaint: "तक्रार नोंदवा",
        home: "मुख्यपृष्ठ",
        complaint: "तक्रार",
        explore: "शोधा",
        data: "डेटा",
        recent_works: "पूर्ण झालेली कामे",
        hello: "नमस्कार",
        my_complaints: "माझ्या तक्रारी",
        logout: "बाहेर पडा",
        status_pending: "प्रलंबित",
        status_in_progress: "प्रगतीपथावर",
        status_completed: "पूर्ण झाले"
    }
};

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
        const currentLang = localStorage.getItem('lang') || 'en';
        langSelect.value = currentLang;
        setLanguage(currentLang);

        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});
