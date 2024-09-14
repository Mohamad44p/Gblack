export const OPEN_CART_EVENT = 'openCart';

export const openCart = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OPEN_CART_EVENT));
  }
};