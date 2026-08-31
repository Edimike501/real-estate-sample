import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  width?: number;
  height?: number;
  className?: string;
  showText?: boolean;
}

export default function Logo({
  href = '/',
  width = 40,
  height = 40,
  className = '',
  showText = false
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/images/aura-logo.jpg"
        alt="Aura Luxury Properties Logo"
        width={width}
        height={height}
        priority
        className="w-auto h-auto rounded-lg shadow-sm border border-emerald-500/20 object-cover"
      />
      {showText && (
        <span className="font-display font-bold text-lg hidden sm:inline text-accent tracking-wide">
          Aura Luxury
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
