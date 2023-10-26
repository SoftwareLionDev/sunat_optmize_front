let value = '2023-10-17T13:00:00.000Z';
const date = new Date(value);

console.log(date.toLocaleString('es-PE').replace(',', ''));