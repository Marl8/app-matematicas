import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Tema } from '../../tema/entities/tema.entity';
import { DificultadSubtema } from './enums/dificultad.enum';
import { Leccion } from '../../leccion/entities/leccion.entity';

@Entity('subtemas')
export class Subtema {
  @PrimaryGeneratedColumn({ name: 'id_subtema' })
  idSubtema!: number;

  @Column({ name: 'id_tema' })
  idTema!: number;

  @Column({ name: 'nombre_subtema' })
  nombreSubtema!: string;

  @Column({
    name: 'dificultad_subtema',
    type: 'enum',
    enum: DificultadSubtema,
    default: DificultadSubtema.MEDIA, // Opcional: establecemos un valor por defecto
  })
  dificultadSubtema!: DificultadSubtema;

  // Relación: Muchos Subtemas pertenecen a un Tema
  @ManyToOne(() => Tema, (tema) => tema.subtemas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_tema' })
  tema!: Tema;

  // Relación: Un Subtema tiene muchas Lecciones
  @OneToMany(() => Leccion, (leccion) => leccion.subtema)
  lecciones!: Leccion[];
}
