import * as fs from 'fs';
import config from './ormconfig';

fs.writeFileSync('ormconfig.json', JSON.stringify(config, null, 2));
