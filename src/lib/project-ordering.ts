// Ordering rules for project content. Array.prototype.sort is stable, so
// items that compare equal keep their existing relative order.

// Projects shown first in the Kitchens section of the Projects page, in this order.
// Every other project follows in its existing order.
export const FEATURED_KITCHEN_PROJECTS = ['queensville-road', 'leytonstone'];

const KITCHEN_SCOPE_PATTERN = /\bkitchen/i;

export function orderImagesKitchensFirst<T extends { category: 'kitchens' | 'other' }>(images: T[]): T[] {
  const rank = (image: T) => (image.category === 'kitchens' ? 0 : 1);
  return [...images].sort((a, b) => rank(a) - rank(b));
}

export function orderScopeKitchenFirst(scope: string[]): string[] {
  const rank = (item: string) => (KITCHEN_SCOPE_PATTERN.test(item) ? 0 : 1);
  return [...scope].sort((a, b) => rank(a) - rank(b));
}

export function orderFeaturedKitchenProjects<T extends { slug: string }>(
  items: T[],
  featured: string[] = FEATURED_KITCHEN_PROJECTS,
): T[] {
  const rank = (item: T) => {
    const index = featured.indexOf(item.slug);
    return index === -1 ? featured.length : index;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}
