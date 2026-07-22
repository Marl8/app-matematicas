import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Subtema } from '../../subtema/entities/subtema.entity';
import { Ejercicio } from '../../ejercicio/entities/ejercicio.entity';
import { OpcionesEjercicio } from '../../opciones_ejercicio/entities/opciones_ejercicio.entity';

@Entity('intento_ejercicio')
export class IntentoEjercicio {
    @PrimaryGeneratedColumn()
    id_intento!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: User;

    @ManyToOne(() => Subtema, { nullable: true })
    @JoinColumn({ name: 'id_subtema' })
    subtema!: Subtema;

    @ManyToOne(() => Ejercicio, { nullable: true })
    @JoinColumn({ name: 'id_ejercicio' })
    ejercicio!: Ejercicio;

    @ManyToOne(() => OpcionesEjercicio, { nullable: true })
    @JoinColumn({ name: 'id_opciones' })
    id_opciones?: OpcionesEjercicio | null;

    @Column({type: 'int', default: 1})
    nro_intento!: number;

    @Column({type: 'boolean',default: false})
    completado!: boolean;

    @Column({type: 'int',comment: 'Tiempo de respuesta en milisegundos', nullable: true })
    response_time!: number;
}