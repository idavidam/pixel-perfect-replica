import { cn } from "@/lib/utils";
import { formatDay, formatMonthShort, formatWeekdayShort } from "@/lib/format";

export function DateChip({ date, className }: { date: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex w-14 flex-col items-center overflow-hidden rounded-xl bg-card text-center shadow-card",
        className,
      )}
    >
      <span className="w-full bg-primary py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground">
        {formatMonthShort(date)}
      </span>
      <span className="font-display text-2xl font-extrabold leading-tight text-foreground">{formatDay(date)}</span>
      <span className="pb-1 text-[10px] font-medium uppercase text-muted-foreground">{formatWeekdayShort(date)}</span>
    </div>
  );
}
