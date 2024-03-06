const p = new URLSearchParams(location.search);

export function hydrate() {
  p.forEach((v, k) => {
    const field = document.getElementById(k);
    if (field) {
      field.value = v;
    }
  });
}

export function params() {
  return {
    zip: p.get('zip'),
    search: p.get('search'),
  }
}
