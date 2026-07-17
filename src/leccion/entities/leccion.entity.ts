import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Subtema } from '../../subtema/entities/subtema.entity';
import { Ejercicio } from '../../ejercicio/entities/ejercicio.entity';
// import { ProgresoLeccion } from '../progreso/progreso-leccion.entity';

@Entity('lecciones')
export class Leccion {
  @PrimaryGeneratedColumn({ name: 'id_leccion' })
  idLeccion!: number;

  @Column({ name: 'id_subtema' })
  idSubtema!: number;

  @Column({ name: 'titulo_leccion', length: 255 })
  tituloLeccion!: string;

  @Column({ name: 'subtitulo_leccion', length: 255, default: 'null' })
  subtituloLeccion!: string;

  @Column({ name: 'descripcion_leccion', type: 'text', nullable: true })
  descripcionLeccion!: string;

  @Column({ name: 'contenido_leccion', type: 'text' })
  contenidoLeccion!: string;

  @Column({ name: 'tips', type: 'text', default: 'null' })
  tips!: string;

  @Column({ type: 'int', default: 1 })
  numOrden!: number;

  @ManyToOne(() => Subtema, (subtema) => subtema.lecciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_subtema' })
  subtema!: Subtema;

  // Relación: LECCION ||--o{ EJERCICIO (Una lección contiene muchos ejercicios)
  @OneToMany(() => Ejercicio, (ejercicio) => ejercicio.leccion)
  ejercicios!: Ejercicio[];

  // Relación: LECCION ||--o{ PROGRESO_LECCION
  // @OneToMany(() => ProgresoLeccion, (progreso) => progreso.leccion)
  // progresos: ProgresoLeccion[];
}
