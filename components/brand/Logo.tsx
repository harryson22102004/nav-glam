import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/format";

export function Logo({
  src,
  tone = "ivory",
  compact = false,
  priority = false,
}: {
  src: string | null;
  tone?: "ivory" | "ink";
  compact?: boolean;
  priority?: boolean;
}) {
  const color = tone === "ivory" ? "text-ivory" : "text-ink";
  return (
    <Link href="/" className={cn("logo-lockup items-center", color)} aria-label="UH home">
      {src ? (
        <Image
          src={src}
          alt="UH monogram"
          width={compact ? 52 : 62}
          height={compact ? 40 : 48}
          priority={priority}
          className={cn("w-auto object-contain", compact ? "h-8" : "h-9 md:h-10")}
        />
      ) : (
        <svg
          viewBox="0 0 88 68"
          aria-hidden="true"
          className={cn("w-auto shrink-0", compact ? "h-8" : "h-9 md:h-10")}
        >
          <defs>
            <linearGradient id="uh-mark-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e6c68e" />
              <stop offset="0.48" stopColor="#b88a4a" />
              <stop offset="1" stopColor="#795b36" />
            </linearGradient>
          </defs>
          <path
            d="M7 7h17v29c0 14 7 22 20 22s20-8 20-22V7h17v30c0 23-14 35-37 35S7 60 7 37V7Z"
            fill="none"
            stroke="url(#uh-mark-gold)"
            strokeWidth="5"
          />
          <path
            d="M47 7h16v22h18v14H63v23H47V43H30V29h17V7Z"
            fill="url(#uh-mark-gold)"
          />
        </svg>
      )}
    </Link>
  );
}
