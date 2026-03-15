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
      {/* Eyebrow — quiet mono label */}
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        /{String(index).padStart(2, "0")} — {eyebrow}
      </p>
      {/* Hero — Montserrat, high contrast */}
      <h2 className="mb-4 font-display text-[clamp(1.4rem,2.5vw,2.1rem)] font-black leading-[1.1] tracking-[-0.02em] text-foreground">
        {hero}
      </h2>
      {/* Accent rule — thin yellow line, understated */}
      <div className="mb-5 h-px w-12 bg-accent" />
      {/* Plain — key takeaway */}
      <p className="mb-3 text-[15px] leading-[1.7] text-foreground/80 font-medium">
        {plain}
      </p>
      {/* Body */}
      <p className="text-[13px] leading-[1.75] text-muted-foreground">
        {body}
      </p>
    </div>
  );
};

export default SceneCopy;
