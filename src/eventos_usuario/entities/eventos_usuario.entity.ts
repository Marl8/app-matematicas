import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, Index } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Leccion } from '../../leccion/entities/leccion.entity';
import { Ejercicio } from '../../ejercicio/entities/ejercicio.entity';

@Entity('eventos_usuario')
@Index(['usuario'])
export class EventosUsuario {
    @PrimaryGeneratedColumn()
    id_evento!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: User;

    @Column()
    tipo_evento!: string;

    @CreateDateColumn()
    fecha_evento!: Date;

    @ManyToOne(() => Leccion, { nullable: true })
    @JoinColumn({ name: 'id_leccion' })
    leccion?: Leccion;

    @ManyToOne(() => Ejercicio, { nullable: true })
    @JoinColumn({ name: 'id_ejercicio' })
    ejercicio?: Ejercicio;

    @Column({ nullable: true })
    puntos?: number;
}
