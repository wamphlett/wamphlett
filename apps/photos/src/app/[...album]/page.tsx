import { Metadata } from 'next';
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
  params: Promise<{
    album: string[];
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { album: albumPath } = await params;
  const album = getAlbum(`/${albumPath.join('/')}`);
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
  const { album: albumPath } = await params;
  const album = getAlbum(`/${albumPath.join('/')}`);
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
      headerImageBlurDataURL={blurDataURL}
      headerImageUrl={album.headerImageUrl}
    >
      <GalleryTitle
        description={album.description}
        primary={album.title}
        secondary={album.year.toString()}
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
                  aspectRatio={image.aspectRatio}
                  images={image.images}
                  key={index}
                />
              );
            case Grids.Double:
            case Grids.DoubleInverted:
              return (
                <Double
                  images={image.images}
                  inverted={image.grid == Grids.DoubleInverted}
                  key={index}
                />
              );
            case Grids.TriWide:
            case Grids.TriWideInverted:
              return (
                <TriWide
                  images={image.images}
                  inverted={image.grid == Grids.TriWideInverted}
                  key={index}
                />
              );
            case Grids.TriSquare:
            case Grids.TriSquareInverted:
              return (
                <TriSquare
                  images={image.images}
                  inverted={image.grid == Grids.TriSquareInverted}
                  key={index}
                />
              );
            case Grids.Offset:
            case Grids.OffsetInverted:
              return (
                <Offset
                  images={image.images}
                  inverted={image.grid == Grids.OffsetInverted}
                  key={index}
                />
              );
            case Grids.OffsetTall:
            case Grids.OffsetTallInverted:
              return (
                <Offset
                  images={image.images}
                  inverted={image.grid == Grids.OffsetTallInverted}
                  key={index}
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
