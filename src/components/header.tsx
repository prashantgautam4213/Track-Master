"use client";

import Link from 'next/link';
import { LogOut, Menu, Search, Ticket, Train, User as UserIcon } from 'lucide-react';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/search', label: 'Search Trains', icon: Search },
  { href: '/trains', label: 'All Schedules', icon: Train },
  { href: '/fare-enquiry', label: 'Fare Enquiry', icon: Ticket },
];

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  const UserNav = () => {
    if (isAuthenticated && user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary">
                    {user.name.charAt(0)}
                </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Register</Link>
        </Button>
      </div>
    );
  };
  
  const NavLinksDesktop = () => (
    <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
      {navLinks.map(({ href, label }) => (
        <Link key={href} href={href} className="text-muted-foreground transition-colors hover:text-foreground">
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="font-headline">Track Master</span>
          </Link>
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-8">
                    <Ticket className="h-6 w-6 text-primary" />
                    <span className="font-headline">Track Master</span>
                </Link>
                <nav className="grid gap-2 text-lg font-medium">
                    {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <Icon className="h-5 w-5" />
                        {label}
                    </Link>
                    ))}
                </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between md:justify-end space-x-2">
            <div className="flex-1 md:flex-grow-0 md:justify-start">
              <NavLinksDesktop />
            </div>
            <UserNav />
        </div>
      </div>
    </header>
  );
}
