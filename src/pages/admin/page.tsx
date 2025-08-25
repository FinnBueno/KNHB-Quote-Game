import { FC } from "react";
import { GameSelection } from "src/organisms/game-selection";

export const AdminGameSelectionPage: FC<{}> = () => <GameSelection destination={uuid => `/admin/${uuid}`} />;
