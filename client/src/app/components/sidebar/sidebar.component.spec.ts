import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerInfoComponent } from '@app/components/player-info/player-info.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [SidebarComponent, PlayerInfoComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
