import { transpose } from './board-utils';

export class Anchor {
    x: number;
    y: number;
    leftPart: string;
    leftLength: number;
    across: boolean;

    /**
     * Finds all anchors in the board
     * An anchor is a null element adjacent to a non null element
     *
     * @returns array of anchors
     */
    static findAnchors(board: (string | null)[][]): Anchor[] {
        let anchors: Anchor[] = [];
        const transposed = transpose(board);
        for (let i = 0; i < board.length; i++) {
            anchors = anchors.concat(this.findAnchorsOneDimension(board[i], i, true));
            anchors = anchors.concat(this.findAnchorsOneDimension(transposed[i], i, false));
        }
        return anchors;
    }

    /**
     * Finds all anchors for a given array
     * An anchor is a null element adjacent to a non null element
     *
     * @param arr array of elements to find anchors in
     * @param rowNumber to use in anchor coordinate
     * @param across whether the anchor is for an across or down placement
     * @returns array of anchors
     */
    static findAnchorsOneDimension(arr: (string | null)[], rowNumber: number, across: boolean): Anchor[] {
        const anchors: Anchor[] = [];
        let leftPart = '';
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                leftPart += arr[i];
                continue;
            }
            if (arr[i - 1] || arr[i + 1]) {
                const lastElementIndex = -1;
                const lastAnchor = anchors.slice(lastElementIndex)[0];
                anchors.push({
                    x: across ? rowNumber : i,
                    y: across ? i : rowNumber,
                    leftPart,
                    leftLength: lastAnchor ? i - (across ? lastAnchor.y : lastAnchor.x) - 1 : i,
                    across,
                });
                leftPart = '';
            }
        }
        return anchors;
    }
}
