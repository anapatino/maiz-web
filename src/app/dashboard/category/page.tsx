"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { visuallyHidden } from "@mui/utils";
import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/card/modal";
import FormCategory from "@/components/card/form_category";
import { CategoryService } from "@/data/controllers/category_controller";
import { Options } from "@/domain/options";
import { useRouter } from "next/navigation";

export interface Data {
  id: string;
  name: string;
  options: Options[];
  view: string;
}

function createData(
  id: string,
  name: string,
  options: Options[],
  view: string
): Data {
  return {
    id,
    name,
    options,
    view,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof Data>(
  order: Order,
  orderBy: Key
): (a: Data, b: Data) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "options",
    numeric: false,
    disablePadding: false,
    label: "Options",
  },
  {
    id: "view",
    numeric: false,
    disablePadding: false,
    label: "View",
  },
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/*<Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
              color: "white",
            }}
          />
        */}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <h4 className="text-white text-[17px]">{headCell.label}</h4>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden} color={"white"}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  refreshTable: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, refreshTable } = props;

  const [isCreateCateOpen, setIsCreateCateOpen] = useState(false);

  return (
    <Toolbar
      sx={{
        paddingTop: 5,
        paddingBottom: 1,
        paddingLeft: 4,
        marginLeft: 2,
        bgcolor: "#1E1E1E",
        borderRadius: "20px 20px 0px 0px",
        ...(numSelected > 0 && {
          bgcolor: "#1E1E1E",
          borderRadius: "20px 20px 0px 0px",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <h1 className="text-white text-3xl">Category</h1>
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <h1 className="text-white text-3xl">Category</h1>
        </Typography>
      )}
      <Tooltip title="New Category">
        <button
          onClick={() => setIsCreateCateOpen(true)}
          className="bg-[#DEA001] text-white py-2 px-4 rounded-xl whitespace-nowrap mr-8"
        >
          <h1>New category</h1>
        </button>
      </Tooltip>
      <FormCategory
        isOpen={isCreateCateOpen}
        onClose={() => setIsCreateCateOpen(false)}
        category={{
          id: "",
          name: "",
          options: [],
          view: "",
        }}
        isFormEdit={false}
        refreshTable={refreshTable}
      />
    </Toolbar>
  );
}
const hasUserEmail = () => {
  return localStorage.getItem("user_email") !== null;
};

export default function Category() {
  const router = useRouter();
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("options");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [rows, setRows] = useState<Data[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [messageError, setMessageError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Data>();
  const [isVisible, setIsVisible] = useState({
    success: false,
    error: false,
    warning: false,
  });
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected.map((id) => id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter((selectedId) => selectedId !== id);
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (id: string) => selected.includes(id);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(() => {
    if (rows.length === 0) {
      return rows;
    }
    return stableSort(rows, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [order, orderBy, page, rowsPerPage, rows]);

  const fetchCategories = async () => {
    try {
      const categories = await CategoryService.getAllCategories();
      const formattedCategories = categories.map((category: any) =>
        createData(category.id, category.name, category.options, category.image)
      );
      setRows(formattedCategories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const refreshTable = () => {
    fetchCategories();
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setIsVisible({ success: false, error: false, warning: true });
  };

  const deleteSelectedCategories = async () => {
    try {
      await CategoryService.deleteCategory(selectedId);

      setIsVisible({ success: true, error: false, warning: false });
      setSelectedId("");
      refreshTable();
    } catch (error: any) {
      setIsVisible({ success: false, error: true, warning: false });
      setMessageError(error.message);
    }
  };

  React.useEffect(() => {
    if (!hasUserEmail()) {
      router.push("/login");
    } else {
      fetchCategories();
    }
  }, []);

  return hasUserEmail() ? (
    <main className="flex min-h-screen w-full bg-black text-white p-5">
      <Box sx={{ width: "80%" }}>
        <Paper
          sx={{
            width: "100%",
            mb: 2,
            bgcolor: "#1E1E1E",
            borderRadius: "20px",
            color: "#ffffff",
          }}
        >
          <EnhancedTableToolbar
            numSelected={selected.length}
            refreshTable={refreshTable}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              bgcolor={"#1E1E1E"}
              className="text-white"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                      style={{ height: "40px" }}
                    >
                      <TableCell padding="checkbox">
                        {/*
                          <Checkbox
                          className="text-white"
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                         */}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        className="text-white text-[15px]"
                      >
                        <h4 className="text-white text-[15px]">{row.name}</h4>
                      </TableCell>
                      <TableCell
                        align="left"
                        className="text-white text-left text-[15px] "
                      >
                        <div className="flex flex-col justify-start items-start">
                          {row.options.map((option, index) => (
                            <h4 key={index} className="text-white text-[13px]">
                              {option.label}
                            </h4>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell align="left" className="text-white text-left">
                        <div className="h-[25px] w-[25px] relative overflow-hidden ">
                          <Image
                            src={row.view}
                            alt="Image"
                            fill
                            sizes="(max-width: 25px) 100vw, (max-width: 25px) 50vw, 33vw"
                          />
                        </div>
                      </TableCell>
                      <TableCell align="left" className="text-center">
                        <div className="flex w-[50px] justify-between items-center gap-4">
                          <button
                            onClick={() => {
                              setIsEdit(true);
                              setSelectedCategory(row);
                            }}
                          >
                            <ModeEditIcon htmlColor="white" fontSize="small" />
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteClick(row.id);
                            }}
                          >
                            <DeleteIcon
                              htmlColor="white"
                              fontSize="small"
                              className=" hover:text-danger"
                            />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell className="text-white" colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[4, 6, 8]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="text-white "
          />
        </Paper>
      </Box>
      {isVisible.success && (
        <Modal
          title="Category deleted successfully"
          message="Your category has been successfully deleted in the database."
          type="success"
          onClose={() => {
            setIsVisible({
              success: false,
              error: false,
              warning: false,
            });
            setSelectedId("");
            setMessageError("");
          }}
          onClick={() => {}}
        />
      )}
      {isVisible.error && (
        <Modal
          title="Error delete category"
          message={messageError}
          type="error"
          onClose={() => {
            setIsVisible({
              success: false,
              error: false,
              warning: false,
            });
            setMessageError("");
            setSelectedId("");
          }}
          onClick={() => {}}
        />
      )}
      {isVisible.warning && (
        <Modal
          title="Delete category"
          message="¿Are sure to delete this category?, you will not be able to see it again if you continue"
          type="delete"
          onClose={() => {
            setIsVisible({
              success: false,
              error: false,
              warning: false,
            });
            setMessageError("");
            setSelectedId("");
          }}
          onClick={deleteSelectedCategories}
        />
      )}
      <FormCategory
        isOpen={isEdit}
        onClose={() => {
          setIsEdit(false);
          setSelectedCategory({
            id: "",
            name: "",
            options: [],
            view: "",
          });
        }}
        category={
          selectedCategory != null
            ? selectedCategory
            : {
                id: "",
                name: "",
                options: [],
                view: "",
              }
        }
        isFormEdit={true}
        refreshTable={refreshTable}
      />
    </main>
  ) : (
    <main className="flex min-h-screen w-full bg-black text-white p-5"></main>
  );
}
