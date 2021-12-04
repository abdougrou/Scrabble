import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryTemplate } from '@common/dictionaryTemplate';

@Component({
    selector: 'app-display-dictionary-popup',
    templateUrl: './display-dictionary-popup.component.html',
    styleUrls: ['./display-dictionary-popup.component.scss'],
})
export class DisplayDictionaryPopupComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { dictionary: DictionaryTemplate }) {}
}
