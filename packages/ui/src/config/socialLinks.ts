import type { SocialLink } from '../Header/types';
import type { SocialLinkName } from '../icons/registry';

/** The same social links appear in every app's header -- change them here once. */
export const socialLinks: SocialLink[] = [
  { name: 'instagram', href: 'https://www.instagram.com/warren.a.photography/' },
  { name: 'flickr', href: 'https://www.flickr.com/photos/199526751@N07/' },
  { name: 'github', href: 'https://github.com/wamphlett/' },
  { name: 'linkedin', href: 'https://www.linkedin.com/in/warren-amphlett-5bb9b6170/' },
];

/** Look up a single link's URL, e.g. for use outside the header (like a bio section). */
export function getSocialLink(name: SocialLinkName): string {
  const link = socialLinks.find(social => social.name === name);
  if (!link) {
    throw new Error(`No social link configured for "${name}"`);
  }
  return link.href;
}

/** The subset of socialLinks shown in every app's header -- linkedin is deliberately
 * excluded here (it's still available via socialLinks/getSocialLink elsewhere, e.g. a bio). */
export const headerSocialLinks: SocialLink[] = socialLinks.filter(
  social => social.name !== 'linkedin',
);
