declare module "lucide-react" {
  import type { SVGProps, ForwardRefExoticComponent, RefAttributes } from "react";

  type LucideProps = SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  };

  type LucideIcon = ForwardRefExoticComponent<
    LucideProps & RefAttributes<SVGSVGElement>
  >;

  export const Mail: LucideIcon;
  export const Phone: LucideIcon;
  export const MapPin: LucideIcon;
  export const Facebook: LucideIcon;
  export const X: LucideIcon;
  export const Instagram: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const Check: LucideIcon;
}
