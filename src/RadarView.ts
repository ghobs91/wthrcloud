import { h } from './h.js';

export async function RadarView(data) {
  const { radarStation } = data;
  const full = h('img', {
    className: 'radar center',
    width: "100%",
    src: `https://radar.weather.gov/ridge/standard/${radarStation}_loop.gif`
  })

  return h('details', { className: 'radar'},
    h('summary', {}, h('h5', {}, 'Show Live Radar')),
    full,
  );
}
