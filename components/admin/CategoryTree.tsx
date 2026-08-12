'use client';

import React, { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown, Edit, Trash2, Plus, ArrowUpRight } from 'lucide-react';

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  status: string;
  parentId?: string | null;
  sortOrder: number;
  children?: CategoryTreeNode[];
  _count?: { products: number };
}

interface CategoryTreeProps {
  categories: CategoryTreeNode[];
  onEdit: (cat: CategoryTreeNode) => void;
  onDelete: (id: string) => void;
  onAddSubcategory: (parentId: string) => void;
}

export default function CategoryTree({
  categories,
  onEdit,
  onDelete,
  onAddSubcategory,
}: CategoryTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: CategoryTreeNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expanded[node.id];

    return (
      <div key={node.id} className="space-y-1">
        <div
          className={`flex items-center justify-between p-3 rounded-xl border transition ${
            level === 0
              ? 'bg-stone-900 border-stone-800 hover:border-amber-500/30'
              : 'bg-stone-950/60 border-stone-800/80 ml-6 hover:border-amber-500/20'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpand(node.id)}
                className="p-1 text-stone-400 hover:text-stone-200 transition"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-6" />
            )}

            {isExpanded ? (
              <FolderOpen className="w-5 h-5 text-amber-400 flex-shrink-0" />
            ) : (
              <Folder className="w-5 h-5 text-stone-500 flex-shrink-0" />
            )}

            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-stone-200 truncate">{node.name}</span>
                <span className="text-[10px] font-mono bg-stone-950 px-2 py-0.5 rounded text-stone-500 border border-stone-800">
                  /{node.slug}
                </span>
              </div>
              {node.description && (
                <p className="text-xs text-stone-500 truncate max-w-md">{node.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {node._count && (
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                {node._count.products} products
              </span>
            )}

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                node.status === 'ACTIVE'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-stone-800 text-stone-500'
              }`}
            >
              {node.status}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onAddSubcategory(node.id)}
                title="Add Subcategory under this parent"
                className="p-1.5 text-stone-400 hover:text-emerald-400 rounded-lg hover:bg-stone-800 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onEdit(node)}
                title="Edit category"
                className="p-1.5 text-stone-400 hover:text-amber-400 rounded-lg hover:bg-stone-800 transition"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(node.id)}
                title="Delete category"
                className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg hover:bg-stone-800 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-2">{categories.map((cat) => renderNode(cat))}</div>;
}
