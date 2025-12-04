
export enum PosterType {
  BIRTHDAY = 'Birthday',
  FESTIVAL = 'Festival',
  ANNIVERSARY = 'Marriage',
  CUSTOM = 'Custom',
  MOVIE = 'Movie'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  FOUR_THIRDS = '4:3',
  THREE_FOURTHS = '3:4',
  SIX_FOUR = '6:4',
  FOUR_SIX = '4:6'
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface PosterRequest {
  prompt: string;
  type: PosterType;
  aspectRatio: AspectRatio;
  userImage?: string; // base64
  age?: string;
  year?: string;
  customDate?: string;
  name?: string; // Used for Birthday Name, Custom Title, Movie Title
  festivalName?: string;
  husbandName?: string;
  wifeName?: string;
  marriageTheme?: string;
  customTemplate?: string;
  movieGenre?: string;
  movieTagline?: string;
  movieTemplate?: string;
  fontStyle?: string;
  qrCodeUrl?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  request: PosterRequest;
  generatedImage: string | null; // Null if storage quota exceeded and we only saved metadata
}

export interface AppStateSnapshot {
  posterType: PosterType;
  aspectRatio: AspectRatio;
  userImage: string | undefined;
  age: string;
  year: string;
  customDate: string;
  name: string;
  festivalName: string;
  husbandName: string;
  wifeName: string;
  marriageTheme: string;
  customTemplate: string;
  movieGenre: string;
  movieTagline: string;
  movieTemplate: string;
  fontStyle: string;
  qrCodeUrl: string;
  generatedImage: string | null;
}

export interface UserSettings {
  notifications: boolean;
  highQualityPreviews: boolean;
  saveHistory: boolean;
  biometricEnabled: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  profilePicture?: string; // Base64 string for custom avatar
  joinedAt: number;
  settings: UserSettings;
  isGuest?: boolean;
}