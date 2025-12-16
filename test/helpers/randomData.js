export function generateRandomEmail() {
  const randomId = Math.floor(Math.random() * 1000000);
  return `email.${randomId}@gmail.com`;
}
