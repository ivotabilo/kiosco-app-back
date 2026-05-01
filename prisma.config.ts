import "dotenv/config";
import { defineConfig, env } from "prisma/config"; // Agregamos 'env' aquí

export default defineConfig({
  schema: "./prisma/schema.prisma", // Agregamos el './' para mayor seguridad
  datasource: {
    // CAMBIO CLAVE: Usamos la función env() de Prisma
    url: env("DATABASE_URL")!, 
  },
});

