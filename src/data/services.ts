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
    title: "Surveillance, covert video & field documentation",
    summary: "Discreet, lawful observation using professional cameras and covert video tools when appropriate.",
    detail:
      "Observation from public or otherwise authorized locations, supported by detailed time-and-location notes and, when relevant and lawful, professional photography or covert video.",
    outputs: "Observation logs, factual summaries, time-and-location records, and supporting media.",
    boundary: "Observation plans are tailored to the objective, timing, location, and activity that can reasonably be documented.",
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
    boundary: "Investigative fact-gathering supports the decisions of the client and its licensed claims professionals.",
    audiences: ["Organizations"],
    published: true
  },
  {
    slug: "locates-skip-tracing",
    title: "Skip tracing & person locates",
    summary: "Finding a person’s current contact or location information for a verified, lawful reason.",
    detail:
      "Skip tracing means searching lawful records and other reliable sources for leads that may identify where a person lives, works, or can be contacted. Every request is screened for purpose and safety.",
    outputs: "A documented search summary and verified leads appropriate to the engagement.",
    boundary: "Identity, purpose, and the safe handling of location information are confirmed before work begins.",
    audiences: ["Organizations", "Individuals"],
    published: true
  },
  {
    slug: "license-plate-research",
    title: "License plate research & vehicle leads",
    summary: "Lawful vehicle-related research using available records and license plate reader technology.",
    detail:
      "When legally permitted and relevant to the assignment, vehicle observations and license plate reader data may help develop time, location, or association leads. Access and results depend on the lawful purpose and available sources.",
    outputs: "Vehicle observation notes, relevant plate or location leads, photographs, and source documentation when available.",
    boundary: "Available sources and permissible access are confirmed for each vehicle-related assignment.",
    audiences: ["Organizations", "Individuals"],
    published: true
  },
  {
    slug: "background-research-due-diligence",
    title: "Background research & due diligence",
    summary: "Layered public-record and online research, from a focused check to a deeper investigation.",
    detail:
      "Research depth is matched to the question: a focused Level 1 lead check, a broader Level 2 records review, or a deeper Level 3 investigation combining sources, verification, and relationship mapping.",
    outputs: "Source-linked research summaries, verification notes, and clearly marked unresolved points.",
    boundary: "Personal and business due diligence only; regulated employment, housing, credit, tenant, and insurance screening is outside this service.",
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
    boundary: "Interviews are voluntary and conducted without coercion, harassment, or impersonation of law-enforcement authority.",
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
    boundary: "Investigative support is coordinated with counsel; legal advice and service of legal documents are handled separately.",
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
    boundary: "The scope focuses on documented facts gathered through lawful, discreet methods.",
    audiences: ["Individuals"],
    published: true
  }
];

export const publishedServices = services.filter((service) => service.published);

export const serviceExclusions = [
  "Hacking, password access, spyware, or account intrusion",
  "Unlawful GPS tracking, interception, wiretapping, or recording",
  "Harassment, intimidation, stalking, coercion, or impersonation",
  "Regulated screening, claim adjustment, legal advice, or other services outside the agreed investigative role",
  "Work intended to evade legal process, facilitate harm, or serve another improper purpose"
];
