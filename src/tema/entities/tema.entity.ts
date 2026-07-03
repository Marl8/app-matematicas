import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subtema } from '../../subtema/entities/subtema.entity';

@Entity('temas')
export class Tema {
  @PrimaryGeneratedColumn()
  idTema!: number;

  @Column()
  nombreTema!: string;

  @Column()
  descripcionTema!: string;

  // Relación: Un Tema tiene muchos Subtemas
  @OneToMany(() => Subtema, (subtema) => subtema.tema)
  subtemas!: Subtema[];
}
