import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Layers,
  FileText,
  Check,
  AlertCircle
} from 'lucide-react';
import { NewsCategoryItem } from '../../types';

interface CategoriesManagementViewProps {
  categories: NewsCategoryItem[];
  onCreateCategory: (cat: Omit<NewsCategoryItem, 'id' | 'articleCount'>) => void;
  onUpdateCategory: (id: string, updates: Partial<NewsCategoryItem>) => void;
  onDeleteCategory: (id: string, reassignTo?: string) => void;
}

export const CategoriesManagementView: React.FC<CategoriesManagementViewProps> = ({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeCategory, setActiveCategory] = useState<NewsCategoryItem | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [subcategoriesStr, setSubcategoriesStr] = useState('');
  const [color, setColor] = useState('teal');

  // Deletion Modal
  const [deleteModalCat, setDeleteModalCat] = useState<NewsCategoryItem | null>(null);
  const [reassignCategoryName, setReassignCategoryName] = useState('');

  const openCreateModal = () => {
    setName('');
    setSlug('');
    setDescription('');
    setSubcategoriesStr('');
    setColor('teal');
    setActiveCategory(null);
    setModalMode('create');
  };

  const openEditModal = (cat: NewsCategoryItem) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setSubcategoriesStr(cat.subcategories.join(', '));
    setColor(cat.color || 'teal');
    setActiveCategory(cat);
    setModalMode('edit');
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (modalMode === 'create') {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a category name.');
      return;
    }

    const subcats = subcategoriesStr.split(',').map((s) => s.trim()).filter(Boolean);

    if (modalMode === 'create') {
      onCreateCategory({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        subcategories: subcats,
        color
      });
    } else if (modalMode === 'edit' && activeCategory) {
      onUpdateCategory(activeCategory.id, {
        name,
        slug,
        description,
        subcategories: subcats,
        color
      });
    }

    setModalMode(null);
  };

  const confirmDelete = () => {
    if (!deleteModalCat) return;
    onDeleteCategory(deleteModalCat.id, reassignCategoryName || undefined);
    setDeleteModalCat(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <FolderTree className="h-4 w-4" /> Taxonomy & Medical Classification
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            News Categories & Subcategories
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the categorical hierarchy and clinical specialty taxonomy for news articles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4 hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  {cat.articleCount || 0} Articles
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-50 transition"
                    title="Edit Category"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModalCat(cat);
                      const others = categories.filter((c) => c.id !== cat.id);
                      setReassignCategoryName(others[0]?.name || '');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">{cat.name}</h3>
                <div className="text-[11px] font-mono text-teal-700 mt-0.5">/news/{cat.slug}</div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>

            {/* Subcategories Chips */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subcategories:</div>
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub) => (
                  <span
                    key={sub}
                    className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-100"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Category Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Immunotherapy & Oncology"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="immunotherapy-oncology"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 font-mono focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the clinical domain covered by this category..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Subcategories (comma separated)</label>
                <input
                  type="text"
                  value={subcategoriesStr}
                  onChange={(e) => setSubcategoriesStr(e.target.value)}
                  placeholder="e.g. CAR-T Cells, Checkpoint Inhibitors, Cancer Vaccines"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setModalMode(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-sm"
              >
                {modalMode === 'create' ? 'Create Category' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {deleteModalCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Category</h3>
                <p className="text-xs text-slate-500">{deleteModalCat.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This category contains <strong>{deleteModalCat.articleCount || 0}</strong> articles. Select where to safely reassign existing articles before deleting:
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Reassign Articles to:</label>
              <select
                value={reassignCategoryName}
                onChange={(e) => setReassignCategoryName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
              >
                {categories
                  .filter((c) => c.id !== deleteModalCat.id)
                  .map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeleteModalCat(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm"
              >
                Reassign & Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
