import { Vec2 } from './vec2';

export const coordToKey = (coord: Vec2): string => {
    return `${coord.x}.${coord.y}`;
};

export const keyToCoord = (key: string): Vec2 => {
    const coords = key.split('.');
    return { x: parseInt(coords[0], 10), y: parseInt(coords[1], 10) };
};
