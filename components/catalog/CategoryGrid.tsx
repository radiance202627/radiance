import React from 'react';
import { Category } from '@/lib/types';
import { CategoryCard } from '@/components/catalog/CategoryCard';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};
