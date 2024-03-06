export async function get(route) {
    const resp = await fetch(route, {
      headers: {
        Accept: 'application/ld+json',
      }
    });
  
    if (!resp.ok) {
      throw new Error(`request ${route} failed with ${resp.status}`)
    }
  
    return resp.json();
  }
  
  export async function fetchForecast(pos) {
    const { latitude, longitude } = pos.coords;
  
    const resp = await get(`https://api.weather.gov/points/${latitude},${longitude}`);
    const observations = get(resp.forecastZone).then((r) => {
      return get(`${r.observationStations[0]}/observations/latest`);
    });
  
    return {
      relativeLocation: resp.relativeLocation,
      gridId: resp.gridId,
      radarStation: resp.radarStation,
      current: get(resp.forecast),
      hourly: get(resp.forecastHourly),
      observations,
    }
  }
  
  