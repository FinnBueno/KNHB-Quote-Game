import firebase from 'firebase';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Flex, Heading, Text } from 'rebass';
import { useFinished } from 'src/service/game/finished';
import { Participant, useParticipants } from 'src/service/game/participants';
import { useGame } from 'src/service/game/player-context';
import { useVotes } from 'src/service/game/votes-conext';
import { theme } from 'src/service/theme/configuration';
import styled from 'styled-components';
import { VoteBar } from './votebar';

const DecoratedFlex = styled(Flex)`
z-index: 1;
&:after {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 1100px 400px 0;
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
    border-width: 0 0 600px 1600px;
    border-color: transparent transparent ${theme.colors.primaryLightest} transparent;
    right: 0;
    bottom: 0;
    z-index: -2;
    position: absolute;
}
& span {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 1200px 700px 0 0;
    border-color: ${theme.colors.primaryBrighter} transparent transparent transparent;
    top: 0;
    left: 0;
    z-index: -3;
    position: absolute;
}
overflow: hidden;
`;

export const TOTAL_QUOTES = 161;

export const QuotesPage: React.FC<{}> = () => {
    const participants = useParticipants();
    const votes = useVotes();
    const game = useGame();
    const [revealAnswer, setRevealAnswer] = useState(false);
    const hasFinished = useFinished();
    const max = (participants?.length || 2) - 1;

    const highest = participants?.reduce((prvs: Participant | undefined, crnt: Participant) => {
        if (!prvs) return crnt;
        if ((prvs.score || 0) < (crnt.score || 0)) {
            return crnt;
        } else {
            return prvs;
        }
    }, undefined);
    const winners = [highest];
    participants?.forEach(p => {
        if (p.score === highest?.score && highest?.id !== p.id) {
            winners.push(p);
        }
    });

    // listen when the answer should be shown
    useEffect(() => {
        const revealAnswer = (snapshot: firebase.database.DataSnapshot) => setRevealAnswer(!!snapshot.val());

        firebase.database().ref('activeQuote/showAnswer').on('value', revealAnswer);
        return () => firebase.database().ref('activeQuote/showAnswer').off('value', revealAnswer);
    }, []);

    return (
        <DecoratedFlex variant='center' bg='primary' flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
            <span></span>
            <Flex variant='container' flexDirection='column' justifyContent='center' height='auto' minHeight='100%'>
                {hasFinished ? (
                    <>
                        <Heading variant='heading2' color='background' textAlign='center'>
                            {winners.length > 1 ? 'De winnaars zijn...' : 'De winnaar is...'}
                        </Heading>
                        <Heading variant='heading1' color='background' fontSize='64px' textAlign='center'>
                            {winners.length > 1 ? (
                                <>{_.slice(winners.map(p=>p?.name), 0, winners.length-1).join(', ')} en {winners[winners.length-1]?.name}</>
                            ) : (
                                <>{highest?.name}</>
                            )}
                        </Heading>
                    </>
                ) : (<></>)}
                {!hasFinished ? (game?.quote ? (
                    <>
                        <Heading variant='heading1' color='background' textAlign='center' style={{ position: 'absolute', top: 24, left: 0, right: 0 }}>
                            {game.quote.id + 1} / {TOTAL_QUOTES}
                        </Heading>
                        <Heading variant='heading1' color='background' fontSize='64px' textAlign='center'>
                            {game?.quote.content}
                        </Heading>
                        <Flex style={{
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            position: 'absolute',
                            width: '100%',
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}>
                            {participants?.map(participant => (
                                <Flex mx={3}>
                                    <VoteBar revealAnswer={revealAnswer} isCorrect={participant.id === game.quote?.answer.toLowerCase()} key={participant.id} {...participant} votes={votes[participant.id] || 0} max={max} />
                                </Flex>
                            ))}
                        </Flex>
                    </>
                ) : (
                    <Flex justifyContent='center' flexDirection='column'>
                        <Heading variant='heading1' fontSize='72px' textAlign='center' color='background'>
                            Even rustig
                        </Heading>
                        <Text variant='heading3' color='background' textAlign='center'>
                            We gaan zo beginnen ☕
                        </Text>
                    </Flex>
                )) : null}
            </Flex>
        </DecoratedFlex>
    )
}