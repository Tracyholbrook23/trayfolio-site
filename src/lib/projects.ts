export type ProjectClassification = "client" | "concept" | "experiment";

export type Project = {
  slug: string;
  name: string;
  classification: ProjectClassification;
  classificationLabel: string;
  industry: string;
  summary: string;
  image: string;
  liveUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  need: string;
  approach: string;
  experience: string;
  services: string[];
};

export const projects: Project[] = [
  {
    slug: "runcheck",
    name: "RunCheck",
    classification: "client",
    classificationLabel: "Client work",
    industry: "Sports technology",
    summary: "A bold digital home for a pickup basketball platform built around live local runs.",
    image: "/work/runcheck.jpg",
    liveUrl: "https://www.theruncheck.app",
    featured: true,
    need: "Give a growing basketball platform a clear, energetic website that makes the product feel immediate and easy to understand.",
    approach: "A high-contrast visual system, direct product storytelling, and a focused path from first impression to exploring the platform.",
    experience: "An editorial, product-led experience that matches the speed and culture of pickup basketball without losing clarity.",
    services: ["Website strategy", "Visual design", "Front-end development", "Responsive experience"],
  },
  {
    slug: "atx-auto-detailing",
    name: "ATX Auto Detailing",
    classification: "client",
    classificationLabel: "Client work",
    industry: "Mobile auto detailing",
    summary: "A cinematic, conversion-focused site that makes a premium service feel tangible.",
    image: "/work/autodetailingatx.jpg",
    liveUrl: "https://www.autodetailingatx.com",
    featured: true,
    need: "Present a hands-on service with the polish, clarity, and visual confidence customers expect from premium detailing.",
    approach: "Lead with the work, organize services around customer decisions, and use motion where it helps visitors understand the transformation.",
    experience: "A visual service journey with strong imagery, clear offerings, and mobile-first calls to action.",
    services: ["Website strategy", "Art direction", "Web design", "Development", "Motion"],
  },
  {
    slug: "valtier-media",
    name: "Valtier Media",
    classification: "client",
    classificationLabel: "Client work",
    industry: "Photography & videography",
    summary: "A polished portfolio designed to make every frame feel cinematic.",
    image: "/work/valtiermedia.jpg",
    liveUrl: "https://www.valtiermedia.com",
    featured: true,
    need: "Create a portfolio that gives visual work room to lead while still making services and contact paths easy to find.",
    approach: "Use restrained typography, strong pacing, and image-led layouts to support the work instead of competing with it.",
    experience: "A clean, cinematic portfolio that moves naturally from first impression to deeper project exploration.",
    services: ["Portfolio strategy", "Visual design", "Development", "Responsive galleries"],
  },
  {
    slug: "out-of-jersey-creations",
    name: "Out of Jersey Creations",
    classification: "client",
    classificationLabel: "Client work",
    industry: "Custom laser engraving",
    summary: "A focused online presence for a custom engraving business.",
    image: "/work/outofjerseycreations.jpg",
    liveUrl: "https://www.outofjerseycreationshub.com",
    need: "Present custom work clearly and give prospective customers a credible place to understand the business.",
    approach: "Organize the offer around real products and customer questions while keeping the brand personal.",
    experience: "A straightforward, image-led small-business website built for easy browsing on phones.",
    services: ["Web design", "Development", "Responsive experience"],
  },
  {
    slug: "mode",
    name: "MØDE",
    classification: "client",
    classificationLabel: "Client work",
    industry: "Membership platform",
    summary: "A distinctive front door for a custom membership experience.",
    image: "/work/mode.jpg",
    liveUrl: "https://www.enterm0de.com",
    need: "Introduce a membership platform with a memorable point of view and a clear path into the product.",
    approach: "Build a compact, high-impact experience around brand atmosphere and intentional interaction.",
    experience: "A focused digital entry point that feels more like a brand experience than a conventional landing page.",
    services: ["Creative direction", "Web design", "Development", "Interaction design"],
  },
  {
    slug: "shawnies-loc-lab",
    name: "Shawnie's Loc Lab",
    classification: "client",
    classificationLabel: "Client work",
    industry: "Hair care & styling",
    summary: "A welcoming service website for a loc and braid specialist.",
    image: "/work/shawniesloclab.jpg",
    liveUrl: "https://www.shawniesloclab.com",
    need: "Make services easier to understand and give new clients a professional, welcoming place to begin.",
    approach: "Pair approachable brand presentation with clear service information and a mobile-friendly customer path.",
    experience: "A warm service-business site that keeps the work and next step easy to find.",
    services: ["Web design", "Development", "Service presentation", "Responsive experience"],
  },
  {
    slug: "strux-construction",
    name: "STRUX",
    classification: "concept",
    classificationLabel: "Concept / demo",
    industry: "Construction & trades",
    summary: "An industrial construction concept built around a scroll-driven visual story.",
    image: "/demos/construction/assets/construction-crane-modern-residential-complex-near-water-new-housing-by-lake.jpg",
    demoUrl: "/demos/construction/",
    need: "Explore how a construction company could communicate scale, capability, and momentum online.",
    approach: "Combine strong editorial type with immersive project imagery and motion tied to the page narrative.",
    experience: "A cinematic concept with a scroll-scrubbed hero and bold project presentation.",
    services: ["Concept design", "Motion exploration", "Front-end development"],
  },
  {
    slug: "evergreen-holiday-lighting",
    name: "Evergreen Holiday Lighting",
    classification: "concept",
    classificationLabel: "Concept / demo",
    industry: "Seasonal home services",
    summary: "A seasonal home-services concept centered on a before-and-after transformation.",
    image: "/demos/holiday-lighting/christmas-lights/3-house-lights-on.png",
    demoUrl: "/demos/holiday-lighting/",
    need: "Show how a highly visual seasonal service can communicate its result before asking for a quote.",
    approach: "Make the transformation the hero and support it with a simple service story.",
    experience: "An interactive before-and-after reveal designed to work as visual proof.",
    services: ["Concept design", "Interaction design", "Front-end development"],
  },
  {
    slug: "nu2u-moving",
    name: "Nu2U Moving & Delivery",
    classification: "concept",
    classificationLabel: "Concept / demo",
    industry: "Moving & delivery",
    summary: "A moving-company concept with a playful loading sequence and practical service structure.",
    image: "/demos/nu2u-moving/hero-preview.png",
    demoUrl: "/demos/nu2u-moving/",
    need: "Explore a more memorable digital identity for a practical, trust-based local service.",
    approach: "Pair useful service information with an ownable visual moment tied directly to the work.",
    experience: "A responsive service site with a scroll-scrubbed truck-loading sequence.",
    services: ["Concept design", "Motion exploration", "Front-end development"],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const clientProjects = projects.filter((project) => project.classification === "client");
export const conceptProjects = projects.filter((project) => project.classification === "concept");

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
