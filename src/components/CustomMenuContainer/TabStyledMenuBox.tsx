import React from "react";
import { styled, withStyles, Popover as MuiPopover } from "@material-ui/core";

interface TabStyledMenuBoxProps {
  children?: React.ReactNode;
  anchorEl?: HTMLElement | null;
  onClose: Function;
}
const TabStyledMenuBox: React.FC<TabStyledMenuBoxProps> = ({
  children,
  anchorEl,
  onClose,
}) => {
  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => {
        onClose();
      }}
      disableScrollLock={true}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <div>
        <HoverBox>
          <WhiteBox />
        </HoverBox>
        <MaskBox />
        <ContentContainer>{children}</ContentContainer>
      </div>
    </Popover>
  );
};
const ContentContainer = styled("div")({
  padding: "10px 0",
});
const Popover = withStyles((theme) => ({
  paper: {
    overflow: "visible",
    borderBottomRightRadius: 0,
    backgroundColor: "white",
  },
}))(MuiPopover);
const HoverBox = styled("div")({
  zIndex: 1,
  position: "absolute",
  top: "-50px",
  width: "50px",
  height: "50px",
  bckgroundColor: "rgba(255, 255, 255, 0.4)",
  right: "0",
  borderBottom: 0,
  borderRadius: "4px",
  borderBottomRightRadius: "0",
  boxShadow:
    "0px 1px 2px 0px rgb(0 0 0 / 20%), 4px 4px 6px 1px rgb(0 0 0 / 0%), 0px 3px 4px 1px rgb(0 0 0 / 12%)",
});

const WhiteBox = styled("div")({
  zIndex: 1,
  position: "absolute",
  width: "100%",
  height: "20px",
  top: "38px",
  left: 0,
  right: 0,
  backgroundColor: "#fff",
});
const MaskBox = styled("div")({
  zIndex: 1,
  position: "absolute",
  width: "93px",
  height: "5px",
  top: 0,
  right: 0,
  backgroundColor: "#fff",
});
export default TabStyledMenuBox;
