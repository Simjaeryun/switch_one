export function NumberToCommas(number: number | string | undefined) {
  const num = Number(number);

  if (isNaN(num)) {
    return "0";
  }
  return num.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ----------------------------------------------------------------------

export const CommasToNumber = (number = "") => {
  const num = Number(number.replace(/,/g, ""));

  if (isNaN(num)) {
    return 0;
  }

  return num;
};
