import { Overlay } from '@angular/cdk/overlay';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { DisplayDictionaryPopupComponent } from '@app/components/display-dictionary-popup/display-dictionary-popup.component';
import { PlayerNameOptionsComponent } from '@app/components/player-name-options/player-name-options.component';
import { DIALOG_HEIGHT, DIALOG_WIDTH } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { DictionaryTemplate } from '@common/dictionaryTemplate';
import { FileTemplate } from '@common/fileTemplate';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

const PERCENT = 100;

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    providers: [MatDialog, Overlay],
})
export class AdminPageComponent {
    requiredFileType = '.json';
    uploadProgress: number | null;
    uploadSub: Subscription | null;
    fileName = '';
    fileToUpload: File | null = null;
    dictionary: DictionaryTemplate;

    constructor(public dialog: MatDialog, private communication: CommunicationService) {}

    openNames() {
        this.dialog.open(PlayerNameOptionsComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
        });
    }

    reset() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'abandon-page-component';
        dialogConfig.height = '200px';
        dialogConfig.width = '550px';
        dialogConfig.data = 'reset';
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.communication.resetPlayerNames().subscribe();
            }
        });
        this.communication.resetPlayerNames().subscribe();
        this.communication.resetPlayerScores().subscribe();
    }

    onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        const file: File | null = (target.files as FileList)[0];
        if (file) {
            this.fileName = file.name;
            const reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                this.dictionary = JSON.parse(reader.result as string);
                const template: FileTemplate = { fileName: file.name, file: this.dictionary };
                const upload$ = this.communication.postFile(template).pipe(finalize(() => this.resetFile()));
                this.uploadSub = upload$.subscribe((httpEvent: HttpEvent<unknown>) => {
                    if (httpEvent.type === HttpEventType.UploadProgress && httpEvent.total) {
                        this.uploadProgress = Math.round(PERCENT * (httpEvent.loaded / httpEvent.total));
                    }
                });
            };
        }
    }

    cancelUpload() {
        if (this.uploadSub) {
            this.uploadSub.unsubscribe();
            this.resetFile();
        }
    }

    resetFile() {
        this.uploadProgress = null;
        this.uploadSub = null;
        this.fileName = '';
    }

    displayDictionary() {
        this.dialog.open(DisplayDictionaryPopupComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
            data: { dictionary: this.dictionary },
        });
    }
}
