interface SceneCopyProps {
  eyebrow: string;
  hero: string;
  plain: string;
  body: string;
}

const SceneCopy = ({ eyebrow, hero, plain, body }: SceneCopyProps) => {
  return (
    <div className="max-w-lg">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40">
        {eyebrow}
      </p>
      <h2 className="mb-4 text-[clamp(1.8rem,3.5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-foreground">
        {hero}
      </h2>
      <p className="mb-3 text-lg leading-relaxed text-foreground/80">
        {plain}
      </p>
      <p className="text-base leading-relaxed text-foreground/60">
        {body}
      </p>
    </div>
  );
};

export default SceneCopy;
