import { describe, expect, test } from 'vitest';

import {
  orderFeaturedKitchenProjects,
  orderImagesKitchensFirst,
  orderScopeKitchenFirst,
} from '../../src/lib/project-ordering';

describe('project ordering helpers', () => {
  test('shows kitchen images before other images, keeping relative order', () => {
    const images = [
      { src: 'other-1', category: 'other' as const },
      { src: 'kitchen-1', category: 'kitchens' as const },
      { src: 'other-2', category: 'other' as const },
      { src: 'kitchen-2', category: 'kitchens' as const },
    ];

    expect(orderImagesKitchensFirst(images).map((image) => image.src)).toEqual([
      'kitchen-1',
      'kitchen-2',
      'other-1',
      'other-2',
    ]);
  });

  test('lists kitchen-related scope tags first, keeping relative order', () => {
    expect(
      orderScopeKitchenFirst(['Bathroom fitting', 'Kitchen fitting', 'Custom joinery', 'kitchen cabinetry']),
    ).toEqual(['Kitchen fitting', 'kitchen cabinetry', 'Bathroom fitting', 'Custom joinery']);
  });

  test('puts featured projects first in the given order, keeping images together', () => {
    const items = [
      { slug: 'dulwich-hill', src: 'd1' },
      { slug: 'leytonstone', src: 'l1' },
      { slug: 'leytonstone', src: 'l2' },
      { slug: 'paddock-close', src: 'p1' },
      { slug: 'queensville-road', src: 'q1' },
      { slug: 'queensville-road', src: 'q2' },
    ];

    expect(orderFeaturedKitchenProjects(items, ['queensville-road', 'leytonstone']).map((item) => item.src)).toEqual([
      'q1',
      'q2',
      'l1',
      'l2',
      'd1',
      'p1',
    ]);
  });
});
