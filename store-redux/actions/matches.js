import axios from '../../axios';
import types from './actionTypes';

export const startLoadMatch = matchId => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.get(`/matches/${matchId}`);
      if (data) dispatch(setActiveMatch(data));

      return data;
    } catch (err) {
      // Error control
    }
  };
};

export const updateMatchPlayerAttendance = payload => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.post(`/matches/setplayerattendance`, payload);

      dispatch(setMatchPlayerAttendance({ req: payload, matchData: data }));
      // toast.success(Localize('Player.AttendanceSetOk'));
    } catch (err) {
      // Error control
    }
  };
};

export const updateMatchApparelNumber = payload => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.post(`/matches/setplayermatchapparelnumber`, payload);

      dispatch(setMatchApparelNumber({ req: payload, matchData: data }));
      // toast.success(Localize('Player.AttendanceSetOk'));
    } catch (err) {
      // Error control
    }
  };
};

export const updateMatchPlayerCaptain = payload => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.put(`/matches/updatecaptain`, payload);
      if (data) dispatch(setMatchPlayerCaptain(payload));
      // if (payload.captain) toast.success('✔ Added team captain');
      // else toast.success('✔ Removed team captain');
    } catch (err) {
      // Error control
    }
  };
};

export const updateMatchPlayerTitular = payload => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.put(`/matches/updatetitular`, payload);
      if (data) dispatch(setMatchPlayerTitular(payload));
      // if (payload.captain) toast.success('✔ Added team titular');
      // else toast.success('✔ Removed team titular');
    } catch (err) {
      // Error control
    }
  };
};

export const setMatches = matches => ({
  type: types.matchesLoad,
  payload: matches,
});

export const setActiveMatch = match => ({
  type: types.matchActiveLoad,
  payload: match,
});

export const setMatchPlayerAttendance = data => ({
  type: types.matchSetTeamPlayerAttendance,
  payload: data,
});

export const setMatchApparelNumber = data => ({
  type: types.matchSetTeamPlayerApparelNumber,
  payload: data,
});

export const setMatchPlayerCaptain = data => ({
  type: types.matchSetTeamPlayerCaptain,
  payload: data,
});

export const setMatchPlayerTitular = data => ({
  type: types.matchSetTeamPlayerTitular,
  payload: data,
});
