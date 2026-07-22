import { Leccion } from '../entities/leccion.entity';

export interface BloqueContenido {
  titulo: string | null;
  texto: string;
}

export class LeccionResponseDto {
  idLeccion!: number;
  idSubtema!: number;
  tituloLeccion!: string;
  subtituloLeccion!: string;
  descripcionLeccion!: string;

  contenidoParsed!: BloqueContenido[];
  tipsParsed!: BloqueContenido[];

  numOrden!: number;

  static fromEntity(entity: Leccion): LeccionResponseDto {
    return {
      idLeccion: entity.idLeccion,
      idSubtema: entity.idSubtema,
      tituloLeccion: entity.tituloLeccion,
      subtituloLeccion: entity.subtituloLeccion,
      descripcionLeccion: entity.descripcionLeccion,
      // Mapeamos a las propiedades aisladas:
      contenidoParsed: parsearTextoEstructurado(entity.contenidoLeccion),
      tipsParsed: parsearTextoEstructurado(entity.tips),
      numOrden: entity.numOrden,
    };
  }
}

function parsearTextoEstructurado(rawText: string): BloqueContenido[] {
  if (!rawText) return [];

  const regexPaso = /(?<=\n\n)(?=\d+\s*¿)/g;
  const secciones = rawText
    .split(regexPaso)
    .map((block) => block.trim())
    .filter(Boolean);

  return secciones.map((seccion) => {
    const matchTitulo = seccion.match(/^(\d+\s*¿[^?]+\?)([\s\S]*)/);

    if (matchTitulo) {
      return {
        titulo: matchTitulo[1].trim(),
        texto: matchTitulo[2].trim(),
      };
    }
    return {
      titulo: null,
      texto: seccion,
    };
  });
}
