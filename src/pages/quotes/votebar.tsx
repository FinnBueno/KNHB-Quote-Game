import React from 'react';
import { Flex, FlexProps, Image, Text } from 'rebass';
import { Participant } from 'src/service/game/participants';
import { theme } from 'src/service/theme/configuration';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';

const MAX_SIZE = 300;

function stuc<T>(El = Flex) {
    type PropType = T & { children?: JSX.Element[], className?: string }
    return (props: PropType) => <El className={props.className} {...props}>{props.children}</El>
}
  
const Container = stuc<{votes: number, maxVotes: number, children: any, revealAnswer: boolean } & FlexProps>()

const ProgressFlex = styled(Container)`
& > div {
    height: ${(props) => MAX_SIZE * (props.votes / props.maxVotes)}px;
    background-color: ${theme.colors.secondary};
    transition: height 0.5s;
}
& p {
    transform: translateY(${(props) => props.votes ? '0' : '30px'});
    transition: transform 0.5s;
}
& > .correct {
    width: 60px;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 8px;
    background-color: transparent;
    transition: transform 0.5s, opacity 0.5s;
    z-index: -1;
    transform: translateY(${(props) => props.revealAnswer ? 0 : '70px'});
    opacity: ${(props) => props.revealAnswer ? 1 : 0};
}
`;

export const VoteBar: React.FC<Participant & { revealAnswer: boolean, isCorrect: boolean, votes: number, max: number }> = ({ revealAnswer, isCorrect, votes, max, picture }) => (
    <ProgressFlex maxVotes={max} votes={votes} revealAnswer={revealAnswer} flexDirection='column'>
        {isCorrect ? <FaCheckCircle className='correct' color='#4A8734' size={50} /> : <></>}
        <Image width='70px' src={picture} />
        <Flex justifyContent='center' alignItems='flex-end'>
            <Text as='p' variant='heading3' color={theme.colors.background}>{votes}</Text>
        </Flex>
    </ProgressFlex>
)