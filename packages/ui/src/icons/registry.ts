import type { ComponentType } from 'react';
import { InstagramIcon } from './InstagramIcon';
import { FlickrIcon } from './FlickrIcon';
import { GithubIcon } from './GithubIcon';
import { LinkedInIcon } from './LinkedInIcon';

export type SocialLinkName = 'instagram' | 'flickr' | 'github' | 'linkedin';

export const socialIconRegistry: Record<SocialLinkName, ComponentType> = {
  instagram: InstagramIcon,
  flickr: FlickrIcon,
  github: GithubIcon,
  linkedin: LinkedInIcon,
};
