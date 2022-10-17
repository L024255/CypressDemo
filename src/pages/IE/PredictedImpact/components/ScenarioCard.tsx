import { Grid, styled } from "@material-ui/core";
import React, { FC } from "react";
import CircleProgressBar from "../../../../components/CustomCircleProgressBar";
import { InfoOutlined } from "@material-ui/icons";
import { Popover } from "antd";
import "antd/dist/antd.css";
export interface HeroProps {
  title: string;
  avatar: React.ReactNode;
  optionName: string;
  optionValue: number;
  historicalOptionValue?: number;
  optionDescription: string;
  style?: any;
  tooltips?: string;
  contentTitle: any;
  contentBody: any;
  colors?: string[];
}

const ScenarioCard: FC<HeroProps> = ({
  title = "Scenario Score",
  avatar,
  optionName,
  optionValue,
  optionDescription,
  style,
  tooltips,
  contentTitle,
  contentBody,
  colors,
  historicalOptionValue,
}) => {
  return (
    <RightItem>
      <ItemTop>
        {tooltips ? (
          <Popover
            content={
              <p style={{ maxWidth: "350px", whiteSpace: "normal" }}>
                {tooltips}
              </p>
            }
            placement="bottomLeft"
          >
            <TitleLeft>
              <InfoIcon />
              {title}
            </TitleLeft>
          </Popover>
        ) : (
          <TitleLeft>{title}</TitleLeft>
        )}
      </ItemTop>
      <ItemDescription>
        <Grid container>
          <Grid item xs={4}>
            <ItemMiddleLeft>
              <CardItem>
                <CircleProgressBar
                  historicalValue={historicalOptionValue}
                  value={optionValue}
                  title={optionName}
                  diameter={250}
                  description={optionDescription}
                  colors={colors}
                />
              </CardItem>
            </ItemMiddleLeft>
          </Grid> 
          <Grid item xs={8}> 
            <ItemMiddleRight>
              <ContentTop>
                {contentTitle}
              </ContentTop>
              <ContentBottom>
                {contentBody}
              </ContentBottom>
            </ItemMiddleRight>
          </Grid>
        </Grid>  
      </ItemDescription>
    </RightItem>
  );
};

const RightItem = styled(Grid)({
  // maxWidth: "53.19rem",
  width: "100%",
  minHeight: "17.94rem",
  background: "#FFFFFF",
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);",
  borderRadius: "4px",
  // marginLeft: "3.813rem",
  marginTop: "1.875rem",
  clear: "both",
});
const TitleLeft = styled(Grid)({
  float: "right",
  marginRight: "3.125rem",
  fontSize: "0.625rem;",
  fontFamily: "Helvetica;",
  color: "rgba(0, 0, 0, 0.6);",
  letterSpacing: "1px;",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
});
const ItemTop = styled(Grid)({
  display: "flex",
  justifyContent: "space-between",
  height: "2.375rem",
  lineHeight: "2.375rem",
  paddingLeft: "1.56rem",
  borderBottom: "1px solid #D5D2CA",
});
const ItemMiddleLeft = styled(Grid)({
  marginLeft: "-1.25rem",
});
const ItemMiddleRight = styled(Grid)({
  paddingTop: 0,
  marginTop: "1.81rem",
});
const CardItem = styled(Grid)({});
const ContentTop = styled(Grid)({
  fontSize: "1.5rem",
  color: "#000000",
  marginBottom: "10px",
});
const ContentBottom = styled(Grid)({
  fontSize: "16px;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  lineHeight: "24px;",
});
const ItemDescription = styled(Grid)({
  display: "flex",
  padding: "20px 22px 20px 26px",
  justifyContent: "space-between",
});
const InfoIcon = styled(InfoOutlined)({
  fontSize: "0.625rem",
  color: "rgba(0, 0, 0, 0.6)",
  marginRight: "10px",
});

export default ScenarioCard;
