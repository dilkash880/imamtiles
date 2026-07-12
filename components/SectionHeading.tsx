type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-600 dark:text-indigo-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
        {title}
      </h2>
      <div className={align === "center" ? "mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" : "mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"} />
      <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}
