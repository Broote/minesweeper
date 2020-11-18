import shuffle from 'lodash/shuffle';
import take from 'lodash/take';

export const getNRandomNumbers = (max: number, n: number): number[] =>
    take(shuffle(new Array(max).fill(null).map((_, index) => index)), n);

export const getCoordinatesByIndex = (index: number, width: number): [number, number] => {
    const x = index % width;
    const y = Math.floor(index / width);
    return [x, y];
};

// 1    => 001
// 12   => 012
// 123  => 123
// 1234 => 234
export const prependTwoZeros = (index: number | string): string => `00${index}`.slice(-3);
