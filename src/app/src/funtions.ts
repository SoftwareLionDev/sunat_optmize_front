import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
  })
export class  Funtions{
    constructor(
        private snackBar: MatSnackBar
    ){

    }

    public message_error(message: string){
        this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            verticalPosition: 'top', // Puede ser 'top', 'bottom', o 'center'
            horizontalPosition: 'center', // Puede ser 'start', 'center', 'end', o 'left' y 'right'
        });
    }
}