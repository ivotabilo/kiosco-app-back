/*
  Warnings:

  - You are about to drop the column `costo` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `estadoVenc` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `fechaHora` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `Variante` table. All the data in the column will be lost.
  - Added the required column `cantidadPacks` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costoIndividual` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costoPackBruto` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidadesPorPack` to the `Lote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioSugerido` to the `Variante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioVentaPack` to the `Variante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioVentaU` to the `Variante` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PAGADO', 'DEUDA');

-- DropForeignKey
ALTER TABLE "Lote" DROP CONSTRAINT "Lote_idVariante_fkey";

-- DropForeignKey
ALTER TABLE "Variante" DROP CONSTRAINT "Variante_productoId_fkey";

-- AlterTable
ALTER TABLE "Lote" DROP COLUMN "costo",
DROP COLUMN "estadoVenc",
DROP COLUMN "fechaHora",
ADD COLUMN     "cantidadPacks" INTEGER NOT NULL,
ADD COLUMN     "costoIndividual" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "costoPackBruto" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "descuentoMonto" DOUBLE PRECISION,
ADD COLUMN     "descuentoPorc" DOUBLE PRECISION,
ADD COLUMN     "estadoPago" TEXT NOT NULL DEFAULT 'PAGADO',
ADD COLUMN     "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "proveedorId" INTEGER,
ADD COLUMN     "unidadesPorPack" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Variante" DROP COLUMN "precio",
ADD COLUMN     "precioSugerido" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "precioVentaPack" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "precioVentaU" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Proveedor" (
    "idProveedor" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("idProveedor")
);

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_idVariante_fkey" FOREIGN KEY ("idVariante") REFERENCES "Variante"("codigo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("idProveedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variante" ADD CONSTRAINT "Variante_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("idProducto") ON DELETE CASCADE ON UPDATE CASCADE;
