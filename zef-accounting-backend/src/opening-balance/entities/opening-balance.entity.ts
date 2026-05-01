// src/opening-balance/entities/opening-balance.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { AccountEntity } from 'src/chart/entities/chart.entity';
import { CostCenterEntity } from 'src/cost-center/entities/cost-center.entity';
import { FiscalYearEntity } from 'src/fiscal-year/entities/fiscal-year.entity';

@Entity('opening_balances')
@Unique(['account', 'fiscalYear', 'costCenter'])
// ✅ unique على (حساب + سنة + مركز تكلفة)
// لو costCenter = null معناه رصيد على مستوى الشركة
export class OpeningBalanceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => AccountEntity, { eager: true })
  @JoinColumn({ name: 'accountId' })
  account!: AccountEntity;

  @ManyToOne(() => FiscalYearEntity, { eager: true })
  @JoinColumn({ name: 'fiscalYearId' })
  fiscalYear!: FiscalYearEntity;

  @ManyToOne(() => CostCenterEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'costCenterId' })
  costCenter?: CostCenterEntity | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debit!: number;   // مجموع الـ debit من السنة السابقة

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  credit!: number;  // مجموع الـ credit من السنة السابقة

  // ✅ هل الرصيد ده اتولد تلقائياً من الإقفال ولا أدخله المحاسب يدوياً؟
  @Column({ default: false })
  isGenerated!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}