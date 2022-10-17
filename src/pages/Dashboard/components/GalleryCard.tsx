import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardActionArea,
  CardContent,
  Typography,
  styled,
} from "@material-ui/core";
import { Image } from "antd";
import "antd/dist/antd.css";

interface GalleryCardProps {
  title: string;
  description: string;
  imageSrc: string;
  pageUrl: string;
}

const useStyles = makeStyles({
  root: {
    width: 200,
    height: 250,
  },
});

const GalleryCard: React.FC<GalleryCardProps> = ({
  title,
  description,
  imageSrc,
  pageUrl,
}) => {
  const classes = useStyles();
  const handleGoToPage = (url: string) => {
    const win = window.open(url, "_blank");
    win?.focus();
  };
  return (
    <Card className={classes.root}>
      <Header title={title} />
      <CardActionArea onClick={() => handleGoToPage(pageUrl)}>
        <Content>
          <Image
            src={imageSrc}
            width="100%"
            height="100px"
            preview={{
              mask: (
                <div
                  style={{
                    background: "#fff",
                    opacity: 0.5,
                    width: "100%",
                    color: "#000",
                    textAlign: "center",
                  }}
                >
                  View page
                </div>
              ),
              visible: false,
            }}
          />
          <Description variant="body2" color="textSecondary">
            {description}
          </Description>
        </Content>
      </CardActionArea>
    </Card>
  );
};
const Content = styled(CardContent)({
  padding: "20px",
});
const Header = styled(CardHeader)({
  height: "50px",
  "& .MuiTypography-h5": {
    fontSize: "1rem",
    textOverflow: "ellipsis",
  },
});
const Description = styled(Typography)({});
export default GalleryCard;
