import {
  Briefcase, Bus, Globe, GraduationCap, HeartHandshake, Megaphone, Mic, PartyPopper, Sparkles, Trophy,
  BookOpen, Calendar, Code, FlaskConical, Music, Palette, Users, Leaf, Rocket, Star,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  HeartHandshake, Mic, Trophy, GraduationCap, Megaphone, PartyPopper, Globe, Briefcase, Bus, Sparkles,
  BookOpen, Calendar, Code, FlaskConical, Music, Palette, Users, Leaf, Rocket, Star,
};

export function CategoryIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = (name && CATEGORY_ICONS[name]) || Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}
