
import type { Category, AspectRatio, FestivalType, WeddingType, WeddingStyle, Language } from './types';

export const CATEGORIES: Category[] = ['Birthday', 'Festival', 'Wedding', 'Custom'];

export const FESTIVALS: { type: FestivalType; title: string; description: string }[] = [
    { type: 'Christmas', title: 'Christmas', description: 'Spread holiday cheer with a festive design.' },
    { type: 'Diwali', title: 'Diwali', description: 'Celebrate the festival of lights with brightness.' },
    { type: 'Eid', title: 'Eid', description: 'Share blessings with an elegant Eid Mubarak poster.' },
    { type: 'New Year', title: 'New Year', description: 'Welcome the new year with a vibrant celebration.' },
    { type: 'Halloween', title: 'Halloween', description: 'Create a spooky and fun poster for trick-or-treating.' },
    { type: 'Holi', title: 'Holi', description: 'Celebrate the festival of colors with a splashy design.' },
    { type: 'Raksha Bandhan', title: 'Raksha Bandhan', description: 'Honor the sibling bond with a heartfelt poster.' },
    { type: 'Navratri', title: 'Navratri', description: 'Embrace the nine nights of dance and devotion.' },
    { type: 'Dussehra', title: 'Dussehra', description: 'Celebrate the victory of good over evil.' },
    { type: 'Ram Navami', title: 'Ram Navami', description: 'Commemorate the birth of Lord Rama.' },
    { type: 'Ganesh Chaturthi', title: 'Ganesh Chaturthi', description: 'Welcome Lord Ganesha with joy and devotion.' },
    { type: 'Janmashtami', title: 'Janmashtami', description: 'Celebrate the birth of Lord Krishna.' },
    { type: 'Makar Sankranti', title: 'Makar Sankranti', description: 'Celebrate the harvest season and kite flying.' },
    { type: 'Onam', title: 'Onam', description: 'Embrace the spirit of the grand harvest festival.' },
    { type: 'Gurpurab', title: 'Gurpurab', description: 'Commemorate the birth of Guru Nanak Dev Ji.' },
    { type: 'Maha Shivratri', title: 'Maha Shivratri', description: 'Honor Lord Shiva on this auspicious night.' },
    { type: 'Baisakhi', title: 'Baisakhi', description: 'Celebrate the harvest festival and Sikh New Year.' },
    { type: 'Lohri', title: 'Lohri', description: 'Celebrate the winter harvest with bonfires and joy.' },
    { type: 'Karwa Chauth', title: 'Karwa Chauth', description: 'Celebrate the bond of marriage and love.' },
    { type: 'Bhai Dooj', title: 'Bhai Dooj', description: 'Cherish the special bond between siblings.' },
    { type: 'Republic Day', title: 'Republic Day', description: 'Celebrate the spirit of the Indian constitution.' },
    { type: 'Independence Day', title: 'Independence Day', description: 'Honor the day of India\'s freedom.' },
    { type: 'Gandhi Jayanti', title: 'Gandhi Jayanti', description: 'Commemorate the birth of the Father of the Nation.' },
    { type: 'Ugadi', title: 'Ugadi', description: 'Celebrate the Telugu New Year with new beginnings.' },
    { type: 'Varalakshmi Vratam', title: 'Varalakshmi Vratam', description: 'Seek blessings for prosperity and well-being.' },
    { type: 'Bathukamma', title: 'Bathukamma', description: 'Celebrate the vibrant floral festival of Telangana.' },
    { type: 'Akshaya Tritiya', title: 'Akshaya Tritiya', description: 'Mark the day of eternal prosperity and success.' },
    { type: 'Poleramma Jatara', title: 'Poleramma Jatara', description: 'Celebrate the vibrant local village festival.' },
    { type: 'Gangamma Jatara', title: 'Gangamma Jatara', description: 'Honor the goddess with grand celebrations.' },
    { type: 'Thirunakshatram / Kalyanam', title: 'Thirunakshatram / Kalyanam', description: 'Commemorate a divine celestial wedding.' },
    { type: 'Chhath Puja', title: 'Chhath Puja', description: 'Worship the Sun God with devotion and rituals.' },
    { type: 'Karthika Masam', title: 'Karthika Masam', description: 'Embrace the auspicious month of lights.' },
    { type: 'Rath Yatra', title: 'Rath Yatra', description: 'Celebrate the grand chariot festival journey.' },
    { type: 'Sankranti / Pongal', title: 'Sankranti / Pongal', description: 'Celebrate the bountiful harvest festival.' },
    { type: 'Vasant Panchami', title: 'Vasant Panchami', description: 'Welcome the spring season and worship knowledge.' },
    { type: 'Bhogi', title: 'Bhogi', description: 'Begin the festivities by cleansing and renewing.' },
    { type: 'Other', title: 'Other Festival', description: 'For any other celebration you have in mind.' },
];

