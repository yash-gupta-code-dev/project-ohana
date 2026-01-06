
export type AppState = 'landing' | 'gallery' | 'lab' | 'finale';

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface HiddenItem {
  id: string;
  name: string;
  icon: string;
}

export interface SiteConfig {
  title: string;
  subtitle: string;
  landing: {
    heroText: string;
    subHeroText: string;
    ctaText: string;
  };
  gallery: {
    description: string;
    photos: Photo[];
    hiddenItems: HiddenItem[];
  };
  lab: {
    title: string;
    subtitle: string;
    systemInstruction: string;
  };
  finale: {
    letterContext: string;
    surpriseTitle: string;
    surpriseDescription: string;
    surpriseLocation: string;
  };
}
