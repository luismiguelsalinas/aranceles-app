export default function Stat({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-zinc-500">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}