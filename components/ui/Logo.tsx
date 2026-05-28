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
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/images/opollo-luxury.png"
        alt="Opollo Luxury Properties Logo"
        width={width}
        height={height}
        priority
        className="w-auto h-auto"
      />
      {showText && (
        <span className="font-display font-bold text-lg hidden sm:inline text-accent">
          Opollo Luxury
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
