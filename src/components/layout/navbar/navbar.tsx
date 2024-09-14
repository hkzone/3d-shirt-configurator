'use client';

import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from '@nextui-org/navbar';
import { link as linkStyles } from '@nextui-org/theme';
import clsx from 'clsx';
import NextLink from 'next/link';
import { useState } from 'react';

import { Logo } from '@/components/common/icons';
import { ThemeSwitch } from '@/components/layout/theme-switch';
import { siteConfig } from '@/config/site';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <NextUINavbar
      className='h-navbarHeight xxl:max-w-[min(95vw,120rem)] mx-auto px-3'
      isMenuOpen={isMenuOpen}
      maxWidth='full'
      position='sticky'
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='gap-3 max-w-fit'>
          <NextLink className='flex justify-start items-center gap-1' href='/'>
            <Logo className='fill-primary' />
            <p className='font-semibold text-inherit font-title tracking-[0.02em] text-[1.3rem]'>Napolifit</p>
          </NextLink>
        </NavbarBrand>
        <ul className='hidden sm:flex gap-4 justify-start ml-2'>
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
                )}
                color='foreground'
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className='hidden sm:flex basis-1/5 sm:basis-full' justify='end'>
        <NavbarItem className='hidden sm:flex gap-2'>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                color={index === 2 ? 'primary' : index === siteConfig.navMenuItems.length - 1 ? 'danger' : 'foreground'}
                href={item.href}
                onClick={() => {
                  setIsMenuOpen((prev: boolean) => !prev);
                }}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
