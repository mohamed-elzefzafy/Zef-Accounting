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
import { JournalEntryType } from 'src/shared/enums/jornal-entries.enum';

@Entity('journal_entries')
@Unique(['code'])
export class JournalEntryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  date!: Date;

  @Column()
  description!: string;

  @Column()
  sequenceNumber!: number; // رقم القيد داخل الشهر

  @Column()
  code!: string; // كود فريد (سنة-شهر-رقم)

  @Column({ default: false })
  isClosing!: boolean; // ✅ علامة لو القيد خاص بالإقفال

    @Column({ default: false })
  isOpening!: boolean; // ✅ علامة لو القيد خاص بالإقفال

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'createdBy' })
  createdBy!: UserEntity;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'lastModifiedBy' })
  lastModifiedBy?: UserEntity;

    @Column({ 
    type: 'enum', 
    enum: JournalEntryType, 
    default: JournalEntryType.NORMAL 
  })
  type!: JournalEntryType;

  @OneToMany(() => JournalEntryLineEntity, (line) => line.journalEntry, {
    cascade: true,
    eager: true,
  })
  lines!: JournalEntryLineEntity[];

  @ManyToOne(() => FiscalYearEntity, (fy) => fy.journalEntries, {
    onDelete: 'CASCADE',
  })
  fiscalYear!: FiscalYearEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity('journal_entry_entries')
export class JournalEntryLineEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => JournalEntryEntity, (entry) => entry.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'journalEntryId' })
  journalEntry!: JournalEntryEntity;

  @ManyToOne(() => AccountEntity, { eager: true })
  @JoinColumn({ name: 'accountId' })
  account!: AccountEntity;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debit!: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  credit!: number;

  @ManyToOne(() => CostCenterEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'costCenterId' })
  costCenter?: CostCenterEntity;
}
