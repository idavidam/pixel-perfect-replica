import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";
import { CategoryIcon } from "./category-icon";

export function catStyle(color?: string | null): CSSProperties {
  return { ["--cat" as string]: color ?? "var(--primary)" } as CSSProperties;
}

export function CategoryBadge({
  category,
  variant = "solid",
  className,
}: {
  category: Pick<Category, "nombre" | "color" | "icono"> | null | undefined;
  variant?: "solid" | "soft";
  className?: string;
}) {
  if (!category) return null;
  return (
    <span
      style={catStyle(category.color)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        variant === "solid" ? "cat-solid shadow-sm" : "cat-soft",
        className,
      )}
    >
      <CategoryIcon name={category.icono} className="size-3.5" />
      {category.nombre}
    </span>
  );
}
