import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function BasicPieChart({ data }) {
  return (
    <PieChart
      series={[
        {
          data: data,
          highlightScope: { fade: "global", highlight: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
        },
      ]}
      {...pieParams}
      sx={{
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        padding: "10px",
      }}
    />
  );
}

const pieParams = {
  width: 500,
  height: 300,
  slotProps: {
    legend: {
      hidden: true, 

    },
  },
};
