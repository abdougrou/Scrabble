import { Vec2 } from '@common/vec2';

export const BOARD_SIZE = 15;
export const RESERVE_EXCHANGE_LIMIT = 7;
export const EASEL_SIZE = 7;
export const CLASSIC_RESERVE = `a,9,1
b,2,3
c,2,3
d,3,2
e,15,1
f,2,4
g,2,2
h,2,4
i,8,1
j,1,8
k,1,10
l,5,1
m,3,2
n,6,1
o,6,1
p,2,3
q,1,8
r,6,1
s,6,1
t,6,1
u,6,1
v,2,4
w,1,10
x,1,10
y,1,10
z,1,10
*,2,0`;

export const TILE_TYPE = {
    noBonus: 0,
    letterX2: 1,
    letterX3: 2,
    wordX2: 3,
    wordX3: 4,
};

export const POINT_GRID: number[][] = [
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
    [0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
    [0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0],
    [1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1],
    [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    [4, 0, 0, 1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 4],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1],
    [0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0],
    [0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
];

export const GRID_SIZE = 15;

export const DEFAULT_SCOREBOARD = [
    { name: 'MafiaBoss', score: 1 },
    { name: 'Burberry', score: 3 },
    { name: 'abidine', score: 5 },
    { name: 'imacutiepie', score: 10 },
    { name: 'NoobMaster69', score: 12 },
];

export const DICTIONARY_DIRECTORY = 'assets/';
export const DEFAULT_DICTIONARY_FILE_NAME = 'dictionnary.json';
//  le pointage associe aux tiles
const F_POINTS = 4;
const J_POINTS = 8;
const K_POINTS = 10;
export const LETTER_POINTS: Map<string, number> = new Map<string, number>([
    ['a', 1],
    ['b', 3],
    ['c', 3],
    ['d', 2],
    ['e', 1],
    ['f', F_POINTS],
    ['g', 2],
    ['h', F_POINTS],
    ['i', 1],
    ['j', J_POINTS],
    ['k', K_POINTS],
    ['l', 1],
    ['m', 2],
    ['n', 1],
    ['o', 1],
    ['p', 3],
    ['q', J_POINTS],
    ['r', 1],
    ['s', 1],
    ['t', 1],
    ['u', 1],
    ['v', F_POINTS],
    ['w', K_POINTS],
    ['x', K_POINTS],
    ['y', K_POINTS],
    ['z', K_POINTS],
    ['*', 0],
]);
export const vecEqual = (coordA: Vec2, coordB: Vec2): boolean => {
    return coordA.x === coordB.x && coordA.y === coordB.y;
};
