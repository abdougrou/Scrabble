import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Easel } from '@app/classes/easel';
import { Player } from '@app/classes/player';
import { EaselComponent } from '@app/components/easel/easel.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@app/constants';
import { BoardService } from '@app/services/board.service';
import { GridService } from '@app/services/grid.service';
import { PlayerService } from '@app/services/player.service';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let playerService: PlayerService;
    let board: BoardService;
    let grid: GridService;
    let player: Player;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        board = new BoardService();
        grid = new GridService(board);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        grid.gridContext = ctxStub;
        playerService = new PlayerService();
        player = { name: 'player', score: 0, easel: new Easel() };
        playerService.players.push(player);
        playerService.mainPlayer = player;
    });
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
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
