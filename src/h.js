export function h(name, opts = {}, ...children) {
    const { dataset, ...attrs } = opts;
    const el = document.createElement(name);
  
    Object.keys(attrs).forEach((key) => {
      switch (key) {
        case 'className':
          el.setAttribute('class', attrs[key]);
          break;
        case 'data':
          Object.keys(opts.data).forEach((key) => {
            el.dataset[key] = opts.data[key];
          });
          break;
        default:
          el.setAttribute(key, attrs[key]);
      }
    });
  
    if (children.length === 0) {
      return el;
    }
  
    children.forEach((child) => {
      if (typeof child === 'undefined') { return; }
  
      if (child.tagName) {
        el.appendChild(child);
      } else {
        el.appendChild(document.createTextNode(child));
      }
    });
  
    return el;
  }
  
  