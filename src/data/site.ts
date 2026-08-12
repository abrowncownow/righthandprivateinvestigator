export interface NavigationItem {
  label: string;
  href: string;
}

export interface Credential {
  label: string;
  jurisdiction: string;
  identifier?: string;
  status: "verified" | "pending";
  visible: boolean;
}

const previewValue = import.meta.env.PUBLIC_PREVIEW_MODE;

export const siteConfig = {
  name: "Right Hand Private Investigator",
  shortName: "Right Hand",
  descriptor: "Private investigative support for Idaho organizations and individuals.",
  tagline: "When the facts matter, put it in the Right Hands.",
  phoneDisplay: "(360) 791-0707",
  phoneHref: "+13607910707",
  email: "righthandlp.wa@gmail.com",
  intendedDomain: "https://righthandprivateinvestigator.com",
  processServiceUrl: "https://righthandprofessionalprocessservice.com/",
  processServiceName: "Right Hand Professional Process Service",
  previewMode: previewValue === undefined ? true : previewValue !== "false",
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT?.trim() || "",
  legalEntity: "Right Hand Private Investigator",
  region: "Idaho",
  credentials: [] as Credential[]
} as const;

export const primaryNavigation: NavigationItem[] = [
  { label: "Organizations", href: "/organizations/" },
  { label: "Individuals", href: "/individuals/" },
  { label: "Services", href: "/services/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" }
];

export const footerNavigation: NavigationItem[] = [
  ...primaryNavigation,
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" }
];

export const effectiveDate = "August 11, 2026";
