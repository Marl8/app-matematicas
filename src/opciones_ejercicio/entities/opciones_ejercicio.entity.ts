import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ejercicio } from '../../ejercicio/entities/ejercicio.entity';

@Entity('opciones_ejercicio')
export class OpcionesEjercicio {
  @PrimaryGeneratedColumn()
  id_opciones!: number;

  @Column({ type: 'text' })
  texto_opcion!: string;

  @Column({ type: 'text', nullable: true })
  explicacion!: string;

  @Column({ type: 'boolean' })
  es_correcta!: boolean;

  // Relación: Muchas opciones pertenecen a un ejercicio
  @ManyToOne(() => Ejercicio, (ejercicio: Ejercicio) => ejercicio.opciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_ejercicio' })
  ejercicio!: Ejercicio;
}
