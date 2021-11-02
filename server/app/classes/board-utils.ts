import { Vec2 } from './vec2';

/**
 * Converts a Vec2 into a string key
 *
 * @param coord Vec2 coordinate
 * @returns coord string in the format 'x.y'
 */
export const coordToKey = (coord: Vec2): string => {
    return `${coord.x}.${coord.y}`;
};

/**
 * Converts a string key into a Vec2
 *
 * @param key coord string in the format 'x.y'
 * @returns Vec2 coordinate
 */
export const keyToCoord = (key: string): Vec2 => {
    const coords = key.split('.');
    return { x: parseInt(coords[0], 10), y: parseInt(coords[1], 10) };
};

/**
 * Generates all possible combinations of letters under the given length
 *
 * 'ab' => ['a', 'b', 'ab', 'ba']
 *
 * @param str string containing all characters to generate possible words from
 * @param length max length of possible words
 * @returns string array of possible words
 */
export const getStringCombinations = (str: string, length: number): string[] => {
    const output: string[] = [];

    if (str.length === 1) return [str];
    for (const k of str) {
        getStringCombinations(str.replace(k, ''), length)
            .concat('')
            .map((subtree) => {
                output.push(k.concat(subtree));
            });
    }

    return Array.from(new Set(output.filter((item) => item.length <= length)));
};

/**
 * @param arr 2d array to transpose
 * @returns a transposed copy of the current board state
 */
export const transpose = (arr: (string | null)[][]): (string | null)[][] => {
    return arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));
};

/**
 * Transposes the coordinate passed
 *
 * @param coord coord to transpose
 * @returns a transposed coord
 */
export const transposeCoord = (coord: Vec2): Vec2 => {
    return { x: coord.y, y: coord.x };
};
