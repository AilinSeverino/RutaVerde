export interface Region {
  id_region: number;
  nombre: string;
  plantas?: Array<{ id_planta: number; nombre: string }>;
}