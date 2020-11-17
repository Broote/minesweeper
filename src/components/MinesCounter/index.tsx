import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { prependTwoZeros } from '../../utils';
import CounterDigit from '../CounterDigit';

interface IProps {
    readonly minesLeft: number;
}

const StyledContainer = styled.div`
    display: flex;
`;

const MinesCounter: FunctionComponent<IProps> = ({ minesLeft }) => {
    const digits: string[] = prependTwoZeros(minesLeft).split('');

    return (
        <StyledContainer>
            {digits.map((digit, i) => (
                <CounterDigit key={i} digit={Number(digit)} />
            ))}
        </StyledContainer>
    );
};

export default MinesCounter;
