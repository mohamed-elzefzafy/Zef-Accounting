export type CostCenterType = 'project' | 'product' | 'branch';

export interface ICostCenter {
  _id?: string; 
  name: string;
  type: CostCenterType;
  description?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
