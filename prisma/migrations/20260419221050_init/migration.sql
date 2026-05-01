-- CreateEnum
CREATE TYPE "EstadoStock" AS ENUM ('ESTABLE', 'REPONER', 'CRITICO');

-- CreateEnum
CREATE TYPE "EstadoVencimiento" AS ENUM ('VIGENTE', 'PROXIMO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "EstadoVenta" AS ENUM ('EN_PROCESO', 'CONFIRMADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Producto" (
    "idProducto" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "marcaId" INTEGER,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("idProducto")
);

-- CreateTable
CREATE TABLE "Venta" (
    "idVenta" SERIAL NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" INTEGER NOT NULL,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("idVenta")
);

-- CreateTable
CREATE TABLE "DetalleVenta" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" INTEGER NOT NULL,
    "ventaId" INTEGER NOT NULL,
    "loteId" INTEGER NOT NULL,

    CONSTRAINT "DetalleVenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lote" (
    "idLote" SERIAL NOT NULL,
    "cantidadInicial" INTEGER NOT NULL,
    "cantidadActual" INTEGER NOT NULL,
    "costo" INTEGER NOT NULL,
    "fechaVencimiento" TIMESTAMP(3),
    "estadoVenc" "EstadoVencimiento" NOT NULL DEFAULT 'VIGENTE',
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "idVariante" TEXT NOT NULL,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("idLote")
);

-- CreateTable
CREATE TABLE "Variante" (
    "codigo" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "minimoParaReponer" INTEGER NOT NULL,
    "limiteCritico" INTEGER NOT NULL,
    "estado" "EstadoStock" NOT NULL DEFAULT 'ESTABLE',
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "Variante_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Marca" (
    "idMarca" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("idMarca")
);

-- CreateIndex
CREATE UNIQUE INDEX "Variante_codigo_key" ON "Variante"("codigo");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("idMarca") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("idVenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_loteId_fkey" FOREIGN KEY ("loteId") REFERENCES "Lote"("idLote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_idVariante_fkey" FOREIGN KEY ("idVariante") REFERENCES "Variante"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variante" ADD CONSTRAINT "Variante_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;
