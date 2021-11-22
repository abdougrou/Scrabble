import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { AbandonPageComponent } from './components/abandon-page/abandon-page.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { EaselComponent } from './components/easel/easel.component';
import { EndGamePopupComponent } from './components/end-game-popup/end-game-popup.component';
import { GameConfigPageComponent } from './components/game-config-page/game-config-page.component';
import { ModeSelectionComponent } from './components/mode-selection/mode-selection.component';
import { MultiGameConfigComponent } from './components/multi-game-config/multi-game-config.component';
import { MultiplayerJoinFormComponent } from './components/multiplayer-join-form/multiplayer-join-form.component';
import { MultiplayerRoomsComponent } from './components/multiplayer-rooms/multiplayer-rooms.component';
import { PlayerInfoComponent } from './components/player-info/player-info.component';
import { PlayerNamesPopupComponent } from './components/player-names-popup/player-names-popup.component';
import { RankingPopupComponent } from './components/ranking-popup/ranking-popup.component';
import { WaitingPopupComponent } from './components/waiting-popup/waiting-popup.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { MultiplayerGamePageComponent } from './pages/multiplayer-game-page/multiplayer-game-page.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        ModeSelectionComponent,
        GameConfigPageComponent,
        ChatBoxComponent,
        EaselComponent,
        PlayerInfoComponent,
        EndGamePopupComponent,
        AbandonPageComponent,
        MultiplayerRoomsComponent,
        MultiGameConfigComponent,
        WaitingPopupComponent,
        MultiplayerJoinFormComponent,
        MultiplayerGamePageComponent,
        RankingPopupComponent,
        AdminPageComponent,
        PlayerNamesPopupComponent,
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
