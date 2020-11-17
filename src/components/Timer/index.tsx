import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { GameStatusEnum } from '../../interfaces/state.interface';
import { prependTwoZeros } from '../../utils';

import CounterDigit from '../CounterDigit';

interface IProps {
    readonly gameStatus: GameStatusEnum;
    readonly gameStartedAt: number | null;
}

const StyledContainer = styled.div`
    display: flex;
`;

let intervalTimeoutId = 0;

const Timer: FunctionComponent<IProps> = ({ gameStatus, gameStartedAt }) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        clearInterval(intervalTimeoutId);
        if (gameStatus === GameStatusEnum.IN_PROGRESS && !!gameStartedAt) {
            intervalTimeoutId = setInterval(() => {
                const secondsPast = Math.floor((Date.now() - gameStartedAt) / 1000);
                setTime(secondsPast);
            }, 1000);
        }
        if (gameStatus === GameStatusEnum.NOT_STARTED) {
            setTime(0);
        }

        return () => {
            clearInterval(intervalTimeoutId)
        }
    }, [gameStatus, gameStartedAt]);

    const digits: string[] = prependTwoZeros(time).split('');

    return (
        <StyledContainer>
            {digits.map((digit, i) => (
                <CounterDigit key={i} digit={Number(digit)} />
            ))}
        </StyledContainer>
    );
};

export default Timer;
