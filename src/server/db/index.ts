// For Node.js - make sure to install the 'ws' and 'bufferutil' packages
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

import { env } from "@/env";
import * as schema from "./schema/index";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: env.DATABASE_URL, max: 1 });
export const db = drizzle({ client: pool, schema });
