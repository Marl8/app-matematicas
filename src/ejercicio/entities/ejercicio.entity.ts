import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OpcionesEjercicio } from '../../opciones_ejercicio/entities/opciones_ejercicio.entity';
import { Leccion } from '../../leccion/entities/leccion.entity';
import { DificultadSubtema } from '../../subtema/entities/enums/dificultad.enum';

@Entity('ejercicios')
export class Ejercicio {
  @PrimaryGeneratedColumn()
  id_ejercicio!: number;

  @Column({ type: 'int' })
  id_leccion!: number;

  // 2. Definimos la relación formal con Leccion
  @ManyToOne(() => Leccion, (leccion) => leccion.ejercicios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_leccion' })
  leccion!: Leccion;

  @Column({ type: 'int', default: 1 })
  num_orden!: number;

  @Column({ type: 'varchar', length: 100 })
  titulo_ejercicio!: string;

  @Column({ type: 'text' })
  enunciado_ejercicio!: string;

  @Column({ type: 'text', nullable: true })
  explicacion_ejercicio!: string;

  @Column({
    name: 'dificultad_ejercicio',
    type: 'enum',
    enum: DificultadSubtema,
    default: DificultadSubtema.MEDIA, // Opcional: establecemos un valor por defecto
  })
  dificultad_ejercicio!: DificultadSubtema;

  @Column({ type: 'int' })
  recompensa_xp!: number;

  // Relación en cascada con las opciones
  @OneToMany(() => OpcionesEjercicio, (opcion) => opcion.ejercicio, {
    cascade: true,
    eager: true,
  })
  opciones!: OpcionesEjercicio[];
}
