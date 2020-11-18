import shuffle from 'lodash/shuffle';
import take from 'lodash/take';

interface IGetNRandomNumbers {
    readonly n: number;
    readonly max: number;
}

export const getNRandomNumbers = ({ n, max }: IGetNRandomNumbers): number[] =>
    take(shuffle(new Array(max).fill(null).map((_, index) => index)), n);

// 1    => 001
// 12   => 012
// 123  => 123
// 1234 => 234
export const prependTwoZeros = (index: number | string): string => `00${index}`.slice(-3);
