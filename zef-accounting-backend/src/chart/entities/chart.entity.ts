import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccountType {
  Asset = 'Asset',
  Liability = 'Liability',
  Equity = 'Equity',
  Revenue = 'Revenue',
  Expense = 'Expense',
}

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: AccountType,
    nullable: false,
  })
  type: AccountType;

  @Column({ type: 'varchar', nullable: true })
  accountCode: string;

  // self relation (parent account)
  @ManyToOne(() => AccountEntity, (account) => account.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent?: AccountEntity | null;

  @OneToMany(() => AccountEntity, (account) => account.parent)
  children?: AccountEntity[];

  @Column({ type: 'boolean', default: false })
  isMain: boolean;

  @Column({ type: 'boolean', default: true })
  isSub: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
