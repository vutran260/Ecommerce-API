import type { Config } from "drizzle-kit";
export default {
  schema: './src/db/*',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    user:"link-palette",
    password:"P@ssw0rd",
    host:"localhost",
    port:1111,
    database:"link-palette-dev"

  },
} satisfies Config