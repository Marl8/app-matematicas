import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgresoUsuario } from './entities/progreso_usuario.entity';
import { Subtema } from '../subtema/entities/subtema.entity';
import { Leccion } from '../leccion/entities/leccion.entity';
import { Ejercicio } from '../ejercicio/entities/ejercicio.entity';
import { EjercicioService } from '../ejercicio/ejercicio.service';
import { LeccionService } from '../leccion/leccion.service';
import { CreateProgresoUsuarioDto } from './dto/create-progreso_usuario.dto';
import { UpdateProgresoUsuarioDto } from './dto/update-progreso_usuario.dto';

// Reglas de negocio del dominio: 3 lecciones por subtema, 3 ejercicios por lección
const ORDEN_MIN = 1;
const ORDEN_MAX = 3;
const EJERCICIOS_POR_LECCION = 3;
const TOTAL_EJERCICIOS_POR_SUBTEMA = ORDEN_MAX * EJERCICIOS_POR_LECCION; // 9

@Injectable()
export class ProgresoUsuarioService {
  constructor(
    @InjectRepository(ProgresoUsuario)
    private readonly progresoRepository: Repository<ProgresoUsuario>,
    @InjectRepository(Subtema)
    private readonly subtemaRepository: Repository<Subtema>,
    private readonly ejercicioService: EjercicioService,
    private readonly leccionService: LeccionService,
  ) {}

  /**
   * Busca el progreso de un usuario para un subtema específico.
   * Si ya existe, lo retorna, si no, lo crea desde cero inicializándolo en el ejercicio 1.
   *
   * @param createDto - Datos necesarios para buscar o crear el progreso.
   * @returns El progreso del usuario (existente o recién creado).
   */
  async createOrFind(
    createDto: CreateProgresoUsuarioDto,
  ): Promise<ProgresoUsuario> {
    let progreso = await this.progresoRepository.findOne({
      where: {
        idUsuario: createDto.idUsuario,
        idSubtema: createDto.idSubtema,
      },
    });
    if (!progreso) {
      const numOrdenLeccion = 1;
      const numOrdenEjercicio = 1;
      const leccion = await this.leccionService.findLeccionBySubtemaYOrden(
        numOrdenLeccion,
        createDto.idSubtema,
      );
      const ejercicio = await this.ejercicioService.findByOrdenYLeccion(
        numOrdenEjercicio,
        leccion.idLeccion,
      );
      const nuevoProgreso = this.progresoRepository.create({
        ...createDto,
        numOrdenLeccion: leccion.idLeccion,
        idLeccion: leccion.idLeccion,
        numOrdenEjercicio: ejercicio.num_orden,
        idEjercicio: ejercicio.id_ejercicio,
      });
      progreso = await this.progresoRepository.save(nuevoProgreso);
    }
    return progreso;
  }

  async findAll(): Promise<ProgresoUsuario[]> {
    return await this.progresoRepository.find({
      relations: {
        usuario: true,
        tema: true,
        subtema: true,
      },
    });
  }

  async findById(id: number): Promise<ProgresoUsuario> {
    const progreso = await this.progresoRepository.findOne({
      where: { idProgresoUsuario: id },
      relations: {
        usuario: true,
        tema: true,
        subtema: true,
        leccion: true,
        ejercicio: true,
      },
    });
    if (!progreso) {
      throw new NotFoundException(`Progreso con ID ${id} no encontrado`);
    }
    return progreso;
  }

  async findProgesosByUsuario(idUsuario: number): Promise<ProgresoUsuario[]> {
    return await this.progresoRepository.find({
      where: { idUsuario },
      relations: {
        tema: true,
        subtema: true,
        leccion: true,
        ejercicio: true,
      },
    });
  }

  async findUltimoProgreso(idUsuario: number): Promise<ProgresoUsuario | null> {
    const progreso = await this.progresoRepository.findOne({
      where: { idUsuario },
      order: {
        updatedAt: 'DESC', // Trae el modificado más recientemente primero
      },
      relations: {
        tema: true,
        subtema: true,
        leccion: true,
        ejercicio: true,
      },
    });
    if (!progreso) {
      throw new NotFoundException(
        `No se encontró historial de progreso para el usuario ${idUsuario}`,
      );
    }
    return progreso;
  }

