import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true})
  username: string

  @Column({unique: true })
  email: string;

  @Column({nullable: false})
  password: string;

  @Column({ default: 'user' })
  role: string;

  // REQUIRED COLUMNS
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}