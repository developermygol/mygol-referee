import axios from '../../axios';
import types from './actionTypes';

export const startLoadOrganization = () => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.get('/organization');
      if (data) dispatch(setActiveOrganization(data));

      // return error or swal
    } catch (err) {
      console.error(err);
      // 🚧💥 Error handler toast
    }
  };
};

export const setOrganizations = organizations => ({
  type: types.organizationsLoad,
  payload: organizations,
});

export const setActiveOrganization = organization => ({
  type: types.organizationActiveLoad,
  payload: organization,
});
