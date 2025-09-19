import { IUserInfo } from "@/types/auth";
import { createSlice } from "@reduxjs/toolkit";


interface IUserInfoObject {
  userInfo : IUserInfo
}
const initialState : IUserInfoObject ={
  userInfo : {
    id: -1,
    firstName: "",
    lastName:"",
    email: "",
    profileImage: {
        url:  "",
        public_id:  "",
      },
    isAccountVerified:  false,
    verificationCode:  null,
    role: "user",
    createdAt:  "",
    updatedAt:  "",
},
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers : {
    setCredentials : (state , action) => {
      state.userInfo = action.payload;
    },
    logoutAction : (state ) => {
      state.userInfo = {   
        id: 0,
        firstName: "",
        lastName:"",
        email: "",
        profileImage: {
            url:  "",
            public_id:  "",
          },
        isAccountVerified:  false,
        verificationCode:  null,
        role: "user",
      
        // posts: PostEntity[];
      
        // likedPosts: PostEntity[];
      
        // comments: CommentEntity[];
      
        createdAt:  "",
        updatedAt:  "",
      };
    },
  }
})

export const {setCredentials , logoutAction} = authSlice.actions;
export default authSlice.reducer;