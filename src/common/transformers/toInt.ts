export const toInt = ({
  value,
}: {
  value: string | number;
}): number | undefined => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};
