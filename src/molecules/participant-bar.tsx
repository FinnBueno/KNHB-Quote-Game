import React from 'react';
import { Flex, Heading, Image, Text } from 'rebass';
import { Participant } from 'src/service/game/participants';
import { theme } from 'src/service/theme/configuration';
import styled from 'styled-components';

const TriangleDecoratedFlex = styled(Flex)`
position: relative;
z-index: 1;
&:after {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 275px 50px 0;
    border-color: transparent ${theme.colors.primaryLighter} transparent transparent;
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
    border-width: 0 0 50px 150px;
    border-color: transparent transparent ${theme.colors.primaryLightest} transparent;
    border-radius: 3px 0 0 0;
    right: 0;
    bottom: 0;
    z-index: -2;
    position: absolute;
}
`;

export const ParticipantBar: React.FC<Participant & { onClick?: (_id: string) => void, disabled?: boolean, side?: () => React.ReactNode }> = ({
    onClick, disabled, name, id, picture, caption, side,
}) => (
    <TriangleDecoratedFlex
        variant={disabled ? 'cardDisabled' : 'cardClickable'}
        p={2}
        mb={2}
        width='100%'
        maxWidth='350px'
        onClick={() => {
            if (onClick && !disabled) onClick(id);
        }}
    >
        <Image src={picture} width='60px' />
        <Flex flexDirection='row' justifyContent='space-between' width='100%' alignItems='center'>
            <Flex flexDirection='column' ml={2} justifyContent='center'>
                <Heading variant='heading2'>{name}</Heading>
                <Text variant='caption'>{caption}</Text>
            </Flex>
            {side ? side() : <></>}
        </Flex>
    </TriangleDecoratedFlex>
)