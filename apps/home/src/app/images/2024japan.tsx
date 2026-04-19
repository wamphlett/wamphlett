import { buildImages, libraryUrl } from '../data';

export default buildImages(libraryUrl('2024/japan'), {
  castleWork: {
    title: 'Castle Work',
    description:
      'Working in Japan for 5 weeks, living in Tokyo and Osaka.',
    url: 'castle-work.jpg',
  },
  teamlabs: {
    title: 'Team labs',
    description:
      'A digital art museum in Tokyo.',
    url: 'teamlabs.jpg',
  },
  udon: {
    title: 'Udon!',
    description:
      'Incredible place, incredible food, incredible company.',
    url: 'me_and_waka.jpg',
  },
  newFriends: {
    title: 'New friends',
    description:
      'Sometimes you just click.',
    url: 'me_and_raf.jpg',
  },
  sakura: {
    title: 'Sakura',
    description:
      'The blossoms really are amazing.',
    url: 'sakura.jpg',
  },
});
