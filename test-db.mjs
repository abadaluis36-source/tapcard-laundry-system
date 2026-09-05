import { db } from './src/db/index.js';
import * as schema from './src/db/schema.js';
db.select().from(schema.tickets).limit(1).then(res => console.log(res)).catch(console.error);
