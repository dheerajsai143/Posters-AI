
export type Category = 'Birthday' | 'Festival' | 'Wedding' | 'Custom';

// FIX: Add BirthdayType to fix error in components/BirthdayTypeSelection.tsx.
export type BirthdayType = 'Advance' | 'Standard';

export type FestivalType = 'Christmas' | 'Diwali' | 'Eid' | 'New Year' | 'Halloween' | 'Holi' | 'Raksha Bandhan' | 'Navratri' | 'Dussehra' | 'Ram Navami' | 'Ganesh Chaturthi' | 'Janmashtami' | 'Makar Sankranti' | 'Onam' | 'Gurpurab' | 'Maha Shivratri' | 'Baisakhi' | 'Lohri' | 'Karwa Chauth' | 'Bhai Dooj' | 'Republic Day' | 'Independence Day' | 'Gandhi Jayanti' | 'Ugadi' | 'Varalakshmi Vratam' | 'Bathukamma' | 'Akshaya Tritiya' | 'Poleramma Jatara' | 'Gangamma Jatara' | 'Thirunakshatram / Kalyanam' | 'Chhath Puja' | 'Karthika Masam' | 'Rath Yatra' | 'Sankranti / Pongal' | 'Vasant Panchami' | 'Bhogi' | 'Other';

export type WeddingStyle = 'Traditional Indian' | 'Modern Minimalist' | 'Christian Wedding' | 'Custom Style';

export type WeddingType =
  | 'Invitation'
  | 'Save the Date'
  | 'Engagement'
  | 'Anniversary'
  | 'Haldi Ceremony'
  | 'Sangeet Night'
  | 'Mehendi Function'
  | 'Reception Party'
  | 'Bachelorette Party'
  | 'Bridal Shower'
  | 'Bachelor Party'
  | 'Tilak Ceremony'
  | 'Roka Ceremony'
  | 'Baraat'
  | 'Jaimala Ceremony'
  | 'Custom';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '3:4' | '4:3' | '4:5' | 'A4';

export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Hindi' | 'Telugu' | 'Tamil' | 'Kannada' | 'Malayalam' | 'Marathi' | 'Bengali' | 'Gujarati' | 'Punjabi';

export interface PosterData {
  category: Category;
  image: {
    base64: string;
    mimeType: string;
  } | null;
  ratio: AspectRatio;
  // Optional fields for category-specific details
  name?: string;
  age?: string;
  theme?: string;
  date?: string;
  festivalType?: FestivalType;
  birthdayMessage?: string;
  // FIX: Add birthdayType to PosterData to support the BirthdayTypeSelection component.
  birthdayType?: BirthdayType;
  weddingStyle?: WeddingStyle;
  weddingType?: WeddingType;
  festivalName?: string;
  venue?: string;
  weddingWish?: string;
  language?: Language;
  invitedBy?: string;
}

export interface UserProfile {
    name: string;
    email: string;
    profilePic: string | null;
}

export type LoginMethod = 'google' | 'guest' | 'email' | 'phone';
