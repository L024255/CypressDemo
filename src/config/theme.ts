import { createMuiTheme } from "@material-ui/core";
// import { upperCase } from "lodash";

const { breakpoints } = createMuiTheme();

const theme = createMuiTheme({
  mixins: {
    toolbar: {
      minHeight: "50px",
      maxHeight: "175px",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          [breakpoints.down("xs")]: {
            fontSize: "85%",
          },
        },
        body: {
          color: "#000000",
          margin: "0",
          padding: "0",
          backgroundColor: "#fff",
          "-webkit-font-smoothing": "antialiased",
          "-moz-osx-font-smoothing": "grayscale",
          "-ms-overflow-style": "-ms-autohiding-scrollbar",
        },
        "a:focus-visible": {
          outline: "-webkit-focus-ring-color auto 1px !important",
        },
        mark: {
          backgroundColor: "rgb(255, 255, 0, 0.3)",
        },
      },
    },
    MuiRadio: {
      colorSecondary: {
        "&.Mui-checked": {
          color: "#D52B1E",
        },
      },
    },

    MuiButton: {
      root: {
        textTransform: "none",
        fontWeight: 400,
      },
      outlined: {
        "&&&": {
          borderWidth: 3,
          borderColor: "#D52B1E",
        },
      },
      containedPrimary: {
        backgroundColor: "#D52B1E",
        "&$disabled": {
          color: "#222222",
          backgroundColor: "#EEEEEE",
        },
      },
      containedSecondary: {
        backgroundColor: "#FFFFFF",
        color: "#D52B1E",
        "&&:hover": {
          backgroundColor: "#dddddd",
        },
      },
      sizeLarge: {
        padding: "2rem 0",
        borderRadius: "3rem",
        height: "63px",
        fontSize: "1.25rem",
      },
      sizeSmall: {
        textTransform: "inherit",
        borderRadius: "3px",
        "&&:hover": {
          borderRadius: "3px",
          backgroundColor: "rgba(0,0,0,0.03)",
        },
      },
      textSizeSmall: {
        fontWeight: 400,
        fontSize: "0.875rem",
        lineHeight: "1rem",
      },
    },
    MuiTab: {
      root: {
        "&.Mui-focusVisible": {
          backgroundColor: "#DEDEDE",
        },
      },
      textColorInherit: {
        opacity: 1,
        color: "#222222",
      },
    },
    MuiCheckbox: {
      root: {
        color: "#000000",
        "&& span": {
          height: ".5rem",
        },
        "&& svg": {
          height: "1.3rem",
          width: "1.3rem",
        },
        "&.Mui-checked": {
          color: "#222222",
        },
        "&.Mui-focusVisible": {
          backgroundColor: "#DEDEDE",
        },
      },
    },
    MuiTooltip: {
      tooltip: {
        maxWidth: "200px",
        borderRadius: "3px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        fontSize: "0.875rem",
      },
      arrow: {
        color: "rgba(0, 0, 0, 0.8)",
      },
    },
    MuiTableBody: {
      root: {
        borderBottom: "1px solid #dddddd",
      },
    },
    MuiTableRow: {
      root: {
        "&& td:not(:first-child)": {
          borderLeft: "1px solid #dddddd",
        },
      },
      head: {
        borderBottom: "1px solid #666666",
        "&& th:not(:first-child)": {
          borderLeft: "1px solid #dddddd",
        },
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: "none",
      },
    },
    MuiTableSortLabel: {
      root: {
        display: "flex",
        justifyContent: "space-between",
      },
      icon: {
        fontSize: "2rem",
      },
      active: {
        "& $icon": {
          opacity: 1,
        },
      },
    },

    MuiInputBase: {
      root: {
        backgroundColor: "#FFF",
      },
      input: {
        "&::placeholder": {
          textOverflow: "ellipsis !important",
          opacity: 1,
        },
      },
    },
    MuiOutlinedInput: {
      input: {
        padding: "12.5px 14px",
      },
      multiline: {
        padding: "12.5px 14px",
      },
    },
    MuiLink: {
      root: {
        "& a:-webkit-any-link:focus-visible": {
          outlineOffset: "1px",
        },
      },
    },
    MuiFormHelperText: {
      root: {
        "&.Mui-error": {
          color: "#D52B1E",
        },
      },
    },

    MuiBreadcrumbs: {
      separator: {
        marginLeft: "12px",
        marginRight: "12px",
        fontSize: "0.5rem",
      },
    },
  },
  palette: {
    primary: { main: "#D52B1E", light: "#FF6348", contrastText: "#FFFFFF" },
    secondary: { main: "#333333", light: "#999999", contrastText: "#000000" },
    background: {
      default: "#F9F9F9",
    },
    text: {
      primary: "#222222",
      secondary: "#666666",
    },
    common: {
      black: "#000000",
      white: "#FFFFFF",
    },
    grey: {
      50: "#f9f9f9",
      100: "#EEEEEE",
      200: "#DDDDDD",
      500: "#666666",
      700: "#222222",
      900: "#000000",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "Merriweather",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      "sans-serif",
    ].join(","),
    h1: { fontSize: "2.75rem" },
    h2: { fontSize: "2.125rem" },
    h3: { fontSize: "1.5rem" },
    h4: { fontSize: "1.375rem" },
    h5: { fontSize: "1.25rem" },
    h6: { fontSize: "1.125rem" },
    subtitle1: {
      fontSize: "0.875rem",
      textTransform: "uppercase",
      fontWeight: 500,
    },
    body1: { fontSize: "1rem", fontWeight: 400 },
    body2: { fontSize: "0.875rem", fontWeight: 400 },
  },
});

export default theme;
