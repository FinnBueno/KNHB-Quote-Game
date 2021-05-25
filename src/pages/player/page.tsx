import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Flex, Heading, Text } from 'rebass';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { MButton } from 'src/atoms';
import { ParticipantBar } from 'src/molecules/participant-bar';
import { QuoteBox } from 'src/molecules/quote-box';
import { useAuth } from 'src/service/auth';
import { useFinished } from 'src/service/game/finished';
import { useParticipants } from 'src/service/game/participants';
import { useGame } from 'src/service/game/player-context';
import { PlayerHeader } from './header';
import { useScore } from 'src/service/game/scoreboard';

type Scoreboard = {[key: number]: string[]};

export const PlayerPage: React.FC<{}> = () => {
    const participants = useParticipants();
    const game = useGame();
    const auth = useAuth();
    const hasFinished = useFinished();
    const score = useScore();
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const quote = game?.quote;
    const votedFor = _.get(game?.quote?.votes, auth?.user?.id || '', undefined);

    /*
    calculate the place of this player, it's a little complicated...
    When 2 players have the same place, they should share a position in the ranking.
    However, there should be no gap between any players. When two people are in second place,
    the next player should be in third place, not fourth. This code handles that.
    */
    const map = participants
        // first sort the list of participants by their score
        ?.sort(
            (o1, o2) => o2.score - o1.score
        )
        // reduce function that turns this object into an object with numbers as keys
        // and string arrays as values (see Scoreboard type above)
        // the key represents the position, the string array holds the id of the
        // players at that position.
        .reduce(
            (total, current) => {
                // if the score of the current player isn't on the scoreboard yet, set an empty list to that position
                if (!total[current.score]) {
                    total[current.score] = [];
                }
                // add the id of the current player to the list of it's score
                total[current.score].push(current.id);
                // pass updated scoreboard to next reduce iteration
                return total;
            },
            // start with an empty scoreboard
            {} as Scoreboard
        ) || {};

    // get a list of all the positions in the right order
    // (could probably avoid the reverse call by changing the sort function, didn't feel like testing that)
    // the map is to convert from a string array to number array
    const keys = Object.keys(map).reverse().map(i => +i);
    // time to find the place of this particular player
    let place;
    // loop through all positions
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // get all players for this score
        const playersForScore: string[] = map[key];
        // check if this player is on this position
        if (playersForScore.find(id => id === auth?.user?.id)) {
            // if so, we save this place and break out of the loop
            place = i + 1;
            break;
        }
    }

    // show confetti when the answer is revealed and the player was right
    useEffect(() => {
        if (game?.quote?.showAnswer && votedFor === game.quote.answer) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
        }
    }, [game]);

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
        <Flex width='100%' flexDirection='column' alignItems='center' justifyContent='center' height='100%' minHeight='auto'>
            {showConfetti && <Confetti width={width} height={height} recycle={false} gravity={.35} />}
            {/* TODO: There's no subscription for a player's score, and thus it doesn't get updated, fix that */}
            <PlayerHeader place={place || Object.keys(map).length} score={score} pastFirstQuote={(game?.quote?.id || 0) > 0} />
            <Text variant='body' textAlign='center' mb={1}>Wie sprak de woorden...</Text>
            <QuoteBox width='100%' justifyContent='center' mb={3}>{quote.content}</QuoteBox>
            {participants ? participants.sort((a, b) => {
                if(a.id < b.id) { return -1; }
                if(a.id > b.id) { return 1; }
                return 0;
            }).map(participant => (
                <ParticipantBar
                    {...participant}
                    onClick={id => {
                        if (!game?.quote?.showAnswer) game?.vote(id, auth?.user?.id || '');
                    }}
                    disabled={participant.id === votedFor}
                    key={participant.id}
                />
            )) : (<></>)}
            <MButton variant='link' mt={3} mb={3} onClick={() => auth?.setParticipant(undefined)}>
                Ben jij niet {auth?.user?.name}? Druk dan hier
            </MButton>
        </Flex>
    );
}