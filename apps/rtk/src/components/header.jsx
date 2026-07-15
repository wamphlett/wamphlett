'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link"

import {InstaLogo, FlickrLogo } from "@/components/svgs"

import styles from "./header.module.css"

export default function Header({ position = 24}) {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    setWindowHeight(window.innerHeight);
    window.addEventListener("scroll", handleScroll);
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const startTransition = 0.5 * windowHeight; // 80vh
  const endTransition = .9 * windowHeight; // 110vh

  let namePosition;
  let bgOpacity;
  if (scrollY <= startTransition) {
    namePosition = 100;
    bgOpacity = 0;
  } else if (scrollY >= endTransition) {
    namePosition = 0;
    bgOpacity = 0.6;
  } else {
    const transitionRange = endTransition - startTransition;
    const scrollProgress = scrollY - startTransition;
    namePosition = 100 - (scrollProgress / transitionRange) * 100;
    bgOpacity = (scrollProgress / transitionRange) * 0.6;
  }

  const handleClick = (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div>
      <div
        className={ `flex flex-column content-between ${styles.container}` }
        style={{
          height: 100,
          left: position,
          top: position,
          right: position,
          backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
        }}
      >
        <div className={ `flex flex-row ${styles.social}` }>
          <div className={styles.icon}>
            <Link href="https://www.instagram.com/warrenamphlett/" passHref target="_blank">
              <InstaLogo />
            </Link>
          </div>
          {/* <div className={styles.icon}>
            <Link href="https://lightroom.adobe.com/u/warrenamphlett" passHref target="_blank">
              <LightroomLogo />
            </Link>
          </div> */}
          <div className={styles.icon}>
            <Link
              href="https://www.flickr.com/photos/199526751@N07/"
              passHref
              target="_blank"
            >
              <FlickrLogo />
            </Link>
          </div>
        </div>

        <h1 className={styles.title} style={{top:-namePosition}}><Link href="/" onClick={handleClick} passHref>Warren Amphlett<span>.</span></Link></h1>

        <div className={styles.links}>
          <Link href="https://photos.warrenamphlett.co.uk/">Photos</Link>
          <Link href="https://blog.warrenamphlett.co.uk/">Blog</Link>
        </div>

      </div>

  </div>
  );
}