  /**
   * Actualiza el progreso del usuario.
   *
   * @param id - ID del progreso a actualizar.
   * @param updateDto - Datos de actualización (recibe el número de orden del próximo ejercicio y xp).
   * @returns El progreso del usuario actualizado.
   * @description
   * Si el ejercicio completado era el número 3 (el último del subtema),
   * el DTO debería registrar el subtema como completado (`subtemaCompletado = true`).
   */
  async update(
    id: number,
    updateDto: UpdateProgresoUsuarioDto,
  ): Promise<ProgresoUsuario> {
    const progresoActual = await this.findById(id);

    // Posición que el usuario acaba de intentar (no la próxima a guardar)
    const numOrdenLeccion =
      updateDto.numOrdenLeccion ?? progresoActual.numOrdenLeccion;
    const numOrdenEjercicio =
      updateDto.numOrdenEjercicio ?? progresoActual.numOrdenEjercicio;
    const ejercicioCompletado = updateDto.ejercicioCompletado ?? false;

    this.validarOrdenes(numOrdenLeccion, numOrdenEjercicio);

    // Cálculos puros (sin ir a la base), para saber hacia dónde avanza el usuario
    const estado = this.determinarEstadoCompletado(
      numOrdenLeccion,
      numOrdenEjercicio,
      ejercicioCompletado,
    );
    const proximaPosicion = this.calcularProximaPosicion(
      numOrdenLeccion,
      numOrdenEjercicio,
      ejercicioCompletado,
      estado.subtemaCompletado,
    );

    // Se valida que la próxima lección/ejercicio existan ANTES de hacer
    // las queries de porcentaje y el save, para no trabajar de más si falla
    const { leccion, ejercicio } = await this.resolverLeccionYEjercicio(
      progresoActual.idSubtema,
      proximaPosicion.numOrdenLeccion,
      proximaPosicion.numOrdenEjercicio,
    );
    const progresoEditado = this.progresoRepository.merge(
      progresoActual,
      updateDto,
      {
        idLeccion: leccion.idLeccion,
        idEjercicio: ejercicio.id_ejercicio,
        numOrdenLeccion: proximaPosicion.numOrdenLeccion,
        numOrdenEjercicio: proximaPosicion.numOrdenEjercicio,
        leccionCompletado: estado.leccionCompletado,
        subtemaCompletado: estado.subtemaCompletado,
      },
    );
    this.acumularXp(progresoEditado, progresoActual, updateDto.xpTotal);

    progresoEditado.porcentajeCompletadoSubtema =
      this.calcularPorcentajeSubtema(
        numOrdenLeccion,
        numOrdenEjercicio,
        ejercicioCompletado,
        estado.subtemaCompletado,
      );
    progresoEditado.porcentajeCompletadoTema =
      await this.calcularPorcentajeTema(
        progresoActual,
        progresoEditado.porcentajeCompletadoSubtema,
      );
    return await this.progresoRepository.save(progresoEditado);
  }

  /* ============================ 
  Helpers privados de "update" 
  =============================== */

  private validarOrdenes(
    numOrdenLeccion: number,
    numOrdenEjercicio: number,
  ): void {
    if (numOrdenLeccion < ORDEN_MIN || numOrdenLeccion > ORDEN_MAX) {
      throw new BadRequestException(
        `El número de orden de la lección debe estar entre ${ORDEN_MIN} y ${ORDEN_MAX}.`,
      );
    }
    if (numOrdenEjercicio < ORDEN_MIN || numOrdenEjercicio > ORDEN_MAX) {
      throw new BadRequestException(
        `El número de orden del ejercicio debe estar entre ${ORDEN_MIN} y ${ORDEN_MAX}.`,
      );
    }
  }

  private async resolverLeccionYEjercicio(
    idSubtema: number,
    numOrdenLeccion: number,
    numOrdenEjercicio: number,
  ): Promise<{ leccion: Leccion; ejercicio: Ejercicio }> {
    const leccion = await this.leccionService.findLeccionBySubtemaYOrden(
      idSubtema,
      numOrdenLeccion,
    );
    if (!leccion) {
      throw new NotFoundException(
        `No se encontró la lección con orden ${numOrdenLeccion} para el subtema ${idSubtema}`,
      );
    }
    const ejercicio = await this.ejercicioService.findByOrdenYLeccion(
      numOrdenEjercicio,
      leccion.idLeccion,
    );
    if (!ejercicio) {
      throw new NotFoundException(
        `El ejercicio con orden ${numOrdenEjercicio} no existe en la lección ${leccion.idLeccion}`,
      );
    }
    return { leccion, ejercicio };
  }

  private acumularXp(
    progresoEditado: ProgresoUsuario,
    progresoActual: ProgresoUsuario,
    xpDelta?: number,
  ): void {
    if (xpDelta !== undefined) {
      progresoEditado.xpTotal = progresoActual.xpTotal + xpDelta;
    }
  }

