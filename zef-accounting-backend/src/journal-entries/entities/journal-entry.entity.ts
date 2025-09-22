// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument, Types } from 'mongoose';

// export type JournalEntryDocument = HydratedDocument<JournalEntry>;

// @Schema({ timestamps: true })
// export class JournalEntry {
//   @Prop({ type: Date, required: true })
//   date: Date;

//   @Prop({ required: true })
//   description: string;

//   @Prop({
//     type: [
//       {
//         account: { type: Types.ObjectId, ref: 'Account', required: true },
//         debit: { type: Number, default: 0 },
//         credit: { type: Number, default: 0 },
//         costCenter: { type: Types.ObjectId, ref: 'CostCenter', default: null },
//       },
//     ],
//     required: true,
//   })
//   entries: {
//     account: Types.ObjectId;
//     debit: number;
//     credit: number;
//     costCenter?: Types.ObjectId | null;
//   }[];

//   @Prop({ type: Number, required: true })
//   sequenceNumber: number; // 👈 رقم القيد داخل الشهر

//   @Prop({ type: String, required: true, unique: true })
//   code: string; // 👈 كود فريد (سنة-شهر-رقم)

//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   createdBy: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'User' })
//   lastModifiedBy?: Types.ObjectId;
// }

// export const JournalEntrySchema = SchemaFactory.createForClass(JournalEntry);

// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   OneToMany,
//   JoinColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
//   Unique,
// } from 'typeorm';
// import { UserEntity } from 'src/users/entities/user.entity';
// import { AccountEntity } from 'src/chart/entities/chart.entity';
// import { CostCenterEntity } from 'src/cost-center/entities/cost-center.entity';
// import { FiscalYearEntity } from 'src/fiscal-year/entities/fiscal-year.entity';

// @Entity('journal_entries')
// @Unique(['code'])
// export class JournalEntryEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'date' })
//   date: Date;

//   @Column()
//   description: string;

//   @Column()
//   sequenceNumber: number; // رقم القيد داخل الشهر

//   @Column()
//   code: string; // كود فريد (سنة-شهر-رقم)

//   @ManyToOne(() => UserEntity, { eager: true })
//   @JoinColumn({ name: 'createdBy' })
//   createdBy: UserEntity;

//   @ManyToOne(() => UserEntity, { eager: true, nullable: true })
//   @JoinColumn({ name: 'lastModifiedBy' })
//   lastModifiedBy?: UserEntity;

//   @OneToMany(() => JournalEntryLineEntity, (line) => line.journalEntry, {
//     cascade: true,
//     eager: true,
//   })
//   entries: JournalEntryLineEntity[];

//   @ManyToOne(() => FiscalYearEntity, (fy) => fy.journalEntries, {
//     onDelete: 'CASCADE',
//   })
//   fiscalYear: FiscalYearEntity;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('journal_entry_entries')
// export class JournalEntryLineEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => JournalEntryEntity, (entry) => entry.entries, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'journalEntryId' })
//   journalEntry: JournalEntryEntity;

//   @ManyToOne(() => AccountEntity, { eager: true })
//   @JoinColumn({ name: 'accountId' })
//   account: AccountEntity;

//   @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
//   debit: number;

//   @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
//   credit: number;

//   @ManyToOne(() => CostCenterEntity, { eager: true, nullable: true })
//   @JoinColumn({ name: 'costCenterId' })
//   costCenter?: CostCenterEntity;
// }



import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { AccountEntity } from 'src/chart/entities/chart.entity';
import { CostCenterEntity } from 'src/cost-center/entities/cost-center.entity';
import { FiscalYearEntity } from 'src/fiscal-year/entities/fiscal-year.entity';

@Entity('journal_entries')
@Unique(['code'])
export class JournalEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  description: string;

  @Column()
  sequenceNumber: number; // رقم القيد داخل الشهر

  @Column()
  code: string; // كود فريد (سنة-شهر-رقم)

  @Column({ default: false })
  isClosing: boolean; // ✅ علامة لو القيد خاص بالإقفال

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'lastModifiedBy' })
  lastModifiedBy?: UserEntity;

  @OneToMany(() => JournalEntryLineEntity, (line) => line.journalEntry, {
    cascade: true,
    eager: true,
  })
  entries: JournalEntryLineEntity[];

  

  @ManyToOne(() => FiscalYearEntity, (fy) => fy.journalEntries, {
    onDelete: 'CASCADE',
  })
  fiscalYear: FiscalYearEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('journal_entry_entries')
export class JournalEntryLineEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JournalEntryEntity, (entry) => entry.entries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'journalEntryId' })
  journalEntry: JournalEntryEntity;

  @ManyToOne(() => AccountEntity, { eager: true })
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  credit: number;

  @ManyToOne(() => CostCenterEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'costCenterId' })
  costCenter?: CostCenterEntity;
}
