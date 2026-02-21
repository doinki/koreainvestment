import fs from 'node:fs/promises';
import path from 'node:path';

import { fetchServices } from './fetch-services';

const cachePath = path.join(import.meta.dirname, '..', '.cache');

const services = await fetchServices();
await fs.mkdir(cachePath, { recursive: true });
await fs.writeFile(path.join(cachePath, 'services.json'), JSON.stringify(services));
