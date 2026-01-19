import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'int', nullable: true })
  year: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
