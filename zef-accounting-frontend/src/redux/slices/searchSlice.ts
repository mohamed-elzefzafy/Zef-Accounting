import { createSlice } from "@reduxjs/toolkit";

type SearchType = {searchKeyWord :string};

const initialState : SearchType ={
  searchKeyWord : ""
}
const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers : {
    createSearchKeywordAction : (state , action) =>{
      state.searchKeyWord = action.payload;
    },
    clearSearchKeywordAction : (state) =>{
      state.searchKeyWord = "";
    }

  },
})


export const {createSearchKeywordAction , clearSearchKeywordAction} = searchSlice.actions;
export default searchSlice.reducer;