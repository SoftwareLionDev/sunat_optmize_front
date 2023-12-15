import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent {
  constructor(
    private _snackBar: MatSnackBar,
  ) { }

  public openSnackBar() {
    const horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    const verticalPosition: MatSnackBarVerticalPosition = 'top';
    const durationInSeconds = 5;

    // this._snackBar.openFromComponent(NotificationComponent, {
    //   duration: durationInSeconds * 100,
    //   horizontalPosition: horizontalPosition,
    //   verticalPosition: verticalPosition,
    //   panelClass: 'mat-snack-bar-container'
    // });
  }
}
