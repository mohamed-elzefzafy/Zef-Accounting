// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { HydratedDocument } from 'mongoose';

// export type CostCenterDocument = HydratedDocument<CostCenter>;

// @Schema({ timestamps: true })
// export class CostCenter {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true, enum: ['project', 'product', 'branch'] })
//   type: string;

//   @Prop()
//   description?: string;

//   @Prop({ default: true })
//   active: boolean;
// }

// export const CostCenterSchema = SchemaFactory.createForClass(CostCenter);



// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('cost_centers')
// export class CostCenterEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'varchar', length: 255, nullable: false })
//   name: string;

//   @Column({
//     type: 'enum',
//     enum: ['project', 'product', 'branch'],
//     nullable: false,
//   })
//   type: 'project' | 'product' | 'branch';

//   @Column({ type: 'text', nullable: true })
//   description?: string;

//   @Column({ type: 'boolean', default: true })
//   active: boolean;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;
// }


import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CostCenterType {
  Project = 'project',
  Product = 'product',
  Branch = 'branch',
}

@Entity('cost_centers')
export class CostCenterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CostCenterType,
  })
  type: CostCenterType;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
