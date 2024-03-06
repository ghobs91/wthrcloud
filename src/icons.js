export const icons = {
    'sunny': '🌞',
    'cloud': '☁️',
    'clear': '☀️',
    'showers': '☔',
    'thunderstorms': '⛈️',
    'snow': '🌨',
    'dust': '🐪',
    'sand': '🐫',
    'haze': '😕',
    'ice': '🧊',
    'smoke': '🚬',
    'frost': '🧊',
    'sleet': '🌨',
    'rain': '☔',
    'blizzard': '🏔',
    'windy': '🌬',
    'hot': '🌶',
    'cold': '🧊',
  }
  
  
  export function getIcon(forecast) {
    let match;
    Object.keys(icons).forEach((icon) => {
      const matcher = new RegExp(icon, 'i');
      if (matcher.test(forecast)) {
        match = icons[icon];
        return;
      }
    });
  
    return match;
  }
  