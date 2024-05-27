'use client'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Masonry } from '@mui/lab';

import styles from './feed.module.css';
import LazyImage from "./lazyimage";
import AspectRatioBox from "./aspectRatioBox";
import useWindowWidth from '../hooks/useWindowWidth';
import Filter from "./filter";
import DisplayTypeSelector from "./displayTypeSelector";



enum DisplayType {
  FullWidth,
  Split,
  Thirds,
}

interface FeedProps {
  display?: DisplayType;
}

type photo = {
  url: string;
  aspectRatio: number;
};


export default function Feed({ display = DisplayType.Thirds }: FeedProps) {
  const [feed, setFeed] = useState<photo[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [desiredColumns, setDesiredColumns] = useState(3);
  
  const initialized = useRef(false);
  const loadingRef = useRef(false);
  const endRef = useRef(false);
  const pageRef = useRef(0);

  const loadMore = useCallback(async () => {
    console.log('loading more');
    if (loadingRef.current || endRef.current) return;
    loadingRef.current = true
    const pageToLoad = pageRef.current + 1;
    console.log('loading page:', pageToLoad);

    try {
      const res = await callApi('/api/feed', {
        page: pageToLoad,
        tags: tags.join(',')
      });

      console.log('loaded:', res);
      if (!res.photos) {
        endRef.current = true;
      } else {
        setFeed((prevFeed) => [...prevFeed, ...res.photos]);
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
      })
    }
  }, [loadMore]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= pageHeight * 0.95) {
        console.log('load more');
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  const width = useWindowWidth();
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    if (width < 720) {
      setColumns(1);
    } else if (width < 1200) {
      setColumns(2);
    } else {
      setColumns(3);
    }
  }, [width]);

  const resetFeed = useCallback((newTags: string[]) => {
    console.log('resetting feed with tags:', newTags);
    setTags(newTags);
    setFeed([]);
    pageRef.current = 0;
    endRef.current = false;
    loadingRef.current = false;
  }, []);

  // load more when tags change
  useEffect(() => {
      console.log("tags changed, loading more photos")
      loadMore();
  }, [tags, desiredColumns]);

  return (
    <div className={styles.container}>
      <Filter onUpdate={(newTags) => {
        console.log('filter updated', newTags);
        resetFeed(newTags);
      }}/>
      <DisplayTypeSelector onUpdate={(columnNumber) => setDesiredColumns(columnNumber)}/>
      { <Masonry columns={Math.min(columns, desiredColumns)} spacing={1}>
          {feed.map((photo: photo, i) => {
          return (
            <div key={i} className={styles.photo}>
              <AspectRatioBox aspectRatio={photo.aspectRatio}>
                <LazyImage url={photo.url} />
              </AspectRatioBox>
            </div>
          )
        })}
      </Masonry> }
    </div>
  );
}

type feedOptions = {
  cacheSeconds?: number;
  tags?: string;
  page?: number
};

const callApi = async (route: string, feedOptions: feedOptions = {}) => {
  let url = window.location.origin + route
  url += feedOptions.page ? `?page=${feedOptions.page}` : '';
  url += feedOptions.tags ? `&tags=${feedOptions.tags}` : '';

  console.log('fetching:', url);
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