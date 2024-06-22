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
import { visuallyHidden } from "@mui/utils";
import { useState } from "react";
import Modal from "@/components/card/modal";
import { ProductController } from "@/data/controllers/product_controller";
import FormProduct from "@/components/card/form_product";
import DetailsProduct from "@/components/card/details_product";
import { ProductResponse } from "@/domain/product";
import { Options } from "@/domain/options";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  options: Options[];
  idCategory: string;
  labelCategory: string;
  available: boolean;
}

export interface Data {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  options: Options[];
  idCategory: string;
  labelCategory: string;
  available: boolean;
}

function createData(
  id: string,
  name: string,
  description: string,
  price: string,
  image: string,
  options: Options[],
  idCategory: string,
  labelCategory: string,
  available: boolean
): Product {
  return {
    id,
    name,
    description,
    price,
    image,
    options,
    idCategory,
    labelCategory,
    available,
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
    id: "price",
    numeric: false,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "labelCategory",
    numeric: false,
    disablePadding: false,
    label: "Category",
  },
  {
    id: "available",
    numeric: false,
    disablePadding: false,
    label: "Available",
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
          {/** 
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
              color: "white",
            }}
          />*/}
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
          <h1 className="text-white text-3xl">Product</h1>
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <h1 className="text-white text-3xl">Product</h1>
        </Typography>
      )}
      <Tooltip title="New Product">
        <button
          onClick={() => setIsCreateCateOpen(true)}
          className="bg-[#DEA001] text-white py-2 px-4 rounded-xl whitespace-nowrap mr-8"
        >
          <h1>New Product</h1>
        </button>
      </Tooltip>
      <FormProduct
        isOpen={isCreateCateOpen}
        onClose={() => setIsCreateCateOpen(false)}
        product={{
          id: "",
          name: "",
          description: "",
          price: "",
          image: "",
          idCategory: "",
          labelCategory: "",
          available: true,
        }}
        isFormEdit={false}
        refreshTable={refreshTable}
      />
    </Toolbar>
  );
}

export default function Product() {
  const router = useRouter();
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Product>("name");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [rows, setRows] = useState<Product[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [view, setView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse>();
  const [isVisible, setIsVisible] = useState({
    success: false,
    error: false,
    warning: false,
  });
  const [isClient, setIsClient] = useState(false);

  const [selectedId, setSelectedId] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Product
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

  const fetchProducts = async () => {
    try {
      const products = await ProductController.getAllProducts();
      const formattedProducts = products.map((product: any) =>
        createData(
          product.id,
          product.name,
          product.description,
          product.price,
          product.image,
          product.options,
          product.idCategory,
          product.labelCategory,
          product.available
        )
      );
      setRows(formattedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const refreshTable = () => {
    fetchProducts();
  };

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setIsVisible({ success: false, error: false, warning: true });
  };

  const deleteSelected = async () => {
    try {
      await ProductController.deleteProduct(selectedId);

      setIsVisible({ success: true, error: false, warning: false });
      setSelectedId("");
      refreshTable();
    } catch (error: any) {
      setIsVisible({ success: false, error: true, warning: false });
      setMessageError(error.message);
    }
  };

  React.useEffect(() => {
    setIsClient(true);
    const hasUserEmail = () => {
      return localStorage.getItem("user_email") !== null;
    };

    if (!hasUserEmail()) {
      router.push("/login");
    } else {
      fetchProducts();
    }
  }, [router]);

  if (!isClient) {
    return (
      <main className="flex min-h-screen w-full bg-black text-white"></main>
    );
  }

  return (
    <main className="flex min-h-screen w-full bg-black text-white p-5">
      {isClient && localStorage.getItem("user_email") !== null && (
        <>
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
                        />*/}
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            className="text-white text-[15px]"
                          >
                            <h4 className="text-white text-[15px]">
                              {row.name}
                            </h4>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            className="text-white text-[15px]"
                          >
                            <h4 className="text-white text-[15px]">
                              {row.price}
                            </h4>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            className="text-white text-[15px]"
                          >
                            <h4 className="text-white text-[15px]">
                              {row.labelCategory}
                            </h4>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            align="left"
                            className="text-white text-[15px]"
                          >
                            <h4 className="pl-8 text-white text-[15px]">
                              {row.available === true ? "Yes" : "No"}
                            </h4>
                          </TableCell>
                          <TableCell
                            component="th"
                            align="left"
                            scope="row"
                            padding="none"
                            className=""
                          >
                            <div className="flex w-[90px] justify-between items-center gap-2">
                              <button
                                onClick={() => {
                                  setView(true);
                                  setSelectedProduct(row);
                                }}
                              >
                                <i
                                  className="bi bi-eye  text-white"
                                  style={{ fontSize: "20px" }}
                                ></i>
                              </button>
                              <button
                                onClick={() => {
                                  setIsEdit(true);
                                  setSelectedProduct(row);
                                }}
                              >
                                <ModeEditIcon
                                  htmlColor="white"
                                  fontSize="small"
                                />
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
                          color: "#ffffff",
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
              title="Product deleted successfully"
              message="Your product has been successfully deleted in the database."
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
              title="Error delete product"
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
              title="Delete product"
              message="¿Are sure to delete this product?, you will not be able to see it again if you continue"
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
              onClick={deleteSelected}
            />
          )}
          <FormProduct
            isOpen={isEdit}
            onClose={() => {
              setIsEdit(false);
              setSelectedProduct({
                id: "",
                name: "",
                description: "",
                price: "",
                image: "",
                options: [],
                idCategory: "",
                labelCategory: "",
                available: true,
              });
            }}
            product={
              selectedProduct != null
                ? selectedProduct
                : {
                    id: "",
                    name: "",
                    description: "",
                    price: "",
                    image: "",
                    options: [],
                    idCategory: "",
                    labelCategory: "",
                    available: true,
                  }
            }
            isFormEdit={true}
            refreshTable={refreshTable}
          />
          <DetailsProduct
            isOpen={view}
            onClose={() => {
              setView(false);
              setSelectedProduct({
                id: "",
                name: "",
                description: "",
                price: "",
                image: "",
                options: [],
                idCategory: "",
                labelCategory: "",
                available: true,
              });
            }}
            product={
              selectedProduct != null
                ? selectedProduct
                : {
                    id: "",
                    name: "",
                    description: "",
                    price: "",
                    image: "",
                    options: [],
                    idCategory: "",
                    labelCategory: "",
                    available: true,
                  }
            }
          />
        </>
      )}
    </main>
  );
}
