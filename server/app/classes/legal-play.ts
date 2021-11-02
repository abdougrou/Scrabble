import { Anchor } from './anchor';
import { Vec2 } from './vec2';

export interface LegalPlay {
    anchor: Anchor;
    anchorIndex: number;
    word: string;
    start: Vec2;
    vertical: boolean;
    points: number;
}
