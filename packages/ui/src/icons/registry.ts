import type { ComponentType } from 'react';
import { InstagramIcon } from './InstagramIcon';
import { FlickrIcon } from './FlickrIcon';
import { GithubIcon } from './GithubIcon';

export type SocialLinkName = 'instagram' | 'flickr' | 'github';

export const socialIconRegistry: Record<SocialLinkName, ComponentType> = {
  instagram: InstagramIcon,
  flickr: FlickrIcon,
  github: GithubIcon,
};
