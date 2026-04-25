'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PhotoModal from './PhotoModal';
import { Photo } from './types';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function PhotoCard({
  photo,
  onEdit,
  onDelete,
}: {
  photo: Photo;
  onEdit: (p: Photo) => void;
  onDelete: (p: Photo) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm flex flex-col">
      <a href={photo.url} target="_blank" rel="noopener noreferrer" className="block bg-gray-100 shrink-0 relative h-44">
        {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
        <img
          src={photo.url}
          alt={photo.alt}
          className={`w-full h-44 object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
      </a>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-xs text-gray-400">{formatDate(photo.captureTime)}</p>
        {photo.alt && (
          <p className="text-sm text-gray-700 line-clamp-2 leading-snug">{photo.alt}</p>
        )}
        {photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {photo.tags.map(tag => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-2 flex gap-2">
          {confirmDelete ? (
            <>
              <span className="text-xs text-gray-500 self-center flex-1">Delete?</span>
              <button
                onClick={() => onDelete(photo)}
                className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                No
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(photo)}
                className="flex-1 text-xs border border-gray-300 rounded py-1.5 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex-1 text-xs border border-red-200 text-red-600 rounded py-1.5 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ManagePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; photo?: Photo }>({ open: false });
  const router = useRouter();

  const loadingRef = useRef(false);
  const endRef = useRef(false);
  const pageRef = useRef(0);
  const initializedRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || endRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(`/api/manage/photos?page=${pageRef.current + 1}`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();

      if (data.photos && data.photos.length > 0) {
        setPhotos(prev => [...prev, ...data.photos]);
        pageRef.current += 1;
      }
      if (!data.next || !data.photos || data.photos.length === 0) {
        endRef.current = true;
      }
    } catch (err) {
      console.error(err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      loadMore();
    }
  }, [loadMore]);

  // Scroll-based infinite load
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled >= total * 0.9) loadMore();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // If first batch doesn't fill the viewport, keep loading
  useEffect(() => {
    if (!loading && !endRef.current && photos.length > 0) {
      if (document.documentElement.scrollHeight <= window.innerHeight + 100) {
        loadMore();
      }
    }
  }, [loading, photos.length, loadMore]);

  const handleLogout = async () => {
    await fetch('/api/manage/auth', { method: 'DELETE' });
    router.push('/manage/login');
  };

  const handleDelete = async (photo: Photo) => {
    const params = photo.tags.length > 0 ? `?tags=${photo.tags.join(',')}` : '';
    const res = await fetch(`/api/manage/photos/${photo.id}${params}`, { method: 'DELETE' });
    if (res.ok) setPhotos(prev => prev.filter(p => p.id !== photo.id));
  };

  const handleSave = (saved: Photo) => {
    setPhotos(prev => {
      const exists = prev.findIndex(p => p.id === saved.id);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setModal({ open: false });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Manage Photos</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setModal({ open: true })}
              className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              + Add Photo
            </button>
            <button
              onClick={handleLogout}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {photos.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-24 text-sm">No photos yet.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onEdit={p => setModal({ open: true, photo: p })}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="text-sm text-gray-400">Loading...</div>
          </div>
        )}

        {!loading && endRef.current && photos.length > 0 && (
          <p className="text-center text-xs text-gray-300 py-8">{photos.length} photos</p>
        )}
      </div>

      {/* Modal */}
      {modal.open && (
        <PhotoModal
          photo={modal.photo}
          onClose={() => setModal({ open: false })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
