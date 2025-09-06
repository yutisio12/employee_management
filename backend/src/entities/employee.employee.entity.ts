import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Timestamp } from "typeorm";

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column()
  // employeeId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  position: string;

  @Column()
  department: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  // REQUIRED COLUMNS
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({name: 'delete_by', nullable: true})
  deleteBy: string;

  @Column({ type: 'timestamp', nullable: true })
  deleteDatetime: Date;
}