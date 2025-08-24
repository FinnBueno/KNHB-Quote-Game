import firebase from "firebase";

type QueryRef<T extends object> = (_: {
  gameId: string
} & T) => firebase.database.Reference;

type WithPlayer = { playerId: string }

const activeQuote: QueryRef<{}> = ({
  gameId
}) => getRef(`activeQuote/${gameId}`);

const currentQuoteVoteForPlayer: QueryRef<WithPlayer> = ({
  gameId, playerId
}) => getRef(`activeQuote/${gameId}/votes/${playerId}`);

const quoteById: QueryRef<{ quoteId: number }> = ({
  gameId, quoteId
}) => getRef(`quotes/${gameId}/${quoteId}`);

const isGameOver: QueryRef<{}> = ({
  gameId
}) => getRef(`gameState/${gameId}/isGameOver`);

const playerScore: QueryRef<WithPlayer> = ({
  gameId, playerId
}) => getRef(`participants/${gameId}/${playerId}/score`);

const participant: QueryRef<WithPlayer> = ({
  gameId, playerId
}) => getRef(`participants/${gameId}/${playerId}`);

const participants: QueryRef<{}> = ({
  gameId
}) => getRef(`participants/${gameId}`);

const allQuotes: QueryRef<{}> = ({
  gameId
}) => getRef(`quotes/${gameId}`);

const showAnswer: QueryRef<{}> = ({
  gameId
}) => getRef(`activeQuote/${gameId}/showAnswer`)

const currentVotes: QueryRef<{}> = ({
  gameId
}) => getRef(`activeQuote/${gameId}/votes`)

const getRef = (path: string) => firebase.database().ref(path);

export const QUERY_REFS = {
  activeQuote,
  currentQuoteVoteForPlayer,
  quoteById,
  isGameOver,
  playerScore,
  participant,
  allQuotes,
  showAnswer,
  currentVotes,
  participants
}