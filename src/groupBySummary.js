export async function groupBySummary(forecast) {
    const current = await forecast.current;
    const hourly = await forecast.hourly;
    const days = {};
  
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
  
    current.periods.map((period) => {
      const periodStart = new Date(Date.parse(period.startTime));
      if (days[periodStart.getDate()]) {
        return;
      }
  
      const periodEnd = new Date();
      periodEnd.setDate(periodStart.getDate());
      periodEnd.setHours(23,59,59,0)
  
      const hours = hourly.periods.filter((hour) => {
        const hourStart = new Date(Date.parse(hour.startTime));
        return hourStart.getDate() === periodStart.getDate();
      });
  
      const high = Math.max(...hours.map(h => h.temperature));
      const low = Math.min(...hours.map(h => h.temperature));
  
      if (high > max) {
        max = high;
      }
  
      if (low < min) {
        min = low;
      }
  
      days[periodStart.getDate()] = {
        start: periodStart,
        day: periodStart.getDate(),
        high,
        low,
        period,
        hours,
      }
    });
  
    return Object.keys(days).sort((x, y) => {
      if (days[x].start > days[y].start) {
        return 1;
      }
  
      if (days[x].start < days[y].start) {
        return -1;
      }
  
      return 0;
    }).map((d) => {
      return { ...days[d], min, max };
    });
  }
  