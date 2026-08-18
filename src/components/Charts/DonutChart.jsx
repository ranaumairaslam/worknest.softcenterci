

export default function DonutChart({ segments, size = 180, thickness = 28 }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const arcs = segments.reduce((acc, s) => {
    const dash = (s.value / total) * circumference;
    const previousOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    acc.push({ ...s, dash, offset: previousOffset });
    return acc;
  }, []);

  return (
    <div className="flex items-center gap-8">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((s) => (
          <circle
            key={s.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
      <ul className="space-y-3">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-slate-600">{s.label}</span>
            <span className="text-slate-400 ml-2">{s.value} ({s.percent}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}