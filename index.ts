import { Extractor } from "./controller/extractor.controller";


console.log( 'Hola mundo abierto!' );


let extractor = new Extractor();

// Abrir archivo.
extractor.abrirArchivo( 'prueba.txt' );

// Leer archivo.

// Imprimir linea 1 del archivo
