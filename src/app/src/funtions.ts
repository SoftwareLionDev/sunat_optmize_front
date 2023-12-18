import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgxSpinnerService } from "ngx-spinner";
import * as XLSX from 'xlsx';
import { QuestionComponent } from "../components/question/question.component";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class Funtions {
    constructor(
        private snackBar: MatSnackBar,
        private spinner: NgxSpinnerService,
        private modals: MatDialog
    ) {

    }

    public message_error(message: string) {
        this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            verticalPosition: 'top', // Puede ser 'top', 'bottom', o 'center'
            horizontalPosition: 'center', // Puede ser 'start', 'center', 'end', o 'left' y 'right'
        });
    }

    public message_information(message: string) {
        this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            verticalPosition: 'top', // Puede ser 'top', 'bottom', o 'center'
            horizontalPosition: 'center', // Puede ser 'start', 'center', 'end', o 'left' y 'right'
        });
    }
    

    public delete_user() {
        this.modals.open(QuestionComponent, {
            width: '330px',
        })
    }



    get_ls_configuration() {
        const ls = localStorage.getItem('configuration');
        return ls ? JSON.parse(ls) : null;
    }

    set_ls_configuration(remember: boolean, mail: string, password: string) {
        const configuration_ls = {
            remember: remember,
            mail: remember ? mail : '',
            password: remember ? password : ''
        };

        localStorage.setItem('configuration', JSON.stringify(configuration_ls));
    }

    public show_spinner() {
        this.spinner.show();
    }

    public hiden_loading() {
        this.spinner.hide();
    }

    date_db(date_user: string) {
        let a_date_user = date_user.split('/');

        return a_date_user[2] + '-' + a_date_user[1] + '-' + a_date_user[0];
    }

    date_user(date_db: string) {
        let a_date_user = date_db.split('-');

        return a_date_user[2] + '/' + a_date_user[1] + '/' + a_date_user[0];
    }

    convert_date(value_date: any, format = 'dd/mm/yyyy') {
        const es_Date = value_date instanceof Date;

        // Si es un string (2023-01-05) y no tiene una T, y no es una fecha
        if (!es_Date && !value_date.includes('T')) {
            value_date = value_date + 'T00:00:00';
        }

        let date = es_Date ? value_date : new Date(value_date.replace('.000Z', ''));

        // Obtenemos el día, mes y año por separado
        const dia = date.getDate().toString().padStart(2, '0'); // Agrega un 0 delante si es de un solo dígito
        const mes = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes comienza desde 0, por eso sumamos 1
        const anio = date.getFullYear();

        format = format.replace('dd', dia);
        format = format.replace('mm', mes);
        format = format.replace('yyyy', anio);

        return format;
    }

    print_pdfbase64(pdf_base64: any) {
        let byteCharacters = atob(pdf_base64);
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        let file = new Blob([byteArray], { type: 'application/pdf;base64' });
        let fileURL = URL.createObjectURL(file)

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = fileURL;
        document.body.appendChild(iframe);
        iframe.contentWindow!.print();
    }

    download_file64(base64Data: string, type_file: string, name_file: string) {
        const binaryData = atob(base64Data);

        // Paso 2: Crear un Blob
        const array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            array[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([array], { type: 'application/' + type_file });

        // Paso 3: Crear una URL de objeto
        const url = URL.createObjectURL(blob);

        // Paso 4: Crear un enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = name_file; // Nombre del archivo

        // Paso 5: Disparar un clic en el enlace
        a.click();

        // Limpiar la URL de objeto después de descargar
        URL.revokeObjectURL(url);
    }

    exporto_to_excel(data: any) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'datos.xlsx');
    }



    public empty_form(form: FormGroup) {

        return Object.values(form.controls).forEach(control => {
            if (control instanceof FormGroup) {
                Object.values(control.controls).forEach(control => control.markAsTouched());
            }
            else {
                control.markAsTouched();
            }
        });
    }

}