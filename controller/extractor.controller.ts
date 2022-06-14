import fse from 'fs-extra';
import path from 'path';
import readLine from 'readline';

import { Flujo, FlujoModel } from '../model/flujo';

export class Extractor {
    

    constructor() {
        console.log( 'Hola soy el extractor' );
    }

    /*
    Patrones
    type -> /(type=(.{3}))/g
    fecha -> /(\d{2}\/\d{2}\/\d{4})/g
    tiempo -> /(\d{2}:\d{2}:\d{2}\.\d{3})/g
    accion -> /(\{ .* \})/g

------    fichero -> (((\w+|))(\.(htaccess|html))|((\w|\-)+\.txt))
    (saber formato) -> \.(\w+)\s
    (no log) fichero y directorio  -> ([\w]+)(\/)((\w+|))(\.(htaccess|html))
    (log) fichero y directorio -> ([\w]+)(\/logs\/)(((\w+|))(\w|\-)+\.txt)
    */
    


    abrirArchivo( fichero: string ) {

        console.log(`Se abrira el archivo de la ruta ${fichero}`);
        
        let ruta = path.join('./assets', fichero);

        console.log( ruta );

        //let contenidoFichero = fse.readFileSync( ruta, 'utf-8' );

        var rl = readLine.createInterface({
            input : fse.createReadStream(ruta),
            output : process.stdout,
            terminal: false
        });
        rl.on('line', (text) => {
         // console.log(text);
         // console.log('--');
            let flujo = this.ubicarInformacion(text);
        
            console.log( flujo );

            this.guardarFlujo( ruta, `out-${fichero}`, flujo );
        
        });

        // fse.readFileSync(  )
    }

    guardarFlujo( ruta: string, fichero: string, flujo: Flujo ) {
        fse.writeFile( `${ruta}-out.txt`, 
         FlujoModel.formato(flujo), () => {
            console.log('se ha creado');
            
        } )
    }

    ubicarInformacion(texto: string) : Flujo {
            /*
    Patrones
    type -> /(type=(.{3}))/g
    fecha -> /(\d{2}\/\d{2}\/\d{4})/g
    tiempo -> /(\d{2}:\d{2}:\d{2}\.\d{3})/g
    accion -> /(\{ .* \})/g

------    fichero -> (((\w+|))(\.(htaccess|html))|((\w|\-)+\.txt))
    (saber formato) -> \.(\w+)\s
    (no log) fichero y directorio  -> /([\w]+)(\/)((\w+|))(\.(htaccess|html))/g
    (log) fichero y directorio -> /([\w]+)(\/logs\/)(((\w+|))(\w|\-)+\.txt)/g
    */

        let regType     = /(type=(.{3}))/g
        let regFecha    = /(\d{2}\/\d{2}\/\d{4})/g
        let regHora   = /(\d{2}:\d{2}:\d{2}\.\d{3})/g
        let regAccion   = /(\{ .* \})/g

        let regFormato  = /\.(\w+)\s/g;
        let regDirectorioFichero = /([\w]+)(\/)((\w+|))(\.(htaccess|html))/g
        let regDirectorioFicheroLog =  /([\w]+)(\/logs\/)(((\w+|))(\w|\-)+\.txt)/g

        let fecha = new Date( `${regFecha.exec(texto)[0]}` );
        let hora = regHora.exec(texto)[0];
        let accion = (regAccion.exec(texto)[0]).split(' ')[1];
        let formato = (regFormato.exec(texto)[0]).split('.')[1].trim();

        let directorio = '';
        let fichero = '';

        if ( formato === 'txt' ) {
            let auxDirectorio = regDirectorioFicheroLog.exec(texto);
            directorio  = auxDirectorio[1];
            fichero     = auxDirectorio[3];
        } else {
            let auxDirectorio = regDirectorioFichero.exec(texto)[0].split('/');
            directorio = auxDirectorio[0];
            fichero = auxDirectorio[1];
        }

        return {
            fecha,
            hora,
            accion,
            directorio,
            fichero
            }    
    }


}
