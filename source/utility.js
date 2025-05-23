import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(dirname(fileURLToPath(import.meta.url)));
export { currentDir }