import { Separator } from '@lamp/ui/components/separator';
import { SidebarTrigger } from '@lamp/ui/components/sidebar';

import { UserButton } from '~/components/auth/user-button';
import { NavActions } from '~/components/sidebar/nav-actions';

interface AppHeaderProps {
  isStudyRoute?: boolean;
  studyTitle?: string;
}

export function AppHeader(props: AppHeaderProps) {
  const { isStudyRoute, studyTitle } = props;

  return (
    <header className="sticky top-0 flex h-[57px] w-full shrink-0 items-center gap-2 border-b bg-background px-4 py-3">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        {isStudyRoute && (
          <>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p>{studyTitle}</p>
          </>
        )}
      </div>

      {isStudyRoute && (
        <div className="flex items-center">
          <NavActions />
        </div>
      )}

      <div className="flex items-center">
        <UserButton />
      </div>
    </header>
  );
}
