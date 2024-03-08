import moment from 'moment';

const CustomDayProps = ({ events }) => {
  const eventsByDate = events.reduce((groupedEvents, event) => {
    const dateStr = moment(event.date).format('YYYY-MM-DD');
    if (!groupedEvents[dateStr]) {
      groupedEvents[dateStr] = [];
    }
    groupedEvents[dateStr].push(event.color);
    return groupedEvents;
  }, {});

  const customDayPropGetter = date => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    const eventColors = eventsByDate[dateStr] || [];
    const mixedColor = mixColors(eventColors);
    return {
      style: {
        backgroundColor: mixedColor || '#ffffff',
      }
    };
  };

  const mixColors = colors => {
    if (colors.length === 0) return null;
    const rgbColors = colors.map(color => hexToRgb(color));
    const avgColor = rgbColors.reduce((acc, color) => {
      acc[0] += color[0];
      acc[1] += color[1];
      acc[2] += color[2];
      return acc;
    }, [0, 0, 0]);
    avgColor[0] = Math.round(avgColor[0] / rgbColors.length);
    avgColor[1] = Math.round(avgColor[1] / rgbColors.length);
    avgColor[2] = Math.round(avgColor[2] / rgbColors.length);
    return rgbToHex(avgColor[0], avgColor[1], avgColor[2]);
  };

  const hexToRgb = hex => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  return {
    dayPropGetter: customDayPropGetter
  };
};

export default CustomDayProps;
