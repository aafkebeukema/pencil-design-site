import { describe, expect, test } from 'vitest';

import {
  closeMenuOnMobileLinkClick,
  HEADER_SCROLL_THRESHOLD,
  MOBILE_MENU_MAX_WIDTH,
  resetHeaderMenu,
  setMenuState,
  updateTransparentHeader,
} from '../../src/lib/header-menu';

function createHeaderElements() {
  document.body.innerHTML = `
    <header class="site-header">
      <button class="menu-toggle" aria-label="Open menu" aria-expanded="false"></button>
      <nav class="site-nav"></nav>
    </header>
  `;

  return {
    header: document.querySelector('.site-header') as HTMLElement,
    toggle: document.querySelector('.menu-toggle') as HTMLButtonElement,
    nav: document.querySelector('.site-nav') as HTMLElement,
  };
}

describe('header menu helpers', () => {
  test('setMenuState opens the menu and updates accessibility attributes', () => {
    const { toggle, nav } = createHeaderElements();

    setMenuState(toggle, nav, true);

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('aria-label')).toBe('Close menu');
    expect(nav.classList.contains('is-open')).toBe(true);
  });

  test('closeMenuOnMobileLinkClick only closes the menu on mobile widths', () => {
    const { toggle, nav } = createHeaderElements();

    setMenuState(toggle, nav, true);
    closeMenuOnMobileLinkClick(toggle, nav, MOBILE_MENU_MAX_WIDTH);

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(nav.classList.contains('is-open')).toBe(false);

    setMenuState(toggle, nav, true);
    closeMenuOnMobileLinkClick(toggle, nav, MOBILE_MENU_MAX_WIDTH + 1);

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(nav.classList.contains('is-open')).toBe(true);
  });

  test('resetHeaderMenu restores the closed state', () => {
    const { toggle, nav } = createHeaderElements();

    setMenuState(toggle, nav, true);
    resetHeaderMenu(toggle, nav);

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-label')).toBe('Open menu');
    expect(nav.classList.contains('is-open')).toBe(false);
  });

  test('updateTransparentHeader adds and removes the scrolled class around the threshold', () => {
    const { header } = createHeaderElements();

    updateTransparentHeader(header, HEADER_SCROLL_THRESHOLD + 1);
    expect(header.classList.contains('header--scrolled')).toBe(true);

    updateTransparentHeader(header, HEADER_SCROLL_THRESHOLD);
    expect(header.classList.contains('header--scrolled')).toBe(false);
  });
});
