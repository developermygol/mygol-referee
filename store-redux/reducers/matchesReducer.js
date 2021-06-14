import types from '../actions/actionTypes';

const initalState = {
  matches: [],
  activeMatch: null,
};

const matchesReducer = (state = initalState, action) => {
  switch (action.type) {
    case types.matchesLoad:
      return { ...state, matches: action.payload };
    case types.matchActiveLoad:
      return { ...state, activeMatch: action.payload };
    case types.matchSetTeamPlayerAttendance:
      return {
        ...state,
        activeMatch: {
          ...state.activeMatch,
          homePlayers: state.activeMatch.homePlayers.map(player => {
            const {
              req: { idPlayer, idTeam },
              matchData,
            } = action.payload;
            if (player.id === idPlayer && idTeam === player.teamData.idTeam)
              return { ...player, matchData: matchData };
            return player;
          }),
          visitorPlayers: state.activeMatch.visitorPlayers.map(player => {
            const {
              req: { idPlayer, idTeam },
              matchData,
            } = action.payload;
            if (player.id === idPlayer && idTeam === player.teamData.idTeam)
              return { ...player, matchData: matchData };
            return player;
          }),
        },
      };
    case types.matchSetTeamPlayerApparelNumber:
      return {
        ...state,
        activeMatch: {
          ...state.activeMatch,
          homePlayers: state.activeMatch.homePlayers.map(player => {
            if (
              player.matchData &&
              player.matchData.idTeam === action.payload.idTeam &&
              player.matchData.idPlayer === action.payload.idPlayer
            )
              return {
                ...player,
                matchData: { ...player.matchData, apparelNumber: action.payload.apparelNumber },
              };
            return player;
          }),
          visitorPlayers: state.activeMatch.visitorPlayers.map(player => {
            if (
              player.matchData &&
              player.matchData.idTeam === action.payload.idTeam &&
              player.matchData.idPlayer === action.payload.idPlayer
            )
              return {
                ...player,
                matchData: { ...player.matchData, apparelNumber: action.payload.apparelNumber },
              };
            return player;
          }),
        },
      };
    case types.matchSetTeamPlayerCaptain:
      return {
        ...state,
        activeMatch: {
          ...state.activeMatch,
          homePlayers: state.activeMatch.homePlayers.map(player => {
            if (
              player.matchData &&
              player.matchData.idTeam === action.payload.idTeam &&
              player.matchData.idPlayer === action.payload.idPlayer
            )
              return { ...player, matchData: { ...player.matchData, captain: action.payload.captain } };
            return player;
          }),
          visitorPlayers: state.activeMatch.visitorPlayers.map(player => {
            if (
              player.matchData &&
              player.matchData.idTeam === action.payload.idTeam &&
              player.matchData.idPlayer === action.payload.idPlayer
            )
              return { ...player, matchData: { ...player.matchData, captain: action.payload.captain } };
            return player;
          }),
        },
      };
    case types.matchSetTeamPlayerTitular:
      return {
        ...state,
        activeMatch: {
          ...state.activeMatch,
          homePlayers: state.activeMatch.homePlayers.map(player => {
            if (
              player.matchData &&
              player.matchData.idTeam === action.payload.idTeam &&
              player.matchData.idPlayer === action.payload.idPlayer
            )
              return { ...player, matchData: { ...player.matchData, titular: action.payload.titular } };
            return player;
          }),
          visitorPlayers: state.activeMatch.visitorPlayers.map(player => {
            if (
              player.matchData &&
              player.matchData.idTeam === action.payload.idTeam &&
              player.matchData.idPlayer === action.payload.idPlayer
            )
              return { ...player, matchData: { ...player.matchData, titular: action.payload.titular } };
            return player;
          }),
        },
      };
    default:
      return state;
  }
};

export default matchesReducer;
