export function calculateAge(birthDate: Date): number {
  if (isNaN(birthDate.getTime()))
    throw new Error('La fecha de nacimiento no es válida');

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  // Ajuste de la edad si aún no ha cumplido años este año
  if (
    month < birthDate.getMonth() ||
    (month === birthDate.getMonth() && day < birthDate.getDate())
  )
    age--;

  return age;
}
