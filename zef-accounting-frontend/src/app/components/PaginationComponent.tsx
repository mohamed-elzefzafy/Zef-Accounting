import { Pagination, Stack } from '@mui/material'
import { ChangeEvent } from 'react';

interface IProps {
  count : number,
  currentPage : number,
  handlePageChange : (e : ChangeEvent<unknown> , page : number)=> void,
}
const PaginationComponent = ({count , currentPage , handlePageChange} : IProps) => {
  return (
    <Stack spacing={2} my={4} py={4} justifyContent={"center"} direction={"row"}>
    <Pagination
      count={count}
      page={currentPage}
      onChange={handlePageChange}
      variant="outlined"
      shape="rounded"
    />
  </Stack>
  )
}

export default PaginationComponent;