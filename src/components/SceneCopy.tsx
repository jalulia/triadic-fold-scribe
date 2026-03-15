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
      {/* Section number + rule */}
      <div className="mb-8 flex items-center gap-4">
        <span className="font-mono text-[36px] font-semibold leading-none text-ink-medium tracking-tight">
          {String(index).padStart(2, "0")}
        </span>
        <span className="h-[2px] flex-1 bg-accent" />
      </div>
      {/* Eyebrow */}
      <p className="mb-6 font-mono text-[12px] uppercase tracking-[0.25em] text-ink-strong font-medium">
        {eyebrow}
      </p>
      {/* Hero */}
      <h2 className="mb-6 text-[clamp(1.6rem,3vw,2.6rem)] font-bold leading-[1.1] tracking-tight text-foreground">
        {hero}
      </h2>
      {/* Accent bar */}
      <div className="mb-6 h-[3px] w-10 bg-accent" />
      {/* Plain */}
      <p className="mb-4 text-[16px] leading-[1.75] text-foreground/85 font-medium">
        {plain}
      </p>
      {/* Body */}
      <p className="text-[15px] leading-[1.75] text-ink-strong">
        {body}
      </p>
    </div>
  );
};

export default SceneCopy;
