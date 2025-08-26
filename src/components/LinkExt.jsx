import { ExternalLink } from "lucide-react";

export default function LinkExt({ href, children }) {
  return (
    <a
      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children} <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}
