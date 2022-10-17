import React, { useEffect } from "react";
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { Button, Popover as PPover } from "@material-ui/core";
import { makeStyles, withStyles, styled } from "@material-ui/core/styles";
import { useJwtInfo } from "../../hooks/JwtInfo";
// import Notifications from "../Notifications/Notifications";

export interface HeaderAvatarProps {
  data: any;
  fetchNotifications: any;
}

const HeaderAvatar: React.FC<HeaderAvatarProps> = ({
  data,
  fetchNotifications,
}) => {
  const classes = useStyles();
  const { username } = useJwtInfo();
  const initials = username.match(/\b\w/g) || [];
  const myinitials = (
    (initials.shift() || "") + (initials.pop() || "")
  ).toUpperCase();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isBadge, setBadge] = React.useState(false);
  // const accessToken = Cookies.get("accessToken");
  const [NewId, setNewId] = React.useState<String[]>([]);

  //logic for showing the badge
  useEffect(() => {
    data?.notifications?.forEach(function (notification: any) {
      if (notification.notificationType === "New") {
        setBadge(true);
      }
    });
  }, [data]);

  const LocalNotificationHandler = (data: any) => {
    data?.notifications?.forEach(function (notification: any) {
      if (notification.notificationType === "New") {
        if (!NewId.includes(notification.notificationId)) {
          var NewArr = NewId;
          NewArr.push(notification.notificationId);
          setNewId(NewArr);
        }
      }
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  };

  const handleOpenNotificationsPopover = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);

    //logic for storing the Notification ids in local storage
    if (data != null) {
      LocalNotificationHandler(data);
      localStorage.setItem("NewNotificationsId", JSON.stringify(NewId));
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const notification_triggered = {
    zIndex: 1000,
    backgroundColor: "white",
  };
  const avatar_theme = {
    backgroundColor: "#F94638",
    color: "#FFF",
  };

  const handleScroll = (e: any) => {
    if (window.scrollY !== 0) {
      setAnchorEl(null);
    }
  };

  return (
    <div className={classes.root}>
      <MenuButton
        disabled
        style={Boolean(anchorEl) ? notification_triggered : {}}
        onClick={handleOpenNotificationsPopover}
        className={Boolean(anchorEl) ? "hover-btn" : ""}
      >
        {isBadge ? (
          <StyledBadge
            overlap="circle"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            variant="dot"
          >
            <UserLoggedIn style={avatar_theme}>{myinitials}</UserLoggedIn>
          </StyledBadge>
        ) : (
          <UserLoggedIn style={avatar_theme}>{myinitials}</UserLoggedIn>
        )}
      </MenuButton>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
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
        {/* <Notifications
          data={data}
          fetchNotifications={fetchNotifications}
          handleClose={handleClose}
        /> */}
      </Popover>
    </div>
  );
};

const Popover = withStyles((theme) => ({
  paper: {
    overflow: "visible",
    borderBottomRightRadius: 0,
    backgroundColor: "white",
    marginTop: theme.spacing(1),
  },
}))(PPover);

const MenuButton = styled(Button)({
  position: "relative",
  top: "-2px",
  margin: "0 !important",
  minWidth: "50px !important",
});

const UserLoggedIn = styled(Avatar)({
  width: "2rem",
  height: "2rem",
  fontSize: "0.8rem",
  backgroundColor: "#444444",
  fontWeight: 500,
  position: "relative",
  top: "3px",
});

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#D52B1E",
    color: "#D52B1E",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    border: "1px solid #FFFFFF",
    top: "4px",
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default HeaderAvatar;
