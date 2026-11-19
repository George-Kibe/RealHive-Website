/**
 * The team: shown on /aboutus (each member has an anchor, #<slug>) and used as
 * named blog authors (Post.authorSlug), with a Person node in the post's JSON-LD.
 *
 * Only real facts go here. `bio` (2–3 sentences: experience, what they work on,
 * certifications) and `links` (LinkedIn, GitHub, X: personal profiles are fine
 * here, unlike SAME_AS in schema.js) are empty until each person supplies them;
 * empty fields simply aren't rendered.
 *
 * Portraits have their backgrounds removed, trimmed to ~740px wide (2x the card).
 */
import GeorgeImage from "../../public/images/team-george-kibe.webp";
import TrentImage from "../../public/images/team-trent-george.webp";
import JohnImage from "../../public/images/team-john-mbugua.webp";
import MercyImage from "../../public/images/team-mercy-wanjiru.webp";

export const TEAM = [
  {
    slug: "george-kibe",
    name: "George Kibe",
    role: "Mobile Developer and Data Engineer",
    image: GeorgeImage,
    bio: "",
    links: [{ name: "GitHub", href: "https://github.com/George-Kibe" }],
  },
  {
    slug: "john-mbugua",
    name: "John Mbugua",
    role: "Web Developer",
    image: JohnImage,
    bio: "",
    links: [],
  },
  {
    slug: "mercy-wanjiru",
    name: "Mercy Wanjiru",
    role: "Web Designer",
    image: MercyImage,
    bio: "",
    links: [],
  },
  {
    slug: "trent-george",
    name: "Trent George",
    role: "Web Developer and Data Scientist",
    image: TrentImage,
    bio: "",
    links: [],
  },
];

export const TEAM_BY_SLUG = Object.fromEntries(TEAM.map((m) => [m.slug, m]));

/** Where a team member's profile lives on the site. */
export const memberPath = (slug) => `/aboutus#${slug}`;
