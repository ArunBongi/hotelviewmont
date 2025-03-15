export const getImagePath = (path: string): string => {
  // Remove '../../public' from the path if it exists
  const cleanPath = path.replace('../../public/', '/');
  return cleanPath;
}; 