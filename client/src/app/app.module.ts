import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AbandonPageComponent } from '@app/components/abandon-page/abandon-page.component';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { EaselComponent } from '@app/components/easel/easel.component';
import { EndGamePopupComponent } from '@app/components/end-game-popup/end-game-popup.component';
import { GameConfigPageComponent } from '@app/components/game-config-page/game-config-page.component';
import { ModeSelectionComponent } from '@app/components/mode-selection/mode-selection.component';
import { MultiGameConfigComponent } from '@app/components/multi-game-config/multi-game-config.component';
import { MultiplayerJoinFormComponent } from '@app/components/multiplayer-join-form/multiplayer-join-form.component';
import { MultiplayerRoomsComponent } from '@app/components/multiplayer-rooms/multiplayer-rooms.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { PlayerInfoComponent } from '@app/components/player-info/player-info.component';
import { PlayerNameOptionsComponent } from '@app/components/player-name-options/player-name-options.component';
import { PlayerNamesPopupComponent } from '@app/components/player-names-popup/player-names-popup.component';
import { RankingPopupComponent } from '@app/components/ranking-popup/ranking-popup.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { WaitingPopupComponent } from '@app/components/waiting-popup/waiting-popup.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { MultiplayerGamePageComponent } from '@app/pages/multiplayer-game-page/multiplayer-game-page.component';

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
        PlayerNameOptionsComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatPaginatorModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
