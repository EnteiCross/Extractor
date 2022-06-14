

export interface Flujo {
    fecha: Date,
    hora: string,
    accion: string,
    directorio: string,
    fichero: string
}

export class FlujoModel {
    constructor() {
    }

    public static formato( flujo: Flujo ): string {
        return `${flujo.fecha}|${flujo.hora}|${flujo.accion}|${flujo.directorio}|${flujo.fichero}`;
    }
}