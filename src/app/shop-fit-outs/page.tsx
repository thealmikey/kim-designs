import CategoryPage from "@/components/variants/v6/CategoryPage";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Shop Fit-Outs — Kim Interior Designs",
  description:
    "Commercial interior fit-outs — showrooms, retail, hospitality. From first measurement to handover.",
};

export default function ShopFitOutsPage() {
  return <CategoryPage category="Shop Fit-Out" title="Shop Fit-Outs" subtitle="Commercial interior fit-outs — showrooms, retail, hospitality" projects={projects} />;
}