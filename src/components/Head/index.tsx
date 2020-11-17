import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import sprite from '../../assets/sprite100.gif';
import { GameStatusEnum } from '../../interfaces/state.interface';

interface IProps {
    readonly gameStatus: GameStatusEnum;
    readonly isMoveInProgress: boolean;
    readonly isHeadPressed: boolean;
}

const StyledCommonHead = styled.div`
    background-image: url(${sprite});
    width: 26px;
    height: 26px;
`;

const StyledHead = styled(StyledCommonHead)`
    background-position: 0 -55px;
`;

const StyledPressedHead = styled(StyledCommonHead)`
    background-position: -26px -55px;
`;

const StyledOohHead = styled(StyledCommonHead)`
    background-position: -52px -55px;
`;

const StyledLostHead = styled(StyledCommonHead)`
    background-position: -78px -55px;
`;

const StyledWonHead = styled(StyledCommonHead)`
    background-position: -104px -55px;
`;

const Head: FunctionComponent<IProps> = ({ gameStatus, isMoveInProgress, isHeadPressed }) => {
    const isLose = gameStatus === GameStatusEnum.LOSE;
    const isWin = gameStatus === GameStatusEnum.WIN;

    if (isHeadPressed) {
        return <StyledPressedHead />;
    }

    return (
        <>
            {!isLose && !isWin && !isMoveInProgress && <StyledHead />}
            {!isLose && !isWin && isMoveInProgress && <StyledOohHead />}
            {isLose && <StyledLostHead />}
            {isWin && <StyledWonHead />}
        </>
    );
};

export default Head;
