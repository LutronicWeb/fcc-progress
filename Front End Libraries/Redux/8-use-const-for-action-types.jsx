// change code below this line
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
// change code above this line

const defaultState = {
  authenticated: false
};

const authReducer = (state = defaultState, action) => {
  switch (action.type) {
    // change here
    // LOGON was 'LOGON'
    case LOGIN:
      return {
        authenticated: true
      }
    // change here
    // LOGOUT was 'LOGOUT'
    case LOGOUT:
      return {
        authenticated: false
      }

    default:
      return state;

  }

};

const store = Redux.createStore(authReducer);

const loginUser = () => {
  return {
    // change here
    // LOGON was 'LOGON'
    type: LOGIN
  }
};

const logoutUser = () => {
  return {
    // change here
    // LOGOUT was 'LOGOUT'
    type: LOGOUT
  }
};
