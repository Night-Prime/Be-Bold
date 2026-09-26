import { resolveImage } from './client';
import product1 from '../assets/images/product-1.jpeg';
import product2 from '../assets/images/product-5.jpeg';
import product3 from '../assets/images/product-3.jpeg';
import product4 from '../assets/images/product-4.jpeg';

// Rows seeded before the upload feature store legacy paths like
// "/product-1.jpeg" which resolve to nothing — map them to bundled assets.
const legacyMap = {
  '/product-1.jpeg': product1,
  '/product-5.jpeg': product2,
  '/product-3.jpeg': product3,
  '/product-4.jpeg': product4,
};

export const resolveProductImage = (img) => {
  if (!img) return '';
  if (legacyMap[img]) return legacyMap[img];
  return resolveImage(img);
};
