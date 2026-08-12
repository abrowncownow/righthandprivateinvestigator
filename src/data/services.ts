export type Audience = "Organizations" | "Individuals";

export interface Service {
  slug: string;
  title: string;
  summary: string;
  detail: string;
  outputs: string;
  boundary: string;
  audiences: Audience[];
  published: boolean;
}

export const services: Service[] = [
  {
    slug: "surveillance-field-documentation",
    title: "Surveillance & field documentation",
    summary: "Lawful observation and contemporaneous reporting within an agreed scope.",
    detail:
      "Observation from public or otherwise authorized locations, supported by time-and-location notes and, when relevant and lawful, photographs or video.",
    outputs: "Observation logs, factual summaries, time-and-location records, and supporting media.",
    boundary: "No guarantee that a particular person, event, or fact will be observed.",
    audiences: ["Organizations", "Individuals"],
    published: true
  },
  {
    slug: "workplace-claims-fact-gathering",
    title: "Workplace & claims fact-gathering",
    summary: "Interviews, canvasses, chronology work, field checks, and source research.",
    detail:
      "Defined fact-gathering to support a client’s internal, legal, or claims evaluation without taking over the client’s decision-making role.",
    outputs: "Interview memoranda, chronology summaries, field notes, and cited public-source findings.",
    boundary: "No claim adjustment, coverage analysis, reserve setting, benefit decision, or settlement negotiation.",
    audiences: ["Organizations"],
    published: true
  },
  {
    slug: "locates-skip-tracing",
    title: "Locates & skip tracing",
    summary: "Lawful location research for verified, permissible purposes.",
    detail:
      "Source research intended to identify current contact or location information after the requestor, relationship, purpose, and safety considerations are reviewed.",
    outputs: "A documented search summary and verified leads appropriate to the engagement.",
    boundary: "Information may be withheld or passed through an intermediary when direct disclosure would be improper or unsafe.",
    audiences: ["Organizations", "Individuals"],
    published: true
  },
  {
    slug: "background-research-due-diligence",
    title: "Background research & due diligence",
    summary: "Public-record and open-source research for informed decisions.",
    detail:
      "Research to verify representations, map relevant relationships, or identify information that warrants further review.",
    outputs: "Source-linked research summaries, verification notes, and clearly marked unresolved points.",
    boundary: "Not offered as an FCRA consumer report or for employment, housing, credit, tenant, or insurance eligibility screening.",
    audiences: ["Organizations", "Individuals"],
    published: true
  },
  {
    slug: "witness-scene-inquiries",
    title: "Witness & scene inquiries",
    summary: "Voluntary interviews, local canvasses, and available scene documentation.",
    detail:
      "Efforts to identify and contact potential witnesses, conduct voluntary interviews, canvass a location, or document observable scene conditions.",
    outputs: "Interview memoranda, contact logs, canvass summaries, and scene notes or images when appropriate.",
    boundary: "No coercion, harassment, or representation of law-enforcement authority.",
    audiences: ["Organizations"],
    published: true
  },
  {
    slug: "litigation-support",
    title: "Litigation support",
    summary: "Investigative tasks coordinated with counsel and matched to the case question.",
    detail:
      "Assignments may include locates, witness inquiries, surveillance, field documentation, chronology work, or public-source research.",
    outputs: "Engagement-specific factual reports and supporting material for counsel’s evaluation.",
    boundary: "Right Hand does not provide legal advice. Service of legal documents is handled separately.",
    audiences: ["Organizations"],
    published: true
  },
  {
    slug: "infidelity-family-matters",
    title: "Infidelity & family matters",
    summary: "Carefully planned fact-gathering for sensitive personal situations.",
    detail:
      "Lawful surveillance, observation, locates, or factual research related to a clearly defined relationship or family concern.",
    outputs: "Factual observations and supporting material within the agreed scope.",
    boundary: "No guaranteed outcome, unlawful access, improper tracking, harassment, or interpretation of legal consequences.",
    audiences: ["Individuals"],
    published: true
  }
];

export const publishedServices = services.filter((service) => service.published);

export const serviceExclusions = [
  "Hacking, password access, spyware, or account intrusion",
  "Unlawful GPS tracking, interception, wiretapping, or recording",
  "Harassment, intimidation, stalking, coercion, or impersonation",
  "Claim adjustment, coverage decisions, or settlement negotiation",
  "FCRA-regulated consumer screening",
  "Armed protection, polygraphs, bug sweeps, or computer forensics",
  "Work intended to evade legal process or facilitate harm",
  "Any promise of a particular finding or outcome"
];
