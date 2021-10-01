import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { EaselComponent } from '@app/components/easel/easel.component';
import { PlayerService } from '@app/services/player.service';
import { GridService } from '@app/services/grid.service';
import { BoardService } from '@app/services/board.service';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let playerService: PlayerService;
    let board: BoardService;
    let grid: GridService;

    beforeEach(async () => {
        board = new BoardService();
        grid = new GridService(board);
        playerService = new PlayerService();
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent, EaselComponent],
            providers: [
                { provide: PlayerService, useValue: playerService },
                { provide: GridService, useValue: grid },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
