import { FC } from "react";
import { GameSelection } from "src/organisms/game-selection";

export const QuotesGameSelectionPage: FC<{}> = () => <GameSelection destination={uuid => `/quotes/${uuid}`} />;
