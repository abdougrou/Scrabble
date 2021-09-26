import { Component, Input } from '@angular/core';
import { Tile } from '@app/classes/tile';

@Component({
    selector: 'app-easel',
    templateUrl: './easel.component.html',
    styleUrls: ['./easel.component.scss'],
})
export class EaselComponent {
    @Input() tiles: Tile[] = [];
}
