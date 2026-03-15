interface SceneCopyProps {
  eyebrow: string;
  hero: string;
  plain: string;
  body: string;
  index: number;
}

const SceneCopy = ({ eyebrow, hero, plain, body, index }: SceneCopyProps) => {
  return (
    <div className="max-w-lg relative z-10">
      {/* Section number — IO style: large ghosted mono */}
      <div className="mb-6 flex items-end gap-4">
        <span className="font-mono text-[52px] font-bold leading-none text-foreground/[0.06] tracking-tight">
          /{String(index).padStart(2, "0")}
        </span>
      </div>
      {/* Eyebrow — Lekton mono with IO-style tracking */}
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-strong font-normal">
        /{String(index).padStart(2, "0")} · {eyebrow}
      </p>
      {/* Hero — Montserrat black */}
      <h2 className="mb-5 font-display text-[clamp(1.5rem,2.8vw,2.4rem)] font-black leading-[1.05] tracking-[-0.02em] text-foreground">
        {hero}
      </h2>
      {/* Prismatic accent bar */}
      <div className="mb-6 prismatic-bar w-16" />
      {/* Plain — Inter medium */}
      <p className="mb-4 text-[15px] leading-[1.7] text-foreground/80 font-medium">
        {plain}
      </p>
      {/* Body — Inter regular */}
      <p className="text-[14px] leading-[1.75] text-ink-strong">
        {body}
      </p>
    </div>
  );
};

export default SceneCopy;
