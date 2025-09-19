import { UserRoles } from 'src/common/enums/roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ default: false })
  isAccountVerified: boolean;

@Column({ type: 'varchar', length: 10, nullable: true, default: null })
verificationCode: string | null;


  @Column({
    nullable: true,
    type: 'json',
    default: () =>
      '\'{"url": "https://res.cloudinary.com/dw1bs1boz/image/upload/v1702487318/Zef-Blog/Default%20images/download_w26sr9.jpg", "public_id": null}\'',
  })
  profileImage: { url: string; public_id: string | null };

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;


  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
