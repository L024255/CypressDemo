import { isNumber } from "lodash";

export const formatTime = (timestring?: string) => {
  if (timestring) {
    const date = new Date(timestring);
    const timeString = date.toLocaleTimeString().replace(/:\d+ /, " ");
    const result = `${date.toDateString()} ${timeString}`;
    return result;
  }
  return "";
};

export const formatNumber = (value: number) => {
  let newValue = '';
  if (isNumber(value)) {
    newValue += value;

    if (value >= 1000) {
      const suffixes = ["", "K", "M", "B", "T"];
      const suffixNum = Math.floor(("" + value).length / 3);
      let shortValue: any;
      for (var precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
        var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
        if (dotLessShortValue.length <= 2) { break; }
      }
      if (shortValue % 1 !== 0) {
        shortValue = shortValue.toFixed(1);
      }
      newValue = shortValue + suffixes[suffixNum];
    }
  }

  return newValue;
}

export const unique = (arr: any[]) => {
  return Array.from(new Set(arr));
}
