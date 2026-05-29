import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  accent?: "cyan" | "fuchsia" | "amber";
  icon?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View All",
  accent = "cyan",
  icon,
}: SectionHeaderProps) {
  const barColor = {
    cyan:    "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]",
    fuchsia: "bg-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.6)]",
    amber:   "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]",
  }[accent];

  const gradientText = {
    cyan:    "from-cyan-400 to-fuchsia-400",
    fuchsia: "from-fuchsia-400 to-cyan-400",
    amber:   "from-amber-400 to-orange-400",
  }[accent];

  const linkColor = {
    cyan:    "text-cyan-400 hover:text-cyan-300",
    fuchsia: "text-fuchsia-400 hover:text-fuchsia-300",
    amber:   "text-amber-400 hover:text-amber-300",
  }[accent];

  return (
    <div className="flex items-end justify-between mb-6 gap-4">
      <div>
        <div className={`w-12 h-1 ${barColor} rounded-full mb-3`} />
        <h2
          className={`text-2xl font-black bg-gradient-to-r ${gradientText} bg-clip-text text-transparent leading-none flex items-center gap-2`}
        >
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        {subtitle && (
          <p className="text-fuchsia-200/45 text-sm mt-1.5">{subtitle}</p>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className={`text-sm font-semibold flex items-center gap-1 transition-colors shrink-0 ${linkColor}`}
        >
          {viewAllLabel}
          <span className="text-xs">→</span>
        </Link>
      )}
    </div>
  );
}
