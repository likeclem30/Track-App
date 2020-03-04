import { AsyncStorage } from "react-native";
//import AsyncStorage from "@react-native-community/async-storage";
import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signup":
      return { errorMessage: "", token: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = dispatch => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("TrackList");
  } else {
    navigate("Signup");
  }
};
const clearErrorMessage = dispatch => () => {
  dispatch({ type: "clear_error_message" });
};
/*const signup = dispatch => {
  return async ({ email, password }) => {*/
// make api request to signup with email and password

//if we sign uo, modify our state, and say that we re authenticated

//if signing up fails, we probably need to reflect an error message

const signup = dispatch => async ({ email, password }) => {
  try {
    const response = await trackerApi.post("/signup", { email, password });
    //console.log(response.data);
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signup", payload: response.data.token });

    navigate("TrackList");
  } catch (err) {
    //console.log(err.response.data);
    dispatch({
      type: "add_error",
      payload: "Something whent wrong"
    });
  }
};
/*};*/

const signin = dispatch => async ({ email, password }) => {
  try {
    const response = await trackerApi.post("/signin", { email, password });
    //console.log(response.data);
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signup", payload: response.data.token });

    navigate("TrackList");
  } catch (err) {
    //console.log(err.response.data);
    dispatch({
      type: "add_error",
      payload: "Something whent wrong with signin"
    });
  }
};

const signout = dispatch => {
  return () => {
    //Signout from app
  };
};
export const { Provider, Context } = createDataContext(
  authReducer,
  { signup, signin, signout, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
