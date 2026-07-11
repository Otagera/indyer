export function PaperGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        backgroundImage: "radial-gradient(rgba(20,18,16,0.06) 0.6px, transparent 0.6px)",
        backgroundSize: "3px 3px",
        opacity: 0.55,
      }}
    />
  );
}
