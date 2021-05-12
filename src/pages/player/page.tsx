import React from 'react';
import { Flex, Heading, Text } from 'rebass';
import { MButton } from 'src/atoms';
import { ParticipantBar } from 'src/molecules/participant-bar';
import { QuoteBox } from 'src/molecules/quote-box';
import { useAuth } from 'src/service/auth';
import { useFinished } from 'src/service/game/finished';
import { useParticipants } from 'src/service/game/participants';
import { useGame } from 'src/service/game/player-context';

export const PlayerPage: React.FC<{}> = () => {
    // TODO: Disable the button that was pressed
    const participants = useParticipants();
    const game = useGame();
    const auth = useAuth();
    const hasFinished = useFinished();
    const quote = game?.quote;

    // simulate a Map<number, string[]>
    // indexed for loop!!!
    const map = participants?.sort((o1, o2) => o2.score - o1.score).reduce((total, current) => {
        if (!total[current.score]) {
            total[current.score] = []
        }
        total[current.score].push(current.id);
        return total;
    }, ({} as {[key: number]: string[]}));

    const keys = Object.keys(map || {}).reverse();
    let place;
    for (let i = 0; i < keys.length; i++) {
        // How to convert from i to keys
        const key = keys[i];
        const playersForScore: string[] = (map as any)[key as any];
        if (playersForScore.find(id => id === auth?.user?.id)) {
            place = i + 1;
            break;
        }
    }

    if (hasFinished) {
        return (
            <Flex m={2} width='100%' flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
                <Heading variant='heading3' textAlign='center'>
                    Je bent op de
                </Heading>
                <Heading variant='heading1' textAlign='center'>
                    {place}e
                </Heading>
                <Heading variant='heading3' textAlign='center'>
                    plek gekomen met {participants?.find(p => p?.id === auth?.user?.id)?.score} punten
                </Heading>
                <MButton variant='link' mt={3} onClick={() => auth?.setParticipant(undefined)}>
                    Ben jij niet {auth?.user?.name}? Druk dan hier
                </MButton>
            </Flex>
        )
    }
    if (!quote) {
        return (
            <Flex m={2} width='100%' flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
                <Heading variant='heading1' textAlign='center'>
                    Even rustig
                </Heading>
                <Text variant='body'>
                    We gaan zo beginnen ☕
                </Text>
                <MButton variant='link' mt={3} onClick={() => auth?.setParticipant(undefined)}>
                    Ben jij niet {auth?.user?.name}? Druk dan hier
                </MButton>
            </Flex>
        )
    }
    return (
        <Flex m={2} width='100%' flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
            <Text variant='body' textAlign='center' mb={1}>Wie sprak de woorden...</Text>
            <QuoteBox mb={3}>{quote.content}</QuoteBox>
            {participants ? participants.map(participant => (
                <ParticipantBar
                    {...participant}
                    onClick={id => {
                        game?.vote(id, auth?.user?.id || '');
                    }}
                    // disabled={participant.id === votedFor}
                    key={participant.id}
                />
            )) : (<></>)}
            <MButton variant='link' mt={3} mb={2} onClick={() => auth?.setParticipant(undefined)}>
                Ben jij niet {auth?.user?.name}? Druk dan hier
            </MButton>
        </Flex>
    );
}