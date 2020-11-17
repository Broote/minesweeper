import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import sprite from '../../assets/sprite100.gif';

interface IProps {
    readonly digit: number;
}

const StyledCommonDigit = styled.div`
    background-image: url(${sprite});
    width: 13px;
    height: 23px;
`;

const StyledZero = styled(StyledCommonDigit)`
    background-position: 0 0;
`;

const StyledOne = styled(StyledCommonDigit)`
    background-position: -13px 0;
`;

const StyledTwo = styled(StyledCommonDigit)`
    background-position: -26px 0;
`;

const StyledThree = styled(StyledCommonDigit)`
    background-position: -39px 0;
`;

const StyledFour = styled(StyledCommonDigit)`
    background-position: -52px 0;
`;

const StyledFive = styled(StyledCommonDigit)`
    background-position: -65px 0;
`;

const StyledSix = styled(StyledCommonDigit)`
    background-position: -78px 0;
`;

const StyledSeven = styled(StyledCommonDigit)`
    background-position: -91px 0;
`;

const StyledEight = styled(StyledCommonDigit)`
    background-position: -104px 0;
`;

const StyledNine = styled(StyledCommonDigit)`
    background-position: -117px 0;
`;


const CounterDigit: FunctionComponent<IProps> = ({ digit }) => {
    return <>
    {digit === 0 && <StyledZero />}
    {digit === 1 && <StyledOne />}
    {digit === 2 && <StyledTwo />}
    {digit === 3 && <StyledThree />}
    {digit === 4 && <StyledFour />}
    {digit === 5 && <StyledFive />}
    {digit === 6 && <StyledSix />}
    {digit === 7 && <StyledSeven />}
    {digit === 8 && <StyledEight />}
    {digit === 9 && <StyledNine />}
    </>;
};

export default CounterDigit;
