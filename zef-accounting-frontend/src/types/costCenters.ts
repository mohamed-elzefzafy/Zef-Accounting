export type CostCenterType = 'project' | 'product' | 'branch';

export interface ICostCenter {
  id: number; 
  name: string;
  type: CostCenterType;
  description?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
