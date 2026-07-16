import type { SocialLinkName } from '../icons/registry';

export type SocialLink = {
  name: SocialLinkName;
  href: string;
};

export type NavLink = {
  name: string;
  link: string;
};
