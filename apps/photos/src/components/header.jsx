'use client'
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'

import FancyMenuIcon from "@/components/fancyMenuIcon"
import Sidebar from "./sidebar";
import {InstaLogo, FlickrLogo } from "@/components/svgs"

import styles from "./header.module.css"

export default function Header({ position = 24 }) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the menu is open and the click was outside the menu, close it
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    // Cleanup: remove the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  return (
    <div>
      <div
        className={ `flex flex-column content-between ${styles.container}` }
        style={{
          height: 100,
          left: position,
          top: position,
          right: position,
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
            <Link href="https://www.flickr.com/photos/199526751@N07/" passHref target="_blank">
              <FlickrLogo />
            </Link>
          </div>
        </div>

        <h1 className={styles.title}><Link href={usePathname() == '/' ? 'https://warrenamphlett.co.uk' : '/'}>Warren Amphlett<span>.</span></Link></h1>

        <div className="relative" onClick={() => setOpen(!open)} ref={menuRef}>
          <FancyMenuIcon open={open} />
        </div>

      </div>

      <Sidebar open={open} />
    </div>
  );
}
