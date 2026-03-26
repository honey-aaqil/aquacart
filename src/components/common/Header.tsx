'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LayoutGrid, LogIn, LogOut, ShoppingCart, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/lib/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: React.ElementType }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <Button variant={isActive ? 'secondary' : 'ghost'} className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {children}
      </Button>
    </Link>
  );
};

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === ROLES.ADMIN;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };
  
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/shop" className="mr-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5Z"></path><path d="M4.68343 14.8519C4.68343 14.8519 6.84918 17.5 12 17.5C17.1508 17.5 19.3166 14.8519 19.3166 14.8519C20.9854 12.8223 22 13.5 22 16C22 18.5 22 21 22 21H2C2 21 2 18.5 2 16C2 13.5 3.01458 12.8223 4.68343 14.8519Z"></path></svg>
          <span className="font-bold text-lg text-primary">AquaCart</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-2 flex-1">
          <NavLink href="/shop" icon={LayoutGrid}>Shop</NavLink>
          <NavLink href="/cart" icon={ShoppingCart}>Cart</NavLink>
          {isAdmin && <NavLink href="/admin" icon={Crown}>Admin</NavLink>}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {status === 'loading' ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user.name ?? ''} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" passHref>
              <Button>
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
