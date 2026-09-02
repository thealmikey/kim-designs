export type ProjectCategory =
  | "Kitchen"
  | "Wardrobe"
  | "Bath Vanity"
  | "Shop Fit-Out";

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  description: string;
  year: string;
  location: string;
  materials: string[];
  images: string[];
  featured: boolean;
  tags: string[];
};

const img = (folder: string, n: number) =>
  `/images/${folder}/${n.toString().padStart(2, "0")}.jpg`;

export const projects: Project[] = [
  {
    id: "pvc-foilwrap-and-high-gloss-handless-kitchen",
    title: "Foilwrap & High Gloss Kitchen",
    subtitle: "Refined Minimalism",
    category: "Kitchen",
    description:
      "PVC foilwrap meets high-gloss cabinetry in a handleless composition. Clean lines, integrated lighting, and tactile surfaces designed for the way a modern Nairobi kitchen is actually used.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["PVC Foilwrap", "High Gloss", "Handleless", "Quartz"],
    images: Array.from({ length: 10 }, (_, i) =>
      img("pvc-foilwrap-and-high-gloss-handless-kitchen", i + 1)
    ),
    featured: true,
    tags: [
      "kitchen",
      "handleless",
      "high gloss",
      "PVC foilwrap",
      "minimalist",
      "modern kitchen",
      "Nairobi kitchen design",
    ],
  },
  {
    id: "spray-paint-kitchen",
    title: "Spray Paint Kitchen",
    subtitle: "Seamless Surface",
    category: "Kitchen",
    description:
      "A kitchen where surfaces dissolve into pure color. Spray-painted cabinetry creates a seamless, monolithic presence — paired with a quartz counter and considered lighting.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["MDF", "Spray Paint", "Quartz Counter"],
    images: Array.from({ length: 5 }, (_, i) => img("spray-paint-kitchen", i + 1)),
    featured: true,
    tags: [
      "kitchen",
      "spray paint",
      "seamless",
      "monolithic",
      "modern kitchen",
      "Nairobi kitchen design",
    ],
  },
  {
    id: "classic-kitchen-hutch",
    title: "Classic Kitchen Hutch",
    subtitle: "Heritage Pantry",
    category: "Kitchen",
    description:
      "A sage-green glass-front hutch with brass hardware — a working pantry that displays everyday objects as collection. Hand-finished, soft-close, made to be lived with for decades.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Painted MDF", "Brass Hardware", "Tempered Glass"],
    images: [img("classic-kitchen-hutch", 1)],
    featured: false,
    tags: [
      "kitchen",
      "hutch",
      "pantry",
      "glass front",
      "brass",
      "classic",
      "Nairobi kitchen design",
    ],
  },
  {
    id: "wardropes",
    title: "Bespoke Wardrobes",
    subtitle: "Tailored Storage",
    category: "Wardrobe",
    description:
      "Custom wardrobes designed with precision joinery and refined materiality. Each piece is tailored to the spatial rhythm of the room and the way you dress.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Mahogany", "Melanin Finish", "Brass Fittings"],
    images: Array.from({ length: 7 }, (_, i) => img("wardropes", i + 1)),
    featured: true,
    tags: [
      "wardrobe",
      "bespoke",
      "tailored",
      "mahogany",
      "brass",
      "Nairobi wardrobe design",
    ],
  },
  {
    id: "walk-in-closet",
    title: "Walk-In Closet",
    subtitle: "Dressing Suite",
    category: "Wardrobe",
    description:
      "A walk-in dressing suite with full-height shelving, dedicated shoe racks, and a chandelier as a quiet centrepiece. Every drawer pulled, every shelf lit.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Painted MDF", "Soft-close Hardware", "LED Lighting"],
    images: Array.from({ length: 4 }, (_, i) => img("walk-in-closet", i + 1)),
    featured: true,
    tags: [
      "wardrobe",
      "walk-in closet",
      "dressing room",
      "shoe rack",
      "LED lighting",
      "Nairobi wardrobe design",
    ],
  },
  {
    id: "classic-wardrobe",
    title: "Classic Wardrobe Suite",
    subtitle: "Multi-Bay Storage",
    category: "Wardrobe",
    description:
      "A multi-bay wardrobe in dark matte with light interiors. Long-hang, short-hang, drawers, open shelves — and a centre island for folded pieces.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Matte Lacquer", "Plywood Interior", "Soft-close Hinges"],
    images: Array.from({ length: 12 }, (_, i) => img("classic-wardrobe", i + 1)),
    featured: true,
    tags: [
      "wardrobe",
      "classic",
      "matte",
      "multi-bay",
      "Nairobi wardrobe design",
    ],
  },
  {
    id: "classic-wardrobe-with-mirror",
    title: "Classic Wardrobe with Mirror",
    subtitle: "Refined Symmetry",
    category: "Wardrobe",
    description:
      "A traditional wardrobe with full-length integrated mirrors, light interiors, and considered proportions — practical luxury for the everyday.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Veneered MDF", "Bevel Mirrors", "Soft-close Hardware"],
    images: Array.from({ length: 2 }, (_, i) =>
      img("classic-wardrobe-with-mirror", i + 1)
    ),
    featured: false,
    tags: [
      "wardrobe",
      "classic",
      "mirror",
      "full-length",
      "Nairobi wardrobe design",
    ],
  },
  {
    id: "glossy-wardrobe-led-mirror",
    title: "Glossy Wardrobe with LED Mirror",
    subtitle: "Modern Drama",
    category: "Wardrobe",
    description:
      "A high-gloss dark wardrobe with integrated LED strip mirrors and warm wood flooring — a contemporary statement that holds its own in any bedroom.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["High Gloss Lacquer", "LED Strip", "Bevel Mirror"],
    images: Array.from({ length: 4 }, (_, i) =>
      img("glossy-wardrobe-led-mirror", i + 1)
    ),
    featured: true,
    tags: [
      "wardrobe",
      "glossy",
      "LED",
      "mirror",
      "modern",
      "Nairobi wardrobe design",
    ],
  },
  {
    id: "wardrobe-with-makeup-table",
    title: "Wardrobe with Makeup Vanity",
    subtitle: "Dressing Corner",
    category: "Wardrobe",
    description:
      "A wardrobe that opens into a dedicated makeup vanity — drawers for product, a lit mirror, and a comfortable seat-height counter.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Painted MDF", "LED Mirror", "Soft-close Drawers"],
    images: Array.from({ length: 2 }, (_, i) =>
      img("wardrobe-with-makeup-table", i + 1)
    ),
    featured: false,
    tags: [
      "wardrobe",
      "vanity",
      "makeup table",
      "dressing",
      "Nairobi wardrobe design",
    ],
  },
  {
    id: "under-stairs-wardrobe",
    title: "Under-Stairs Wardrobe",
    subtitle: "Made-to-Fit",
    category: "Wardrobe",
    description:
      "Storage that finally makes the awkward under-stair void work — angled shelves, hanging rails, and a clean face panel that disappears into the architecture.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Painted MDF", "Soft-close Hinges"],
    images: [img("under-stairs-wardrobe", 1)],
    featured: false,
    tags: [
      "wardrobe",
      "under-stairs",
      "custom",
      "awkward space",
      "Nairobi wardrobe design",
    ],
  },
  {
    id: "wardrobe-installation-process",
    title: "Wardrobe Installation",
    subtitle: "On Site",
    category: "Shop Fit-Out",
    description:
      "A wardrobe being commissioned on site. From the first measurement to the final door adjustment, our installers work to a clean, dust-aware process.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Installation"],
    images: Array.from({ length: 2 }, (_, i) =>
      img("wardrobe-installation-process", i + 1)
    ),
    featured: false,
    tags: [
      "process",
      "installation",
      "behind the scenes",
      "Nairobi interior design",
    ],
  },
  {
    id: "melanin-finish-mahogany",
    title: "Melanin Finish Mahogany",
    subtitle: "Warmth & Depth",
    category: "Kitchen",
    description:
      "A study in tonal richness. Melanin-finished mahogany surfaces that absorb light and return warmth — a classic finish with a contemporary edge.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Mahogany", "Melanin Finish"],
    images: Array.from({ length: 6 }, (_, i) =>
      img("melanin-finish-mahogany", i + 1)
    ),
    featured: false,
    tags: [
      "kitchen",
      "mahogany",
      "melanin",
      "warm",
      "classic",
      "Nairobi kitchen design",
    ],
  },
  {
    id: "mahogany-solid-wood",
    title: "Solid Mahogany",
    subtitle: "Natural Grain",
    category: "Kitchen",
    description:
      "Solid mahogany in its truest expression. Honest materiality where the grain tells the story of the tree.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Solid Mahogany"],
    images: Array.from({ length: 5 }, (_, i) =>
      img("mahogany-solid-wood", i + 1)
    ),
    featured: false,
    tags: [
      "kitchen",
      "mahogany",
      "solid wood",
      "natural",
      "Nairobi kitchen design",
    ],
  },
  {
    id: "handless-melanin",
    title: "Handless Melanin",
    subtitle: "Integrated Form",
    category: "Kitchen",
    description:
      "Handleless melanin-finished cabinetry where form follows function. An exercise in restraint and material confidence.",
    year: "2024",
    location: "Nairobi, Kenya",
    materials: ["Melanin Board", "Integrated Handles"],
    images: Array.from({ length: 6 }, (_, i) => img("handless-melanin", i + 1)),
    featured: false,
    tags: [
      "kitchen",
      "handleless",
      "melanin",
      "minimalist",
      "Nairobi kitchen design",
    ],
  },
];

export const projectById = (id: string) =>
  projects.find((p) => p.id === id);

export const allCategories: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "Kitchen", label: "Kitchens" },
  { id: "Wardrobe", label: "Wardrobes" },
  { id: "Bath Vanity", label: "Bath Vanities" },
  { id: "Shop Fit-Out", label: "Shop Fit-Outs" },
];
