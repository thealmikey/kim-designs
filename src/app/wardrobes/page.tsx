import CategoryPage from "@/components/variants/v6/CategoryPage";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Wardrobes — Kim Interior Designs",
  description:
    "Tailored wardrobes, walk-in closets and dressing rooms. Hand-finished joinery in mahogany, oak or painted MDF.",
};

export default function WardrobesPage() {
  return <CategoryPage category="Wardrobe" title="Wardrobes" subtitle="Tailored wardrobes, walk-in closets and dressing rooms" projects={projects} />;
}