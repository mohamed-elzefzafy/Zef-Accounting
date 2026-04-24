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
  id!: string;

  @Column()
  year!: number;

  @Column({ default: false })
  isClosed!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  closedAt!: Date | null;

  // 👇 relation مع UserEntity
  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'closedBy' })
  closedBy!: UserEntity | null;

  @OneToMany(() => JournalEntryEntity, (entry) => entry.fiscalYear)
  journalEntries!: JournalEntryEntity[];
}
