import {Vehicle} from './vehicle.model';

export class Planet {
  name: string;
  distance: number;
  isSelected?: boolean;
  assignedVehicle?: Vehicle;
}
