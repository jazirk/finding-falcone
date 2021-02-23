import {Component, OnDestroy, OnInit} from '@angular/core';
import {Planet} from '../../models/planet.model';
import {Vehicle} from '../../models/vehicle.model';
import {DataService} from '../../services/data.service';
import {NavigationExtras, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {NavigateService} from '../../services/navigate.service';

@Component({
  selector: 'ff-galaxy',
  templateUrl: './galaxy.component.html',
  styleUrls: ['./galaxy.component.scss']
})
export class GalaxyComponent implements OnInit, OnDestroy {

  planets: Array<Planet> = [];
  vehicles: Array<Vehicle> = [];

  planetSelectedCount: number = 0;
  planetAssignedVehicles: number = 0;

  lastDragOperation: boolean = false;

  timeToTravel: number = 0;

  resetSub: Subscription;

  constructor(private dataService: DataService, private toastr: ToastrService,
              private router: Router, private navigateService: NavigateService) {
  }

  ngOnInit() {

    this.planetSelectedCount = 0;

    this.dataService.getPlanets().subscribe(
      (planets: Planet[]) => {
        this.planets = planets;
      }
    );

    this.dataService.getVehicles().subscribe(
      (vehicles: Vehicle[]) => {
        this.vehicles = [];
        // Repeating the vehicle the totalNo that is available.
        for (const vehicle of vehicles) {
          for (let i = 1; i <= vehicle.total_no; i++) {
            vehicle.isAvailable = true;
            vehicle.id = vehicle.name + '_' + i;
            this.vehicles.push(JSON.parse(JSON.stringify(vehicle)));
          }
        } // Loop end

      });

    this.resetSub = this.navigateService.resetSubject.subscribe(_ => {
      this.reset();
    });

  }

  selectThisPlanet(planet: Planet) {

    if (!planet.isSelected) {
      if (this.planetSelectedCount === 4) {

        this.toastr.error('Please unselect a previous selection and then select a new Planet.');
        return false;
      }
    }

    planet.isSelected = !planet.isSelected;

    // If there has been a deselection, remove the assigned vehicle as well.
    if (!planet.isSelected) {

      if (planet.assignedVehicle) {

        this.resetVehicles(planet.assignedVehicle); // Reset the vehicles
        planet.assignedVehicle = null;

        this.recalculateAssignedVehicles();
        this.recalculateTime();

      }
    }

    this.planetSelectedCount = 0;
    this.planets.forEach(planet => {
      this.planetSelectedCount += planet.isSelected ? 1 : 0;
    });
  }


  allowDrop(ev) {
    ev.preventDefault();
  }

  dragVehicle(ev, vehicle) {
    const img = new Image();
    img.src = 'assets/icons/' + vehicle.name.toLowerCase() + '_new.PNG';
    img.width = 50;
    img.height = 50;

    ev.dataTransfer.setData('text/plain', JSON.stringify(vehicle));
    ev.dataTransfer.setDragImage(img, 0, 0);
  }


  connectVehicleToPlanet(ev, planet) {

    ev.preventDefault();

    // We have the vehicle and the planet that it is being dropped on. So first we check if the vehicle can cover the distance or not
    // console.log(planet);

    const vehicleData = JSON.parse(ev.dataTransfer.getData('text/plain'));
    if (vehicleData.max_distance < planet.distance) {

      this.toastr.error('The vehicle chosen cannot travel to this planet.');
      this.lastDragOperation = false;
      return false;

    } else if (!planet.isSelected) {

      this.toastr.error('This planet has not been chosen for exploration.');
      this.lastDragOperation = false;
      return false;

    } else {

      if (planet.assignedVehicle) {
        this.resetVehicles(planet.assignedVehicle);
      }

      planet.assignedVehicle = vehicleData;
      this.lastDragOperation = true;

      this.recalculateAssignedVehicles();
      this.recalculateTime();

    }
  }

  markVehicleForSelection(ev, vehicle) {

    if (ev.dataTransfer.dropEffect === 'none') {
      return false;
    } else {

      if (this.lastDragOperation) // Since the drag operation might be rejected because of business reasons
      {
        vehicle.isAvailable = false;
      }
    }
  }

  resetVehicles(assignedVehicle) {

    // Need to reset vehicles as well.
    this.vehicles = this.vehicles.map(vehicle => {
      if (vehicle.id === assignedVehicle.id) {
        vehicle.isAvailable = true;
      }
      return vehicle;
    });
  }

  reset() {
    this.vehicles = this.vehicles.map(vehicle => {
      vehicle.isAvailable = true;
      return vehicle;
    });
    this.planets = this.planets.map(planet => {
      planet.isSelected = false;
      planet.assignedVehicle = null;
      return planet;
    });
    this.planetSelectedCount = this.planetAssignedVehicles = 0;
    this.timeToTravel = 0;
  }


  recalculateAssignedVehicles() {

    this.planetAssignedVehicles = 0;
    this.planets.forEach(planet => {
      this.planetAssignedVehicles += planet.assignedVehicle ? 1 : 0;
    });
  }


  recalculateTime() {

    this.timeToTravel = 0;

    const travelTimes = [];
    this.planets.forEach(planet => {
      if (planet.isSelected && planet.assignedVehicle) {
        travelTimes.push(Math.round(planet.distance / planet.assignedVehicle.speed));
      }
    });

    this.timeToTravel = Math.max(...travelTimes);
  }


  findFalcone() {

    let response = {};

    if (this.planetSelectedCount < 4 || this.planetAssignedVehicles < 4) {
      this.toastr.error('Please choose 4 planets & assign appropraite vehicles to them to proceed.');
      return false;
    } else if (this.planetSelectedCount === 4 && this.planetAssignedVehicles === 4) {

      this.dataService.getToken().subscribe(
        token => {

          const body = {};
          body['token'] = token;
          body['planet_names'] = [];
          body['vehicle_names'] = [];

          this.planets.forEach(planet => {
            if (planet.isSelected) {
              body['planet_names'].push(planet.name);
              if (planet.assignedVehicle) {
                body['vehicle_names'].push(planet.assignedVehicle.name);
              }
            }
          });

          this.dataService.findFalcone(body).subscribe(
            response => {
              // console.log(response);
            });
        }, error => {

          console.log('No token available. Mock Implementation kicks in.');

          const randomPlanetIndex = Math.floor(Math.random() * (6 - 0)) + 0;
          const winnerPlanet = this.planets[randomPlanetIndex];

          let planetFound = false;

          this.planets.forEach(planet => {
            if (planet.isSelected) {
              if (planet.name === winnerPlanet.name) {
                planetFound = true;
              }
            }
          });

          if (planetFound) {

            response = {
              'planet_name': winnerPlanet.name,
              'time_taken': this.timeToTravel,
              'status': 'success'
            };
          } else {

            response = {
              'status': 'failure'
            };
          }

          const navigationExtras: NavigationExtras = {
            queryParams: {
              response: JSON.stringify(response)
            }
          };
          this.router.navigate(['result'], navigationExtras);

        });
    }
  }

  ngOnDestroy() {
    this.resetSub.unsubscribe();
  }
}
