import { IUserInfo } from "@/types/auth";
import { createSlice } from "@reduxjs/toolkit";


interface IUserInfoObject {
  userInfo : IUserInfo
}
const initialState : IUserInfoObject ={
  userInfo : {
    _id: "",
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
    wishlist:[],
  
    // posts: PostEntity[];
  
    // likedPosts: PostEntity[];
  
    // comments: CommentEntity[];
  
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
        _id: "",
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
        wishlist:[],
      
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