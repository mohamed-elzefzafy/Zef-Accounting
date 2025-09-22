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



// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity('fiscal_years')
// export class FiscalYearEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ unique: true })
//   year: number;

//   @Column({ default: false })
//   isClosed: boolean;

//   @Column({ type: 'timestamp', nullable: true })
//   closedAt: Date | null;

//   @Column({ type: 'uuid', nullable: true })
//   closedBy: string | null;
// }



// import { JournalEntryEntity } from 'src/journal-entries/entities/journal-entry.entity';
// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   OneToMany,
// } from 'typeorm';

// @Entity('fiscal_years')
// export class FiscalYearEntity {
//   @PrimaryGeneratedColumn()
//   id: string;

//   @Column({ unique: true })
//   year: number;

//   @Column({ default: false })
//   isClosed: boolean;

//   @Column({ type: 'timestamp', nullable: true })
//   closedAt: Date | null;

//   @Column({ type: 'uuid', nullable: true })
//   closedBy: string | null;

//   // ✅ إضافة العلاقة مع القيود
//   @OneToMany(() => JournalEntryEntity, (entry) => entry.fiscalYear)
//   journalEntries: JournalEntryEntity[];
// }




// fiscal-year.entity.ts
import { JournalEntryEntity } from 'src/journal-entries/entities/journal-entry.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('fiscal_years')
export class FiscalYearEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  year: number;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date | null;

  // 👇 relation مع UserEntity
  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'closedBy' })
  closedBy: UserEntity | null;

  @OneToMany(() => JournalEntryEntity, (entry) => entry.fiscalYear)
  journalEntries: JournalEntryEntity[];
}
