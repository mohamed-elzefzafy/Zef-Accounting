"use client";
import { Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

const SearchInstructorDash = () => {
  const searchPram = useSearchParams();
  const router = useRouter();
  const searchParamQuery = searchPram.get("fromInstructorDashBoard");
  const searchParamQuery2 = searchPram.get("fromLecturesInstructorDashBoard");
  const searchParamQuery3 = searchPram.get("fromAdminDashBoardReviews");
  return (
    <>
      {searchParamQuery === "fromInstructorDashBoard" && (
        <Button
          sx={{ textAlign: "center", textTransform: "capitalize" }}
          onClick={() => router.push("/instructor-dashboard/courses")}
        >
          back to Instructor Dashboard
        </Button>
      )}

      {searchParamQuery2 === "fromLecturesInstructorDashBoard" && (
        <Button
          sx={{ textAlign: "center", textTransform: "capitalize" }}
          onClick={() => router.push("/instructor-dashboard/lectures")}
        >
          back to Instructor Dashboard
        </Button>
      )}

          {searchParamQuery3 === "fromAdminDashBoardReviews" && (
        <Button
          sx={{ textAlign: "center", textTransform: "capitalize" }}
          onClick={() => router.push("/admin-dashboard/reviews")}
        >
          back to Instructor Dashboard
        </Button>
      )}

      
    </>
  );
};

export default SearchInstructorDash;
