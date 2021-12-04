import { Component } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { ScoreConfig } from '@common/score-config';

@Component({
    selector: 'app-ranking-popup',
    templateUrl: './ranking-popup.component.html',
    styleUrls: ['./ranking-popup.component.scss'],
})
export class RankingPopupComponent {
    columnsToDisplay = ['name', 'score'];
    classicRanking: ScoreConfig[] = [];
    log2990Ranking: ScoreConfig[] = [];
    constructor(public communication: CommunicationService) {
        this.getClassicRanking();
        this.getLog2990Ranking();
    }

    getClassicRanking() {
        this.communication.getClassicRanking().subscribe((ranking) => {
            this.classicRanking = ranking;
        });
    }

    getLog2990Ranking() {
        this.communication.getLog2990Ranking().subscribe((ranking) => {
            this.log2990Ranking = ranking;
        });
    }
}
