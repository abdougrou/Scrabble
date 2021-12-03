import { AfterViewInit, Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { EditDictionaryPopupComponent } from '@app/components/edit-dictionary-popup/edit-dictionary-popup.component';
import { DICTIONARY_MODIFY_MESSAGE, SNACKBAR_CONFIG } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { DEFAULT_DICTIONARY_NAME } from '@common/constants';
import { DictionaryInfo } from '@common/dictionaryTemplate';

@Component({
    selector: 'app-dictionary-popup',
    templateUrl: './dictionary-popup.component.html',
    styleUrls: ['./dictionary-popup.component.scss'],
})
export class DictionaryPopupComponent implements AfterViewInit {
    displayedColumns = ['name', 'description', 'edit', 'delete', 'download'];
    dictionaryTitles: MatTableDataSource<DictionaryInfo>;

    constructor(
        public communication: CommunicationService,
        public dialogRef: MatDialogRef<DictionaryPopupComponent>,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
    ) {}

    ngAfterViewInit() {
        this.getDictionaries();
    }

    getDictionaries() {
        this.communication.getDictionaryInfo().subscribe((info) => {
            this.dictionaryTitles = new MatTableDataSource<DictionaryInfo>(info);
        });
    }

    back() {
        this.dialogRef.close();
    }

    edit(element: DictionaryInfo) {
        const dialogRef = this.dialog.open(EditDictionaryPopupComponent, {
            disableClose: true,
            height: '550px',
            width: '550px',
            data: element,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result !== '') {
                this.communication.modifyDictionary(element.title, result).subscribe((response) => {
                    if (!response) {
                        this.snackBar.open(DICTIONARY_MODIFY_MESSAGE, 'Fermer', SNACKBAR_CONFIG);
                    }
                });
                this.getDictionaries();
            }
        });
    }

    deleteDictionary(element: DictionaryInfo) {
        this.communication.deleteDictionary(element).subscribe();
        this.getDictionaries();
    }

    isDefault(element: DictionaryInfo): boolean {
        return element.title === DEFAULT_DICTIONARY_NAME;
    }

    downloadDictionary(element: DictionaryInfo) {
        this.communication.getDictionaryFile(element).subscribe((data) => {
            const file = new Blob([data], { type: '.json' });
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(file);
            a.href = objectUrl;
            a.download = `${element.title}.json`;
            a.click();
            URL.revokeObjectURL(objectUrl);
        });
    }
}
