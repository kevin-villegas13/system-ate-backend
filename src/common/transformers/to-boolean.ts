export const toBoolean = ({
  value,
}: {
  value: string | boolean;
}): boolean | undefined => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};
