import clsx from "clsx";

export default function Card({ title, icon: Icon, children, className }) {
  return (
    <div
      className={clsx(
        "bg-white/80 dark:bg-zinc-900/60 backdrop-blur rounded-2xl shadow p-5",
        className
      )}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-2 mb-3">
          {Icon && <Icon className="w-5 h-5 opacity-80" />}
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}
