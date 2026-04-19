export const MOBILE_MENU_MAX_WIDTH = 900;
export const HEADER_SCROLL_THRESHOLD = 60;

export function setMenuState(
  toggle: HTMLButtonElement | null,
  nav: HTMLElement | null,
  isOpen: boolean,
) {
  toggle?.setAttribute('aria-expanded', String(isOpen));
  toggle?.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  nav?.classList.toggle('is-open', isOpen);
}

export function closeMenuOnMobileLinkClick(
  toggle: HTMLButtonElement | null,
  nav: HTMLElement | null,
  innerWidth: number,
) {
  if (innerWidth <= MOBILE_MENU_MAX_WIDTH) {
    setMenuState(toggle, nav, false);
  }
}

export function updateTransparentHeader(header: HTMLElement, scrollY: number) {
  header.classList.toggle('header--scrolled', scrollY > HEADER_SCROLL_THRESHOLD);
}

export function resetHeaderMenu(
  toggle: HTMLButtonElement | null,
  nav: HTMLElement | null,
) {
  setMenuState(toggle, nav, false);
}
