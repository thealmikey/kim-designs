import CategoryPage from "@/components/variants/v6/CategoryPage";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Bath Vanities — Kim Interior Designs",
  description:
    "Bath vanities and full fit-outs. Stone tops, brass hardware, soft-close hardware, considered lighting.",
};

export default function BathVanitiesPage() {
  return <CategoryPage category="Bath Vanity" title="Bath Vanities" subtitle="Bath vanities and full fit-outs" projects={projects} />;
}