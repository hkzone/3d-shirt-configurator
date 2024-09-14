export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Napolifit - 3D shirt configurator',
  description: 'Custom made Neapolitan shirts for the gentlemen.',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Configurator',
      href: '/configurator',
    },
  ],
  navMenuItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Configurator',
      href: '/configurator',
    },
  ],
  links: {
    github: 'https://github.com/',
    twitter: 'https://twitter.com/',
    docs: 'https://nextui.org',
    discord: 'https://discord.gg/',
  },
};
