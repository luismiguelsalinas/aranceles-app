import clsx from "clsx";

export default function Card({ title, icon: Icon, children, className }) {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 w-full max-w-5xl",
        "border border-zinc-200 dark:border-zinc-800",
        className
      )}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && <Icon className="w-6 h-6 opacity-80 text-indigo-500" />}
          {title && <h3 className="text-xl font-bold">{title}</h3>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
    </div>
  );
}
