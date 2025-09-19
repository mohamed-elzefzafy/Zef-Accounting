// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { UserEntity } from 'src/users/entities/user.entity';

// @Entity('fiscal_years')
// export class FiscalYearEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   year: number; // مثال: 2025

//   @Column({ default: false })
//   isClosed: boolean;

//   @Column({ type: 'timestamp', nullable: true })
//   closedAt?: Date;

//   @ManyToOne(() => UserEntity, { eager: true, nullable: true })
//   @JoinColumn({ name: 'closedBy' })
//   closedBy?: UserEntity;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }



import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('fiscal_years')
export class FiscalYearEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  year: number;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  closedBy: string | null;
}
