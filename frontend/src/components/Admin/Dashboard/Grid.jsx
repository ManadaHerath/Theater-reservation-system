import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const generateColumns = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const keys = Object.keys(data[0]);

  return keys.map((key) => ({
    field: key,
    headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
    width: 150,
    sortable: true,
  }));
};

export default function Grid({ movies = [] }) {
  const columns = React.useMemo(() => {
    const cols = generateColumns(movies);
    return cols
      .filter((col) => col.field !== "id")
      .map((col) => {
        if (col.field === "added_date") {
          return {
            ...col,
            headerName: "Added Date",
            renderCell: (params) => {
              const date = new Date(params.value);
              return date.toLocaleDateString();
            },
          };
        }
        if (col.field === "released_date") {
          return {
            ...col,
            headerName: "Released Date",
            renderCell: (params) => {
              const date = new Date(params.value);
              return date.toLocaleDateString();
            },
          };
        }
        return col;
      });
  }, [movies]);

  // Ensure added_date is the first column
  const addedDateColumn = columns.find((col) => col.field === "added_date");
  if (addedDateColumn) {
    columns.splice(columns.indexOf(addedDateColumn), 1);
    columns.unshift(addedDateColumn);
  }

  return (
    <div
      style={{
        height: 520,
        width: "80%",
        justifyItems: "center",
        justifyContent: "center",
        margin: "auto",
      }}
    >
      <DataGrid
        rows={movies}
        columns={columns}
        pageSize={10} // Set initial page size to 10
        rowsPerPageOptions={[10, 20, 30]} // Include 10 as an option
        getRowId={(row) => row.id}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            color: "#e0e0e0",
            backgroundColor: "#2a2a2a",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#333",
            color: "black",
            borderBottom: "1px solid #444",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "white",
            color: "#fff",
            borderTop: "1px solid #444",
          },
          "& .MuiDataGrid-menuIcon": {
            color: "#fff",
          },
        }}
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
}
