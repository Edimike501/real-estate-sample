interface SectionLabelProps {
  label: string;
  heading: string;
  subtext?: string;
}

export default function SectionLabel({
  label,
  heading,
  subtext
}: SectionLabelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-sm font-semibold text-accent uppercase tracking-wide">
          {label}
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight">
        {heading}
      </h2>
      {subtext && (
        <p className="text-lg text-text-secondary max-w-2xl">{subtext}</p>
      )}
    </div>
  );
}
