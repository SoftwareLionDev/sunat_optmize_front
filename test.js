function convert_date(value_date, format = 'dd/mm/yyyy') {
    if(!value_date) return "";
    
    const es_Date = value_date instanceof Date;

    // Si es un string (2023-01-05) y no tiene una T, y no es una fecha
    if (!es_Date && !value_date.includes('T')) {
        value_date = value_date + 'T00:00:00';
    }

    if(value_date.includes('Z')){
        value_date = value_date.split('.')[0];
    }

    let date = es_Date ? value_date : new Date(value_date.replace('.000Z', ''));

    // Obtenemos el día, mes y año por separado
    const dia = date.getDate().toString().padStart(2, '0'); // Agrega un 0 delante si es de un solo dígito
    const mes = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes comienza desde 0, por eso sumamos 1
    const anio = date.getFullYear();

    format = format.replace('dd', dia);
    format = format.replace('mm', mes);
    format = format.replace('yyyy', anio);

    return format;
}

let f = convert_date('2023-12-22T00:45:51.000Z', 'dd/mm/yyyy');

console.log(f);