import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Tema } from '../../tema/entities/tema.entity';
import { Subtema } from '../../subtema/entities/subtema.entity';
import { Leccion } from '../../leccion/entities/leccion.entity';
import { Ejercicio } from '../../ejercicio/entities/ejercicio.entity';

@Entity('progreso_usuario')
@Index(['idUsuario', 'idSubtema'], { unique: true }) // clave compuesta
export class ProgresoUsuario {
  @PrimaryGeneratedColumn({ name: 'id_progreso_usuario' })
  idProgresoUsuario!: number;

  @Column({ name: 'id_usuario' })
  idUsuario!: number;

  @Column({ name: 'id_tema' })
  idTema!: number;

  @Column({ name: 'id_subtema' })
  idSubtema!: number;

  @Column({ name: 'id_leccion' })
  idLeccion!: number;

  @Column({ name: 'id_ejercicio', default: 1 })
  idEjercicio!: number;

  @Column({ type: 'int', default: 1 })
  numOrdenLeccion!: number;

  @Column({ type: 'int', default: 1 })
  numOrdenEjercicio!: number;

  @Column({ name: 'leccion_completada', default: false })
  leccionCompletado!: boolean;

  @Column({ name: 'subtema_completado', default: false })
  subtemaCompletado!: boolean;

  @Column({ name: 'porcentaje_completado_tema', type: 'float', default: 0 })
  porcentajeCompletadoTema!: number;

  @Column({ name: 'porcentaje_completado_subtema', type: 'float', default: 0 })
  porcentajeCompletadoSubtema!: number;

  @Column({ name: 'xp_total', default: 0 })
  xpTotal!: number;

  // Relaciones
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: User;

  @ManyToOne(() => Tema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_tema' })
  tema!: Tema;

  @ManyToOne(() => Subtema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_subtema' })
  subtema!: Subtema;

  @ManyToOne(() => Leccion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_leccion' })
  leccion!: Leccion;

  @ManyToOne(() => Ejercicio, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_ejercicio' })
  ejercicio!: Ejercicio;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
