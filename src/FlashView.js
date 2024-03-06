import { h } from './h.js';

export function FlashView(root) {
  return {
    displayAlert(msg, level = "warn") {
      root.classList.add(level);
      root.appendChild(h('p', {}, msg));
    }
  }
}
