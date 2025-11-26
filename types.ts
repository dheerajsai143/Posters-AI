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
  name?: string; // Used for Birthday Name, Custom Title, Movie Title
  festivalName?: string;
  husbandName?: string;
  wifeName?: string;
  marriageTheme?: string;
  customTemplate?: string;
  movieGenre?: string;
  movieTagline?: string;
  movieTemplate?: string;
}