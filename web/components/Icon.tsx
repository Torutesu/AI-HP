import {
  ArrowRight,
  Search,
  Wrench,
  BadgeCheck,
  EyeOff,
  BookOpen,
  PieChart,
  Receipt,
  TrendingDown,
  TrendingUp,
  Percent,
  Blocks,
  Globe,
  Layers,
  Unplug,
  Users,
  Headphones,
  Megaphone,
  FileText,
  type LucideIcon,
} from "lucide-react";

/**
 * Thin line-icon wrapper (1.75px stroke) — the brand's icon style.
 * Sized via the wrapper span so a single size prop drives width + height,
 * and the icon inherits `currentColor` from its context.
 */
const registry: Record<string, LucideIcon> = {
  "arrow-right": ArrowRight,
  search: Search,
  wrench: Wrench,
  "badge-check": BadgeCheck,
  "eye-off": EyeOff,
  "book-open": BookOpen,
  "pie-chart": PieChart,
  receipt: Receipt,
  "trending-down": TrendingDown,
  "trending-up": TrendingUp,
  percent: Percent,
  blocks: Blocks,
  globe: Globe,
  layers: Layers,
  unplug: Unplug,
  users: Users,
  headphones: Headphones,
  megaphone: Megaphone,
  "file-text": FileText,
};

export default function Icon({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Glyph = registry[name];
  if (!Glyph) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Icon: unknown name "${name}"`);
    }
    return null;
  }
  return (
    <span
      className={`dc-icon${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Glyph size={size} strokeWidth={1.75} absoluteStrokeWidth />
    </span>
  );
}
