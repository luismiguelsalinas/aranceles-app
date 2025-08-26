export default function Badge({ children }) {
  return (
    <span className="px-2 py-1 rounded-full text-xs bg-zinc-100 dark:bg-zinc-800">
      {children}
    </span>
  );
}