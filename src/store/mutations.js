import * as types from './mutation-types';

const mutations = {
  [types.SET_USERINFO](state, userInfo) {
       state.userInfo = userInfo;
  },
  [types.TOKEN](state, token) {
      state.token = token;
  }
}

export default mutations;
