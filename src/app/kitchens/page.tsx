import CategoryPage from "@/components/variants/v6/CategoryPage";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Kitchens — Kim Interior Designs",
  description:
    "Bespoke kitchen design, manufacturing and installation. From concept sketch to a finished room you cook in for decades.",
};

export default function KitchensPage() {
  return <CategoryPage category="Kitchen" title="Kitchens" subtitle="Bespoke kitchen design, manufacturing and installation" projects={projects} />;
}