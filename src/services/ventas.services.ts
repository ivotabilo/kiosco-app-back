export type Venta = {
  idVenta: string;
  fechaHora: Date;
  items: {
    codigo: string;
    nombre: string;
    precio: number;
    cantidad: number;
  }[];
  total: number;
  estado: "en_proceso" | "confirmada";
};

const ventasActivas: Record<string, Venta> = {};
const ventasFinalizadas: Venta[] = [];

export const crearVenta = () => {
  const idVenta = crypto.randomUUID();
  const nuevaVenta: Venta = {
    idVenta,
    fechaHora: new Date(),
    items: [],
    total: 0,
    estado: "en_proceso",
  };

  // 🔥 guardamos en memoria
  ventasActivas[idVenta] = nuevaVenta;

  return nuevaVenta;
};
export const agregarProducto = (idVenta: string, codigo: string) => {
  const venta = ventasActivas[idVenta];

  if (!venta) throw {code:'NOT_FOUND_VENTA', message: 'Venta no existe'};
  if (venta.estado !== "en_proceso"){
    throw {code:'VENTA_FINALIZADA', message: 'Venta finalizada'};
  }
  
  if (!codigo){
    throw {code:'CODIGO_REQUERIDO', message: 'El código es requerido'};
  }
  // 🔥 simulamos catálogo (después esto vendrá de BD)
  const Producto = {
    codigo,
    nombre: "Producto " + codigo,
    precio: 1000,
    cantidad: 10,
  };
  //aca falta la BD
   if (!Producto){
    throw {code:'NOT_FOUND_PRODUCTO', message: 'Producto no existe'};
  }
  const item = venta.items.find((i) => i.codigo === codigo);
  if (Producto?.cantidad === 0){
    throw {code: 'NO_HAY_STOCK', message: 'No hay stock disponible'};
  }
  if (item) {
    item.cantidad += 1;
  } else {
    venta.items.push({
      codigo: Producto.codigo,
      nombre: Producto.nombre,
      precio: Producto.precio,
      cantidad: 1,
    });
  }

  // 🔥 recalcular total
  venta.total = venta.items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return venta;
};
export const modificarCantidad = (idVenta: string, codigo: string, cantidad: number) =>{
  const venta = ventasActivas[idVenta];
  if (!venta) {
    throw {code:'NOT_FOUND_VENTA', message: 'Venta no existe'};
  }
  if (venta.estado !== "en_proceso"){
    throw {code:'VENTA_FINALIZADA', message: 'Venta finalizada'};
  }
  const item = venta.items.find((i) => i.codigo === codigo);
  if(!item){
    throw {code: 'NOT_FOUND_PRODUCTO', message: 'Producto no existe'}
  }
  else{
     //if (Producto?.cantidad === 0){
    //throw {code: 'NO_HAY_STOCK', message: 'No hay stock disponible'};
  //}
    item.cantidad = cantidad;
  }
  

}
export const registrarVenta = (idVenta: string) => {
  const venta = ventasActivas[idVenta];
  if (!venta) {
    throw {code:'NOT_FOUND_VENTA', message: 'Venta no existe'};
  }
  if (venta.estado !== "en_proceso"){
    throw {code:'VENTA_FINALIZADA', message: 'Venta finalizada'};
  }
  if (venta.items.length === 0){
    throw {code:'NO_HAY_PRODUCTOS', message: 'No hay productos en la venta'}; 
  }
    // 🔥 cambiar estado
  venta.estado = "confirmada";
  // 🔥 guardar en "BD simulada"
  ventasFinalizadas.push(venta);

  // 🔥 eliminar de memoria activa
  delete ventasActivas[idVenta];

  return venta;
};
export const eliminarProducto = (idVenta: string, codigo: string) =>{
  const venta = ventasActivas[idVenta];
  if (!venta) {
    throw new Error("Venta no existe");
  }
  const item = venta.items.find((i) => i.codigo === codigo);
  if (!item) {
    throw new Error("Producto no existe en la venta");
  }
  item.cantidad -= 1;

  if (item.cantidad === 0) {
    venta.items = venta.items.filter((i) => i.codigo !== codigo);
  }

  // 🔥 recalcular tota

}
