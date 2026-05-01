# 1. Definimos la imagen base (Node 22 en Linux Alpine)
FROM node:22-alpine

# 2. Creamos la carpeta donde vivirá la app dentro de la caja
WORKDIR /app

# 3. Copiamos los archivos de configuración de dependencias
# Se copian antes que el resto del código para aprovechar la cache de Docker
COPY package*.json ./

# 4. Instalamos las librerías directamente en Linux (dentro de la caja)
RUN npm install

# 5. Copiamos el resto de los archivos del proyecto (src, tsconfig, etc.)
COPY . .

# 5.5 Generamos el cliente de Prisma
RUN npx prisma generate

# 6. Informamos que el contenedor usará el puerto 3000
EXPOSE 3000

# 7. Comando para arrancar en modo desarrollo
# Asume que tenés un script "dev" en tu package.json (ej: "tsx watch src/app.ts")
CMD ["npm", "run", "dev"]