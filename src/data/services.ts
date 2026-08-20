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
    slug: "surveillance-activity-checks",
    title: "Surveillance & activity checks",
    summary: "Discreet mobile and fixed observation that turns activity into a clear, time-stamped record.",
    detail:
      "Mobile or fixed surveillance can document relevant activity, routines, locations, and interactions for claims, legal, workplace, or personal matters. The plan is built around the question, timing, and conditions in the field.",
    outputs: "Observation logs, time-and-location records, factual summaries, and supporting photographs or video when appropriate.",
    boundary: "The approach and coverage window are tailored to the objective, location, timing, and activity that can reasonably be observed.",
    audiences: ["Organizations", "Individuals"],
    published: true
  },
  {
    slug: "people-locates-wellness-verification",
    title: "People locates & wellness verification",
    summary: "Reliable leads and discreet field verification when you need to find or check on someone.",
    detail:
      "Right Hand combines lawful records research, source development, and fieldwork to locate a person or verify that someone is alive and well. This may support legal, estate, family, claims, or other legitimate matters.",
    outputs: "Documented search findings, verified contact or location leads, and field-check notes when an in-person verification is appropriate.",
    boundary: "The purpose, available identifiers, and safe handling of location information are confirmed before work begins.",
    audiences: ["Organizations", "Individuals"],
    published: true
  },
  {
    slug: "background-criminal-record-research",
    title: "Background & criminal record research",
    summary: "Focused public-record research that helps verify identity, history, and material claims.",
    detail:
      "Research may include criminal court records, civil records, business affiliations, address history, and other relevant public sources. The depth and jurisdictions are matched to the decision or case question.",
    outputs: "Source-linked findings, identity-verification notes, relevant record details, and clearly identified gaps or unresolved points.",
    boundary: "Records are checked against available identifiers and source limitations so likely matches are not presented as confirmed facts.",
    audiences: ["Organizations", "Individuals"],
    published: true
  },
  {
    slug: "employment-background-screening",
    title: "Employment background screening",
    summary: "Organized background information for employers making informed workforce decisions.",
    detail:
      "Pre-employment and workforce-related screening can help authorized employers evaluate relevant records and reported history through a defined, consistent process.",
    outputs: "Assignment-specific screening results and supporting source information for the employer’s review.",
    boundary: "Screening is accepted only with the required authorization, permissible purpose, and compliance steps for how the information will be obtained and used.",
    audiences: ["Organizations"],
    published: true
  },
  {
    slug: "social-media-open-source-research",
    title: "Social media & open-source research",
    summary: "Relevant online activity organized into findings you can review and act on.",
    detail:
      "Publicly available social media, websites, and other open sources can help corroborate identity, activity, affiliations, timelines, or statements connected to an investigation.",
    outputs: "Source-linked findings, captured public content, timeline notes, and identity-corroboration details.",
    boundary: "Research uses public or authorized access and does not bypass privacy settings, passwords, or other access controls.",
    audiences: ["Organizations", "Individuals"],
    published: true
  },
  {
    slug: "scene-witness-claim-investigations",
    title: "Scene, witness & claim investigations",
    summary: "Firsthand scene documentation and interviews that preserve useful facts while they are available.",
    detail:
      "Assignments may include scene visits, neighborhood or business canvasses, witness identification, interviews, and written or recorded statements for legal, claims, workplace, or other fact-finding needs.",
    outputs: "Scene notes and images, canvass and contact logs, interview memoranda, and signed or recorded witness statements when requested and authorized.",
    boundary: "Interviews are voluntary, and the methods and deliverables are agreed before the assignment begins.",
    audiences: ["Organizations", "Individuals"],
    published: true
  },
  {
    slug: "ime-investigation-support",
    title: "IME-related investigation support",
    summary: "Focused fact-gathering connected to an Independent Medical Examination and the underlying claim.",
    detail:
      "Right Hand supports insurers, employers, third-party administrators, and counsel with factual investigative work related to an IME, such as relevant activity documentation, field inquiries, interviews, or other agreed case questions.",
    outputs: "Engagement-specific observation records, field notes, interview summaries, supporting media, and a factual findings report.",
    boundary: "Right Hand provides investigative support; the independent medical examination and all medical opinions are handled by qualified medical professionals.",
    audiences: ["Organizations"],
    published: true
  },
  {
    slug: "electronic-surveillance-detection",
    title: "Electronic surveillance detection",
    summary: "Discreet inspection for suspected unauthorized cameras, microphones, or tracking devices.",
    detail:
      "A focused inspection can help identify signs of unauthorized monitoring in a residence, office, vehicle, or other location you are authorized to have inspected.",
    outputs: "Inspection findings, documented areas or devices of concern, and practical next-step recommendations.",
    boundary: "The inspection scope is based on the location, concern, access authorization, and equipment appropriate to the assignment.",
    audiences: ["Organizations", "Individuals"],
    published: true
  }
];

export const publishedServices = services.filter((service) => service.published);

export const serviceStandards = [
  "A legitimate, clearly defined purpose for every assignment",
  "An agreed scope, schedule, reporting plan, and authorized access",
  "Lawful fieldwork and research methods matched to the objective",
  "Careful source review with observations, records, and unresolved points clearly distinguished",
  "The appropriate consent and compliance process for employment screening and sensitive records"
];