  /**
   * Calcula si la lección y/o el subtema quedan completados, en base a la
   * posición que el usuario acaba de intentar. No accede a la base de datos.
   */
  private determinarEstadoCompletado(
    numOrdenLeccion: number,
    numOrdenEjercicio: number,
    ejercicioCompletado: boolean,
  ): { leccionCompletado: boolean; subtemaCompletado: boolean } {
    const esUltimoEjercicioDeLaLeccion = numOrdenEjercicio === ORDEN_MAX;
    const esUltimaLeccionDelSubtema = numOrdenLeccion === ORDEN_MAX;
    const leccionCompletado =
      esUltimoEjercicioDeLaLeccion && ejercicioCompletado;
    const subtemaCompletado = leccionCompletado && esUltimaLeccionDelSubtema;
    return { leccionCompletado, subtemaCompletado };
  }

  /**
   * Dada la posición que el usuario acaba de intentar, calcula cuál es la
   * próxima posición (lección/ejercicio) que corresponde guardar.
   */
  private calcularProximaPosicion(
    numOrdenLeccion: number,
    numOrdenEjercicio: number,
    ejercicioCompletado: boolean,
    subtemaCompletado: boolean,
  ): { numOrdenLeccion: number; numOrdenEjercicio: number } {
    // Ya terminó todo el subtema: no hay próxima posición, se queda donde está
    if (subtemaCompletado) {
      return { numOrdenLeccion, numOrdenEjercicio };
    }

    // No completó el ejercicio actual: reintenta el mismo
    if (!ejercicioCompletado) {
      return { numOrdenLeccion, numOrdenEjercicio };
    }

    // Completó el ejercicio pero no era el último de la lección: avanza de ejercicio
    if (numOrdenEjercicio < ORDEN_MAX) {
      return { numOrdenLeccion, numOrdenEjercicio: numOrdenEjercicio + 1 };
    }

    // Completó el último ejercicio de la lección: pasa a la próxima lección, ejercicio 1
    return {
      numOrdenLeccion: numOrdenLeccion + 1,
      numOrdenEjercicio: ORDEN_MIN,
    };
  }

  private calcularPorcentajeSubtema(
    numOrdenLeccion: number,
    numOrdenEjercicio: number,
    ejercicioCompletado: boolean,
    subtemaCompletado: boolean,
  ): number {
    if (subtemaCompletado) {
      return 100;
    }
    const ejerciciosLeccionesAnteriores =
      (numOrdenLeccion - 1) * EJERCICIOS_POR_LECCION;

    let ejerciciosLeccionActual = numOrdenEjercicio - 1;
    if (ejercicioCompletado) {
      ejerciciosLeccionActual += 1;
    }
    const totalCompletados =
      ejerciciosLeccionesAnteriores + ejerciciosLeccionActual;
    const porcentaje = (totalCompletados / TOTAL_EJERCICIOS_POR_SUBTEMA) * 100;
    return parseFloat(porcentaje.toFixed(2));
  }

  private async calcularPorcentajeTema(
    progresoActual: ProgresoUsuario,
    porcentajeSubtemaActual: number,
  ): Promise<number> {
    const subtemasDelTema = await this.subtemaRepository.find({
      where: { idTema: progresoActual.idTema },
    });
    if (subtemasDelTema.length === 0) {
      return 0;
    }
    const progresosDelTema = await this.progresoRepository.find({
      where: {
        idUsuario: progresoActual.idUsuario,
        idTema: progresoActual.idTema,
      },
    });

    const porcentajePorSubtema = new Map<number, number>();
    progresosDelTema.forEach((p) => {
      // Se ignora el valor viejo en BD del subtema actual: usamos el recién calculado
      if (p.idSubtema !== progresoActual.idSubtema) {
        porcentajePorSubtema.set(p.idSubtema, p.porcentajeCompletadoSubtema);
      }
    });
    porcentajePorSubtema.set(progresoActual.idSubtema, porcentajeSubtemaActual);
    const sumaPorcentajes = subtemasDelTema.reduce(
      (acumulado, subtema) =>
        acumulado + (porcentajePorSubtema.get(subtema.idSubtema) ?? 0),
      0,
    );
    const porcentajeTema = sumaPorcentajes / subtemasDelTema.length;
    return parseFloat(porcentajeTema.toFixed(2));
  }

  async remove(id: number): Promise<{ message: string }> {
    const progreso = await this.findById(id);
    if (!progreso) {
      throw new NotFoundException(`Progreso con ID ${id} no encontrado`);
    }
    await this.progresoRepository.remove(progreso);
    return { message: `Progreso con ID ${id} eliminado correctamente` };
  }
}
