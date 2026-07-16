import {
  ArrowRight, BadgeCheck, Blocks, BookOpen, Briefcase, Building2, Check,
  CheckCircle2, Clock, Compass, Cpu, Crosshair, Download, EyeOff, Factory, FileCheck,
  FileText, Flag, Globe, Handshake, Headphones, Image as ImageIcon, Landmark,
  Layers, LayoutGrid, ListOrdered, Lock, Magnet, Megaphone, PenTool, Percent,
  PieChart, Receipt, Route, Search, ShieldCheck, ShoppingBag, Stethoscope, Tag,
  Target, TrendingDown, TrendingUp, Unplug, Users, Workflow, Wrench, XCircle,
  type LucideIcon,
} from "lucide-react";

/**
 * Thin line-icon wrapper (1.75px stroke) — the brand's icon style.
 * Sized via the wrapper span so a single size prop drives width + height,
 * and the icon inherits `currentColor` from its context.
 */
const registry: Record<string, LucideIcon> = {
  "arrow-right": ArrowRight,
  "badge-check": BadgeCheck,
  blocks: Blocks,
  "book-open": BookOpen,
  briefcase: Briefcase,
  "building-2": Building2,
  check: Check,
  "check-circle-2": CheckCircle2,
  clock: Clock,
  compass: Compass,
  cpu: Cpu,
  crosshair: Crosshair,
  download: Download,
  "eye-off": EyeOff,
  factory: Factory,
  "file-check": FileCheck,
  "file-text": FileText,
  flag: Flag,
  globe: Globe,
  handshake: Handshake,
  headphones: Headphones,
  image: ImageIcon,
  landmark: Landmark,
  layers: Layers,
  "layout-grid": LayoutGrid,
  "list-ordered": ListOrdered,
  lock: Lock,
  magnet: Magnet,
  megaphone: Megaphone,
  "pen-tool": PenTool,
  percent: Percent,
  "pie-chart": PieChart,
  receipt: Receipt,
  route: Route,
  search: Search,
  "shield-check": ShieldCheck,
  "shopping-bag": ShoppingBag,
  stethoscope: Stethoscope,
  tag: Tag,
  target: Target,
  "trending-down": TrendingDown,
  "trending-up": TrendingUp,
  unplug: Unplug,
  users: Users,
  workflow: Workflow,
  wrench: Wrench,
  "x-circle": XCircle,
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
