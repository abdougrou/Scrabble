// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormBuilder } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { RouterTestingModule } from '@angular/router/testing';
// import { AppMaterialModule } from '@app/modules/material.module';
// import { GameMode } from '@common/lobby-config';
// import { MultiplayerRoomsComponent } from './multiplayer-rooms.component';

// describe('MultiplayerRoomsComponent', () => {
//     let component: MultiplayerRoomsComponent;
//     let fixture: ComponentFixture<MultiplayerRoomsComponent>;

//     const dialogMock = {
//         close: () => {
//             // Do nothing
//         },
//     };

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             imports: [HttpClientTestingModule, BrowserAnimationsModule, AppMaterialModule, RouterTestingModule],
//             declarations: [MultiplayerRoomsComponent],
//             providers: [
//                 { provide: MatDialogRef, useValue: dialogMock },
//                 { provide: MAT_DIALOG_DATA, useValue: {} },
//                 { provide: MAT_DIALOG_DATA, useValue: { mode: GameMode.Classic } },
//                 FormBuilder,
//             ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(MultiplayerRoomsComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('create lobby should open form popup', async () => {
//         const spy = spyOn(component, 'openFormPopup').and.callThrough();
//         component.createLobby();
//         fixture.detectChanges();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('should refresh lobbies list after creating lobby', () => {
//         const spy = spyOn(component, 'getLobbies').and.callThrough();
//         component.createLobby();
//         fixture.detectChanges();
//         expect(spy).toBeTruthy();
//     });

//     it('should open form popup', () => {
//         const spy = spyOn(component.dialog, 'open').and.callThrough();
//         component.openFormPopup();
//         fixture.detectChanges();
//         expect(spy).toBeTruthy();
//     });

//     it('should refreh lobbies', () => {
//         const spy = spyOn(component.communication, 'getLobbies').and.callThrough();
//         component.getLobbies();
//         fixture.detectChanges();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('should join random lobby', () => {
//         const spyJoin = spyOn(component, 'joinLobby').and.callThrough();
//         component.joinRandomLobby();
//         fixture.detectChanges();
//         expect(spyJoin).toHaveBeenCalled();
//     });

//     it('should open join form popup', () => {
//         const spyJoin = spyOn(component.dialog, 'open').and.callThrough();
//         const key = 'key';
//         component.openJoinPopup(key);
//         fixture.detectChanges();
//         expect(spyJoin).toHaveBeenCalled();
//     });
// });