export const ASPECT_RATIOS: { label: string; value: AspectRatio; width: number; height: number; dimensions: string; }[] = [
  { label: 'Story (9:16)', value: '9:16', width: 9, height: 16, dimensions: '1080x1920px' },
  { label: 'Portrait (4:5)', value: '4:5', width: 4, height: 5, dimensions: '1080x1350px' },
  { label: 'Portrait (3:4)', value: '3:4', width: 3, height: 4, dimensions: '1080x1440px' },
  { label: 'Square (1:1)', value: '1:1', width: 1, height: 1, dimensions: '1080x1080px' },
  { label: 'Landscape (4:3)', value: '4:3', width: 4, height: 3, dimensions: '1280x960px' },
  { label: 'Widescreen (16:9)', value: '16:9', width: 16, height: 9, dimensions: '1920x1080px' },
  { label: 'Print (A4)', value: 'A4', width: 210, height: 297, dimensions: '2480x3508px' },
];

export const WEDDING_STYLES: { style: WeddingStyle; title: string; description: string }[] = [
    { style: 'Traditional Indian', title: 'Traditional Indian', description: 'Vibrant and culturally rich designs for Indian weddings.' },
    { style: 'Modern Minimalist', title: 'Modern & Minimalist', description: 'Clean, elegant, and sophisticated poster styles.' },
    { style: 'Christian Wedding', title: 'Christian Wedding', description: 'Classic and graceful designs for church weddings.' },
    { style: 'Custom Style', title: 'Custom Style', description: 'Describe your own unique wedding theme or style.' },
];

export const WEDDING_TYPES: { type: WeddingType; title: string; description: string; styleCategories: ('indian' | 'western' | 'universal')[] }[] = [
    // Universal Events (for all styles)
    { type: 'Invitation', title: 'Wedding Invitation', description: 'Formally invite guests to the main event.', styleCategories: ['universal'] },
    { type: 'Save the Date', title: 'Save the Date', description: 'Announce your wedding day in advance.', styleCategories: ['universal'] },
    { type: 'Engagement', title: 'Engagement', description: 'Celebrate the official beginning of your journey.', styleCategories: ['universal'] },
    { type: 'Reception Party', title: 'Reception Party', description: 'Announce the grand post-wedding celebration.', styleCategories: ['universal'] },
    { type: 'Anniversary', title: 'Anniversary', description: 'Commemorate another year of love.', styleCategories: ['universal'] },
    { type: 'Custom', title: 'Custom Event', description: 'For any other unique wedding celebration.', styleCategories: ['universal'] },

    // Western / Modern Events
    { type: 'Bachelorette Party', title: 'Bachelorette Party', description: 'For the bride\'s fun-filled pre-wedding party.', styleCategories: ['western'] },
    { type: 'Bachelor Party', title: 'Bachelor Party', description: 'For the groom\'s fun-filled pre-wedding party.', styleCategories: ['western'] },
    { type: 'Bridal Shower', title: 'Bridal Shower', description: 'Celebrate the bride-to-be with gifts and games.', styleCategories: ['western'] },

    // Traditional Indian Events
    { type: 'Roka Ceremony', title: 'Roka Ceremony', description: 'For the first official pre-wedding ritual.', styleCategories: ['indian'] },
    { type: 'Tilak Ceremony', title: 'Tilak / Sagai', description: 'Mark the auspicious acceptance ceremony.', styleCategories: ['indian'] },
    { type: 'Sangeet Night', title: 'Sangeet / Garba', description: 'For a night of music, dance, and celebration.', styleCategories: ['indian'] },
    { type: 'Mehendi Function', title: 'Mehendi Function', description: 'A beautiful poster for the henna celebration.', styleCategories: ['indian'] },
    { type: 'Haldi Ceremony', title: 'Haldi Ceremony', description: 'Capture the vibrant joy of the Haldi ritual.', styleCategories: ['indian'] },
    { type: 'Baraat', title: 'Baraat Procession', description: 'Announce the groom\'s grand wedding procession.', styleCategories: ['indian'] },
    { type: 'Jaimala Ceremony', title: 'Jaimala / Varmala', description: 'Highlight the iconic garland exchange moment.', styleCategories: ['indian'] },
];

export const WEDDING_WISHES: string[] = [
    "Wishing you a lifetime of love and happiness.",
    "May the years ahead be filled with lasting joy.",
    "Two souls, one heart. Congratulations!",
    "Best wishes on this wonderful journey.",
    "Join us in celebrating their love.",
    "A toast to the happy couple!",
];

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
    { code: 'English', name: 'English', nativeName: 'English' },
    { code: 'Spanish', name: 'Spanish', nativeName: 'Español' },
    { code: 'French', name: 'French', nativeName: 'Français' },
    { code: 'German', name: 'German', nativeName: 'Deutsch' },
    { code: 'Hindi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'Telugu', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'Tamil', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'Kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'Malayalam', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'Marathi', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'Bengali', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'Gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'Punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];
