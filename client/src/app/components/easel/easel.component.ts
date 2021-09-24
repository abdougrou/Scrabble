import { Component } from '@angular/core';
import { Tile } from '@app/classes/tile';

@Component({
    selector: 'app-easel',
    templateUrl: './easel.component.html',
    styleUrls: ['./easel.component.scss'],
})
export class EaselComponent {
    tiles: Tile[] = [
        { letter: 'A', points: 10 },
        { letter: 'A', points: 10 },
        { letter: 'A', points: 10 },
        { letter: 'A', points: 10 },
        { letter: 'A', points: 10 },
        { letter: 'A', points: 10 },
        { letter: 'A', points: 10 },
    ];
}
