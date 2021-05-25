import React from 'react';
import { Flex, Text } from 'rebass';
import { theme } from 'src/service/theme/configuration';
import styled from 'styled-components';

type PlayerHeaderProps = {
    place: number;
    score: number;
    pastFirstQuote: boolean;
}

const DecoratedFlex = styled(Flex)`
z-index: 1;
&:after {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 300px 60px 0;
    border-color: transparent ${theme.colors.primaryBrighter} transparent transparent;
    right: 0;
    top: 0;
    z-index: -1;
    position: absolute;
}
&:before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 60px 300px 0 0;
    border-color: ${theme.colors.primary} transparent transparent transparent;
    left: 0;
    top: 0;
    z-index: -2;
    position: absolute;
}
`;

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({ place, score }) => (
    <DecoratedFlex justifyContent='space-between' width='100%' p={2}>
        <Flex flexDirection='column' alignItems='center'>
            <Text variant='caption'>Plaats</Text>
            <Text variant='title'>{place}e</Text>
        </Flex>
        <Flex flexDirection='column' alignItems='center'>
            <Text variant='caption'>Punten</Text>
            <Text variant='title'>{score}</Text>
        </Flex>
    </DecoratedFlex>
)