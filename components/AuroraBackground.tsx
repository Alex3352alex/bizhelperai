export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* faint grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* aurora blobs */}
      <div className="absolute -left-32 -top-40 h-[36rem] w-[36rem] animate-aurora-1 rounded-full bg-brand-indigo/25 blur-[120px]" />
      <div className="absolute -right-24 top-10 h-[32rem] w-[32rem] animate-aurora-2 rounded-full bg-brand-violet/25 blur-[130px]" />
      <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] animate-aurora-1 rounded-full bg-brand-sky/15 blur-[120px]" />

      {/* vignette to keep edges deep */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_40%,rgba(7,7,17,0.85)_100%)]" />
    </div>
  );
}
