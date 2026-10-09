// Small decorative green chart line used in the market strip.
export default function Sparkline({ seed = 1, width = 90, height = 34 }) {
  const n = 14;
  let v = 0.2;
  const pts = Array.from({ length: n }, (_, i) => {
    const r = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
    v += (r - Math.floor(r) - 0.38) * 0.22 + 0.04;
    return v;
  });
  const min = Math.min(...pts), max = Math.max(...pts);
  const d = pts
    .map((p, i) => {
      const x = (i / (n - 1)) * width;
      const y = height - ((p - min) / (max - min || 1)) * (height - 4) - 2;
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg className="spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={`${d} L${width} ${height} L0 ${height} Z`} fill="rgba(34,197,94,.14)" />
      <path d={d} fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
