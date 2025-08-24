import firebase from "firebase";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Flex, Heading, Text } from "rebass";
import { useFinished } from "src/service/game/finished";
import { useTotalQuotes } from "src/service/game/get-total-quotes";
import { Participant, useParticipants } from "src/service/game/participants";
import { usePlayerControls } from "src/service/game/player-context";
import { useVotes } from "src/service/game/votes-context";
import { VoteBar } from "./votebar";
import { PresentationTemplate } from "src/templates/PresentationTemplate";
import QRCode from "react-qr-code";
import { useLocation, useParams } from "react-router-dom";
import { QUERY_REFS } from "src/service/queries";
import { registerGameId } from "src/hooks/use-game-id";
import { useGameId } from "src/service/game/game-id-context";

export const QuotesPage: React.FC<{}> = () => {
  registerGameId();
  const { gameId } = useGameId();

  const participants = useParticipants();
  const votes = useVotes();
  const game = usePlayerControls();

  const [revealAnswer, setRevealAnswer] = useState(false);
  const hasFinished = useFinished();
  const totalQuotes = useTotalQuotes(gameId);
  const max = (participants?.length || 2) - 1;

  const highest = participants?.reduce(
    (prvs: Participant | undefined, crnt: Participant) => {
      if (!prvs) return crnt;
      if ((prvs.score || 0) < (crnt.score || 0)) {
        return crnt;
      } else {
        return prvs;
      }
    },
    undefined
  );

  const winners = [highest];

  participants?.forEach((p) => {
    if (p.score === highest?.score && highest?.id !== p.id) {
      winners.push(p);
    }
  });

  // listen when the answer should be shown
  useEffect(() => {
    if (!gameId) return;

    const revealAnswer = (snapshot: firebase.database.DataSnapshot) =>
      setRevealAnswer(!!snapshot.val());

    QUERY_REFS.showAnswer({ gameId }).on("value", revealAnswer);
    return () =>
      QUERY_REFS.showAnswer({ gameId })
        .off("value", revealAnswer);
  }, [gameId]);

  return (
    <PresentationTemplate>
      {hasFinished ? (
        <>
          <Heading variant="heading2" color="background" textAlign="center">
            {winners.length > 1 ? "De winnaars zijn..." : "De winnaar is..."}
          </Heading>
          <Heading
            variant="heading1"
            color="background"
            fontSize="64px"
            textAlign="center"
          >
            {winners.length > 1 ? (
              <>
                {_.slice(
                  winners.map((p) => p?.name),
                  0,
                  winners.length - 1
                ).join(", ")}{" "}
                en {winners[winners.length - 1]?.name}
              </>
            ) : (
              <>{highest?.name}</>
            )}
          </Heading>
        </>
      ) : (
        <></>
      )}
      {!hasFinished ? (
        game?.quote ? (
          <>
            <Heading
              variant="heading1"
              color="background"
              textAlign="center"
              style={{ position: "absolute", top: 24, left: 0, right: 0 }}
            >
              {game.quote.id + 1} / {totalQuotes}
            </Heading>
            <Heading
              variant="heading1"
              color="background"
              fontSize="64px"
              textAlign="center"
            >
              {game?.quote.content}
            </Heading>
            <Flex
              style={{
                alignItems: "flex-end",
                justifyContent: "center",
                position: "absolute",
                width: "100%",
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              {participants?.map((participant) => (
                <Flex mx={3} key={participant.id}>
                  <VoteBar
                    revealAnswer={revealAnswer}
                    isCorrect={
                      participant.id === game.quote?.answer.toLowerCase()
                    }
                    key={participant.id}
                    {...participant}
                    votes={votes[participant.id] || 0}
                    max={max}
                  />
                </Flex>
              ))}
            </Flex>
          </>
        ) : (
          <Flex justifyContent="center" flexDirection="column" alignItems="center">
            <Heading
              variant="heading1"
              fontSize="72px"
              textAlign="center"
              color="background"
            >
              Even rustig
            </Heading>
            <Text variant="heading3" color="background" textAlign="center">
              We gaan zo beginnen ☕
            </Text>
            <Text variant="heading3" color="background" textAlign="center" my={4}>
              Scan deze jongen om te joinen!
            </Text>
            <QRCode value={`${window.location.origin}/player/${gameId}`} />
          </Flex>
        )
      ) : null}
    </PresentationTemplate>
  );
};
