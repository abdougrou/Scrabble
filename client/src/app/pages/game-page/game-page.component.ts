import { Component } from '@angular/core';
import { KEYBOARD_EVENT_RECEIVER, MouseButton } from '@app/constants';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    keyboardReceiver = KEYBOARD_EVENT_RECEIVER.chatbox;

    // clickInsideCounter is reset to 0 whenever we click inside a keyboardreceiver, then it's set back to 1 in the gamepage
    // because it gets the mouseEvent after the child component
    // if the value gets to 2 or more, it means that we didnt click inside a keyboardreceiver
    clickInsideCounter = 1;

    mouseClick(event: MouseEvent) {
        if (event.button === MouseButton.Left || event.button === MouseButton.Right) {
            this.clickInsideCounter++;
        }
        if (this.clickInsideCounter > 1) {
            this.keyboardReceiver = KEYBOARD_EVENT_RECEIVER.none;
        }
        // window.alert(this.keyboardReceiver + ' et : ' + this.clickInsideCounter);
    }

    clickedInside(isInside: boolean) {
        if (isInside) this.clickInsideCounter = 0;
    }

    changeKeyboardReceiver(newKeyboardReceiver: string) {
        this.keyboardReceiver = newKeyboardReceiver;
    }
}
