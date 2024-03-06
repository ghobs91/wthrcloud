import { h } from './h.js';
import { getIcon } from './icons.js';
import { groupBySummary } from './groupBySummary.js';
import { fetchForecast } from './forecast.js';
import { currentPosition } from './currentPosition.js';
import { params } from './params.js';
import { RadarView } from './RadarView';

interface Codes {
  [key: string]: string;
}

export function AppView(root) {
  async function fetchForecastForLocation() {
    const {zip, search} = params();
    let codes: Codes = {};

    if (zip && search) {
      try {
        const res = await fetch('zipcodes.json');
        codes = await res.json();
      } catch (e) {
        throw new Error(`failed to load zipcodes: ${e}`);
      }

      const coords = codes[zip];
      if (!coords) {
        throw new Error(`unknown zipcode: ${zip}`);
      }

      return await fetchForecast({
        coords: {
          latitude: coords[0],
          longitude: coords[1]
        }
      });
    }

    const pos = await currentPosition();
    return await fetchForecast(pos);
  }

  async function reload() {
    const data = await fetchForecastForLocation();
    const view = h('section', { className: 'forecast' });

    view.appendChild(Title(data));
    view.appendChild(await GeneratedAt(data, reload));
    view.appendChild(await RadarView(data));
    view.appendChild(await DailySummary(data));

    if (root.childNodes.length > 0) {
      root.childNodes[0].replaceWith(view);
    } else {
      root.appendChild(view);
    }
  }

  return {
    reload,
  }
}

function Title(forecast) {
  const { city, state } = forecast.relativeLocation;
  let place = `${city}, ${state}`;
  const { zip } = params();
  if (zip) {
    place = `${place} (${zip})`
  }

  return h('h2', {}, place);
}

async function DailySummary(forecast) {
  const grouped = await groupBySummary(forecast);

  const list = h('div', { className: 'forecast--list' });
  grouped.forEach(({ period, high, low, hours, max }, idx) => {
    const additionalAttrs = idx === 0 ? { open: true } : {};

    const offset = (max - high) * 0.8;
    const width = ((high - low) || 1) * 0.8;

    const group = h('details', { className: 'forecast--list_item', ...additionalAttrs },
      h('summary', { className: 'summary'},
        h('div', { className: 'summary--row' },
          h('div', { className: 'summary--icon' }, getIcon(period.shortForecast)),
          h('h3', { className: 'summary--title' }, period.name),
          h('div', { className: 'summary--temp-bar-container' },
           h('div', { className: 'summary--low temp' }, low),
           h('div', { className: 'summary--temp-bar', style: `--bar-width: ${width}rem` }),
           h('div', { className: 'summary--high temp' }, high),
           h('div', { className: 'summary--offset', style: `--bar-width: ${offset}rem` }),
          ),
        ),
      ),
      h('div', { className: 'weather--row' },
        h('p', { className: 'weather--row_description' }, `${period.detailedForecast}`),
        h('div', { className: 'weather--row_graphics' },
          ...hours.map((hour) => {
            return HourRow({
              period,
              hour,
              high
            });
          })
        )
      )
    );

    list.appendChild(group);
  });

  return list;
}

export function HourRow({ hour, high }) {
  const graphics = h('div',
    { className: 'icon-group' },
    h(
      'div',
      { className: 'icon', data: { short: hour.shortForecast } },
      getIcon(hour.shortForecast),
    )
  );

  const start = new Date(Date.parse(hour.startTime));

  const formatted = new Intl.DateTimeFormat(
    navigator.language,
    { hour: 'numeric', hour12: true },
  ).format(start)

  const wind = parseInt(hour.windSpeed, 0);
  if (wind && wind > 15) {
    graphics.appendChild(h('div', { className: 'windspeed', style: `--wind-speed: ${wind * 3}deg` }, '🍃'));
  }

  if (Number.isInteger((parseInt(formatted, 0) / 2))) {
    return h('div', {
      className: 'weather--row_cell',
      style: `--temp-height: ${(high - hour.temperature) * 0.3}rem`,
    }, h('div', {
      className: 'current-temp temp',
    }, `${hour.temperature}`),
      graphics,
      h('div', { className: 'time' }, formatted)
    );
  }
}

function updateAtFormat(time) {
  return new Intl.DateTimeFormat(
    navigator.language,
    { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' },
  ).format(time)
}

async function GeneratedAt(forecast, reload) {
  const { generatedAt } = await forecast.current
  const generated = new Date(Date.parse(generatedAt));

  const reloadBtn = h('button', { className: 'btn--reload', }, `${updateAtFormat(generated)} ↻`);
  reloadBtn.addEventListener('click', () => { reload() });

  return reloadBtn;
}
