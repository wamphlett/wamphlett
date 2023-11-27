import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { getAlbum } from '../data';
import { AlbumData, ContentType, Grids } from '../types';
import { getBlurUrl } from '../loaders';

import PrimaryLayout from '@/layouts/primary';
import GalleryTitle from '@/components/gallerytitle';
import More from '@/components/more';
import Row from '@/components/imagegrids/row';
import Double from '@/components/imagegrids/double';
import TriWide from '@/components/imagegrids/triWide';
import TriSquare from '@/components/imagegrids/triSquare';
import Offset, { Type as OffsetTypes } from '@/components/imagegrids/offset';
import YouTube from '@/components/youtube';

type PageProps = {
  params: {
    album: string[];
  };
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const album = getAlbum(`/${params.album.join('/')}`);
  if (!album) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist',
    };
  }

  return {
    title: `${album.title} ${album.year}`,
    description: album.description,
    authors: { name: 'Warren Amphlett' },
    openGraph: {
      title: `${album.title} ${album.year} | Warren Amphlett Photos`,
      description: album.description,
      images: album.tileImageUrl,
      locale: 'en_GB',
      type: 'article',
      authors: 'Warren Amphlett',
    },
  };
}

export default async function Page({ params }: PageProps) {
  const album = getAlbum(`/${params.album.join('/')}`);
  if (!album) {
    return notFound();
  }

  const blurDataURL = await getBlurUrl(album.headerImageUrl);

  const moreAlbums: AlbumData[] = [];
  album.moreLinks.map(url => {
    moreAlbums.push(getAlbum(url));
  });

  return (
    <PrimaryLayout
      headerImageUrl={album.headerImageUrl}
      headerImageBlurDataURL={blurDataURL}
    >
      <GalleryTitle
        primary={album.title}
        secondary={album.year.toString()}
        description={album.description}
      />

      {album.grids.map((image, index) => {
        if (image.kind == ContentType.YoutubeVideo) {
          return <YouTube key={index} link={image.link} />;
        }

        if (image.kind == ContentType.ImageGrid) {
          switch (image.grid) {
            case Grids.Row:
              return (
                <Row
                  key={index}
                  images={image.images}
                  aspectRatio={image.aspectRatio}
                />
              );
            case Grids.Double:
            case Grids.DoubleInverted:
              return (
                <Double
                  key={index}
                  inverted={image.grid == Grids.DoubleInverted}
                  images={image.images}
                />
              );
            case Grids.TriWide:
            case Grids.TriWideInverted:
              return (
                <TriWide
                  key={index}
                  inverted={image.grid == Grids.TriWideInverted}
                  images={image.images}
                />
              );
            case Grids.TriSquare:
            case Grids.TriSquareInverted:
              return (
                <TriSquare
                  key={index}
                  inverted={image.grid == Grids.TriSquareInverted}
                  images={image.images}
                />
              );
            case Grids.Offset:
            case Grids.OffsetInverted:
              return (
                <Offset
                  key={index}
                  inverted={image.grid == Grids.OffsetInverted}
                  images={image.images}
                />
              );
            case Grids.OffsetTall:
            case Grids.OffsetTallInverted:
              return (
                <Offset
                  key={index}
                  inverted={image.grid == Grids.OffsetTallInverted}
                  images={image.images}
                  type={OffsetTypes.Tall}
                />
              );
          }
        }
      })}

      <More tiles={moreAlbums} />
    </PrimaryLayout>
  );
}
