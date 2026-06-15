export type ProspectSocialNetworks = Record<string, string>;

export type CrmProspect = {
  id: string;
  brandName: string;
  projectName: string | null;
  followers: string | null;
  socialNetworks: ProspectSocialNetworks;
  phone: string | null;
  email: string | null;
  website: string | null;
  colorPalette: string[];
  notes: string | null;
  source: string | null;
  landingToken: string | null;
  landingUrl: string | null;
  createdAt: string;
};

export type ImportedProspectInput = {
  brandName: string;
  projectName?: string | null;
  followers?: string | number | null;
  socialNetworks?: ProspectSocialNetworks;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  colorPalette?: string[];
  notes?: string | null;
  source?: string | null;
  raw?: unknown;
};
