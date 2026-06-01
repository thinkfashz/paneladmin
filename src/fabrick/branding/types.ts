export type BrandIdentity = {
  businessId?: string | null;
  name: string;
  logoUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  tagline?: string | null;
};

export type BrandLoadingConfig = {
  durationMs: number;
  showLogo: boolean;
  showName: boolean;
  message: string;
};

export type BrandTheme = {
  identity: BrandIdentity;
  loading: BrandLoadingConfig;
};
