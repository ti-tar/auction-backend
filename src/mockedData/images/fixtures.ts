import { join } from 'path';

const getPath = (filename: string): string => {
  return join(__dirname, filename);
};

const inputJpgFile = 'my_photo.jpg';
export const inputFile = {
  filename: inputJpgFile,
  path: getPath(inputJpgFile),
};
