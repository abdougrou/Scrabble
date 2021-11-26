import { Overlay } from '@angular/cdk/overlay';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlayerNameOptionsComponent } from '@app/components/player-name-options/player-name-options.component';
import { DIALOG_HEIGHT, DIALOG_WIDTH } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
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

    constructor(public dialog: MatDialog, private communication: CommunicationService) {}

    openNames() {
        this.dialog.open(PlayerNameOptionsComponent, {
            height: DIALOG_HEIGHT,
            width: DIALOG_WIDTH,
        });
    }

    reset() {
        //  window.alert('reset');
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
                const template: FileTemplate = { fileName: file.name, file: JSON.parse(reader.result as string) };
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
}
