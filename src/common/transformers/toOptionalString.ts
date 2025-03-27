export const toOptionalString = ({
  value,
}: {
  value: string | undefined;
}): string | undefined => {
  return value && value.trim() !== '' ? value.trim() : undefined;
};
