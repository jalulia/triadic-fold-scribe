interface SceneCopyProps {
  eyebrow: string;
  hero: string;
  plain: string;
  body: string;
  index: number;
}

const SceneCopy = ({ eyebrow, hero, plain, body, index }: SceneCopyProps) => {
  return (
    <div className="max-w-lg">
      {/* Section number */}
      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-[32px] font-semibold leading-none text-ink-faint">
          {String(index).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-ink-faint" />
      </div>
      {/* Eyebrow */}
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/50 font-medium">
        {eyebrow}
      </p>
      {/* Hero */}
      <h2 className="mb-5 text-[clamp(1.6rem,3vw,2.8rem)] font-bold leading-[1.08] tracking-tight text-foreground">
        {hero}
      </h2>
      {/* Divider */}
      <div className="mb-5 h-0.5 w-12 bg-accent" />
      {/* Plain */}
      <p className="mb-4 text-[17px] leading-[1.65] text-foreground/75 font-medium">
        {plain}
      </p>
      {/* Body */}
      <p className="text-[15px] leading-[1.7] text-foreground/55">
        {body}
      </p>
    </div>
  );
};

export default SceneCopy;
