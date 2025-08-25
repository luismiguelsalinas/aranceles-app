export default function Card({ title, icon: Icon, children }) {
  return (
    <div className="bg-white/80 dark:bg-zinc-900/60 rounded-2xl shadow p-5">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-5 h-5" />}
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
      </div>
      {children}
    </div>
  );
}
