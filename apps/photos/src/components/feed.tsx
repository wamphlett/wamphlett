'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Masonry } from '@mui/lab';

import styles from './feed.module.css';
import { AspectRatioBox, LazyImage } from '@wamphlett/ui';
import useWindowWidth from '../hooks/useWindowWidth';
import Filter from './filter';
import DisplayTypeSelector from './displayTypeSelector';

type photo = {
  url: string;
  aspectRatio: number;
};

export default function Feed() {
  const [feed, setFeed] = useState<photo[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [desiredColumns, setDesiredColumns] = useState(3);

  const initialized = useRef(false);
  const loadingRef = useRef(false);
  const endRef = useRef(false);
  const pageRef = useRef(0);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || endRef.current) {
      return;
    }
    loadingRef.current = true;
    const pageToLoad = pageRef.current + 1;

    try {
      const res = await callApi('/api/feed', {
        page: pageToLoad,
        tags: tags.join(','),
      });

      if (!res.photos) {
        endRef.current = true;
      } else {
        setFeed(prevFeed => [...prevFeed, ...res.photos]);
        pageRef.current = pageToLoad;
      }
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      loadingRef.current = false;
    }
  }, [tags]);

  useEffect(() => {
    if (!initialized.current) {
      loadMore().then(() => {
        initialized.current = true;
      });
    }
  }, [loadMore]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= pageHeight * 0.95) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  const width = useWindowWidth();
  const columns = width < 720 ? 1 : width < 1200 ? 2 : 3;

  const resetFeed = useCallback((newTags: string[]) => {
    setTags(newTags);
    setFeed([]);
    pageRef.current = 0;
    endRef.current = false;
    loadingRef.current = false;
  }, []);

  // load more when tags change
  useEffect(() => {
    loadMore();
  }, [tags, desiredColumns]);

  return (
    <div className={styles.container}>
      <Filter
        onUpdate={newTags => {
          resetFeed(newTags);
        }}
      />
      <DisplayTypeSelector
        onUpdate={columnNumber => setDesiredColumns(columnNumber)}
      />
      {
        <Masonry columns={Math.min(columns, desiredColumns)} spacing={1}>
          {feed.map((photo: photo, i) => {
            return (
              <div className={styles.photo} key={i}>
                <AspectRatioBox aspectRatio={photo.aspectRatio}>
                  <LazyImage url={photo.url} />
                </AspectRatioBox>
              </div>
            );
          })}
        </Masonry>
      }
    </div>
  );
}

type feedOptions = {
  cacheSeconds?: number;
  tags?: string;
  page?: number;
};

const callApi = async (route: string, feedOptions: feedOptions = {}) => {
  let url = window.location.origin + route;
  url += feedOptions.page ? `?page=${feedOptions.page}` : '';
  url += feedOptions.tags ? `&tags=${feedOptions.tags}` : '';

  const res = await fetch(url, {
    next: {
      // cache all requests for 1 second by default
      revalidate: feedOptions.cacheSeconds || 1000,
      tags: ['everything'].concat(feedOptions.tags || []),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data from server. path: ' + route);
  }

  return await res.json();
};
