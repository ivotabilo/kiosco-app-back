/*
  Warnings:

  - The `estadoPago` column on the `Lote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Variante` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `codigo` on the `Variante` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codigoRaiz]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigoInterno]` on the table `Variante` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigoBarras]` on the table `Variante` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `idVariante` on the `Lote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `codigoRaiz` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoInterno` to the `Variante` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lote" DROP CONSTRAINT "Lote_idVariante_fkey";

-- DropIndex
DROP INDEX "Variante_codigo_key";

-- AlterTable
ALTER TABLE "Lote" DROP COLUMN "idVariante",
ADD COLUMN     "idVariante" INTEGER NOT NULL,
DROP COLUMN "estadoPago",
ADD COLUMN     "estadoPago" "EstadoPago" NOT NULL DEFAULT 'PAGADO';

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "codigoRaiz" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Variante" DROP CONSTRAINT "Variante_pkey",
DROP COLUMN "codigo",
ADD COLUMN     "codigoBarras" TEXT,
ADD COLUMN     "codigoInterno" TEXT NOT NULL,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "idVariante" SERIAL NOT NULL,
ADD CONSTRAINT "Variante_pkey" PRIMARY KEY ("idVariante");

-- DropEnum
DROP TYPE "EstadoVenta";

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigoRaiz_key" ON "Producto"("codigoRaiz");

-- CreateIndex
CREATE UNIQUE INDEX "Variante_codigoInterno_key" ON "Variante"("codigoInterno");

-- CreateIndex
CREATE UNIQUE INDEX "Variante_codigoBarras_key" ON "Variante"("codigoBarras");

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_idVariante_fkey" FOREIGN KEY ("idVariante") REFERENCES "Variante"("idVariante") ON DELETE CASCADE ON UPDATE CASCADE;
