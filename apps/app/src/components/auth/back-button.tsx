import Link from 'next/link';

interface BackButtonProps {
  label: string;
  linkLabel: string;
  href: string;
}

export const BackButton = ({ label, linkLabel, href }: BackButtonProps) => {
  return (
    <div className="flex flex-row items-center gap-1">
      <span className="text-[13px] text-muted-foreground leading-snug">
        {label}
      </span>
      <Link
        href={href}
        className="font-normal text-[13px] leading-snug underline"
      >
        {linkLabel}
      </Link>
    </div>
  );
};
