import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Check,
  Trash2,
  ExternalLink,
  Info,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';
import { NewsMediaItem } from '../../types';

interface MediaLibraryViewProps {
  media: NewsMediaItem[];
  onUploadMedia: (item: Omit<NewsMediaItem, 'id' | 'uploadedDate' | 'usageCount'>) => void;
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  media,
  onUploadMedia
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<NewsMediaItem | null>(media[0] || null);

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filename, setFilename] = useState('');
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [source, setSource] = useState('');
  const [license, setLicense] = useState('Creative Commons CC-BY-NC');

  const filteredMedia = media.filter((m) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.filename.toLowerCase().includes(q) ||
      m.altText.toLowerCase().includes(q) ||
      m.caption.toLowerCase().includes(q) ||
      m.source.toLowerCase().includes(q)
    );
  });

  const handleUploadSubmit = () => {
    if (!url.trim()) {
      alert('Please provide an image URL.');
      return;
    }
    onUploadMedia({
      filename: filename || 'medical_asset.jpg',
      url,
      altText: altText || filename || 'Medical asset',
      caption,
      license,
      source: source || 'GlobalHealth Editorial Asset Bank',
      uploadedBy: 'Dr. Elena Rostova',
      dimensions: '1920x1080',
      fileSize: '1.5 MB'
    });
    setShowUploadModal(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-pink-700 uppercase tracking-wider mb-1">
            <ImageIcon className="h-4 w-4" /> Visual Asset Management
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            News Media Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Store, categorize, and license medical photography, infographics, and microscopy for articles.
          </p>
        </div>

        <button
          onClick={() => {
            setFilename('');
            setUrl('');
            setAltText('');
            setCaption('');
            setSource('');
            setShowUploadModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Image / Asset</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search media by filename, alt text, license..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-hidden"
        />
      </div>

      {/* Main Grid: Gallery & Asset Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery (8 Cols) */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredMedia.map((item) => {
              const isSelected = selectedMedia?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className={`cursor-pointer rounded-2xl overflow-hidden border bg-white p-2 transition shadow-2xs space-y-2 ${
                    isSelected
                      ? 'border-teal-500 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 h-32">
                    <img
                      src={item.url}
                      alt={item.altText}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.2 rounded-md bg-black/70 text-[9px] font-bold text-white">
                      {item.usageCount} uses
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-800 truncate" title={item.filename}>
                      {item.filename}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {item.uploadedDate} • {item.fileSize || '1.2 MB'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Asset Details (4 Cols, Section 22) */}
        <div className="lg:col-span-4">
          {selectedMedia ? (
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Asset Metadata & Licensing
              </div>

              <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.altText}
                  className="w-full h-44 object-cover"
                />
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Filename</label>
                  <div className="font-bold text-slate-900 truncate">{selectedMedia.filename}</div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Alt Text</label>
                  <div className="text-slate-700">{selectedMedia.altText || '—'}</div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Caption</label>
                  <div className="text-slate-700 italic">{selectedMedia.caption || '—'}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Dimensions</label>
                    <div className="font-mono text-slate-700">{selectedMedia.dimensions || '1920x1080'}</div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">File Size</label>
                    <div className="font-mono text-slate-700">{selectedMedia.fileSize || '1.4 MB'}</div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">License</label>
                  <div className="font-semibold text-teal-800 bg-teal-50 px-2 py-1 rounded-md text-[11px] border border-teal-100">
                    {selectedMedia.license}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Source / Attribution</label>
                  <div className="text-slate-700">{selectedMedia.source}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Uploaded by {selectedMedia.uploadedBy}</span>
                  <span>{selectedMedia.uploadedDate}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Select an image from the gallery to view metadata.
            </div>
          )}
        </div>
      </div>

      {/* Upload Asset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-slate-900">Upload Media Asset</h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Image Direct URL *</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Filename</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="cardiology_endothelium.jpg"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Image Alt Text *</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Accessible description of the image"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Scientific Caption</label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Caption explaining clinical context and tissue staining..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">License</label>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="Creative Commons CC-BY-NC">CC-BY-NC</option>
                    <option value="Editorial Academic Commons">Academic Commons</option>
                    <option value="GlobalHealth Media Asset Stock">GlobalHealth Stock</option>
                    <option value="Unsplash Clinical Editorial License">Unsplash Editorial</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Source / Attribution</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Harvard Medical Imaging"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-sm"
              >
                Save to Media Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
