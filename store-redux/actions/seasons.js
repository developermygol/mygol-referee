import axios from '../../axios';
import types from './actionTypes';

export const startLoadSeasons = () => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.get('/seasons');
      if (data) dispatch(setSeasons(data));

      // return error or swal
    } catch (err) {
      console.error(err);
      // 🚧💥 Error handler
    }
  };
};

export const setSeasons = seasons => ({
  type: types.seasonsLoad,
  payload: seasons,
});
