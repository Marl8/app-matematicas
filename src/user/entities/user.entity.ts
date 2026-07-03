import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // El signo ! le dice a Typescript que ya sabemos que esos datos no seinicializaron

  @Column({ unique: true })
  email!: string;

  @Column({ default: 'null' })
  avatar!: string;

  @Column()
  username!: string;

  @Column({ select: false })
  password?: string; // El signo ? es opcional por si no queremos exponerlo en consultas locales
}
