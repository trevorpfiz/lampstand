import Image from 'next/image';

interface HeaderProps {
  headerTitle: string;
  headerSubtitle: string;
}

export const Header = ({ headerTitle, headerSubtitle }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <Image src="/icon.png" alt="Lampstand" width={24} height={24} />

      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="font-bold text-[17px] leading-6">{headerTitle}</h1>
        <p className="text-[13px] text-muted-foreground leading-snug">
          {headerSubtitle}
        </p>
      </div>
    </div>
  );
};
