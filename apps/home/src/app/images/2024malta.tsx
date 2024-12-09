import { buildImages, libraryUrl } from '../data';

export default buildImages(libraryUrl('2024/malta'), {
  boat: {
    title: 'Crowded harbour',
    description: 'Lots of day trips from the port',
    url: 'boat.jpg',
  },
  church: {
    title: 'Amazing sunsets',
    description: 'Chasing the sun in Malta',
    url: 'church.jpg',
  },
  cliffs: {
    title: 'Stunning views',
    description: 'Helps to have a friend who knows the best spots',
    url: 'cliffs.jpg',
  },
});
