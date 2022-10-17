import { Grid, styled } from "@material-ui/core";
import React, { FC } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import CustomSelect from "../../../components/CustomSelect";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export interface HeroProps {}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: "center",
      listStyle: "none",
      margin: "0",
      height: "144px",
      padding: "10px",
      paddingTop: "0",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);
const FormCard: FC<HeroProps> = ({}) => {
  const handleDisplay = (key: any) => {
    let arr = optionData.filter((item) => {
      return item.key != key;
    });
    setOptionData(arr);
  };
  const classes = useStyles();
  interface ChipData {
    key: number;
    label: string;
    content: string;
    description: string;
  }
  const [optionData, setOptionData] = React.useState<ChipData[]>([
    { key: 0, label: "Overall", content: "111", description: "Burden Score" },
  ]);
  return (
    <>
      <TitleCard>Telephone Visit</TitleCard>
      <Container>
        <LeftContent>
          <LeftTitle>Activities Selected</LeftTitle>
          <LeftCard>
            <Paper component="ul" className={classes.root}>
              {optionData.map((chip) => (
                <div>
                  {
                    <NewItem
                      style={{ marginRight: "16px", marginLeft: "-10px" }}
                    >
                      <ClearIcon
                        onClick={() => handleDisplay(chip.key)}
                        style={{
                          color: "#D52B1E",
                          width: "1.2rem",
                          marginLeft: "20px",
                          marginRight: "8px",
                          cursor: "pointer",
                          marginTop: "-2px",
                        }}
                      />
                      <Content>{chip.label}</Content>
                    </NewItem>
                  }
                </div>
              ))}
            </Paper>
          </LeftCard>
        </LeftContent>
        <RightContent>
          <RightCard>
            <RightTitle>
              <TopTitle style={{ width: "297px" }}>
                Activities Selected
              </TopTitle>
              <TopTitle style={{ width: "115px" }}>
                <div style={{ height: "12px", marginTop: "-6px" }}>
                  Approximate{" "}
                </div>{" "}
                <div>Cost (US Data)</div>
              </TopTitle>
              <TopTitle style={{ width: "172px" }}>
                <div style={{ height: "12px", marginTop: "-6px" }}>
                  Frequency of Activity
                </div>
                <div> Over Trial Duration</div>
              </TopTitle>
              <TopTitle style={{ width: "103px", marginRight: "17px" }}>
                <div style={{ height: "12px", marginTop: "-6px" }}>APPROX.</div>
                <div>TOTAL COST</div>
              </TopTitle>
            </RightTitle>
            <RightItem>
              <CustomSelect
                variant="outlined"
                labelId="new-trial-detail-placeboControlled"
                disableunderline="true"
                native
                style={{
                  width: "261px",
                  marginLeft: "12PX",
                  height: "32px",
                  marginRight: "26PX",
                  marginTop: "7PX",
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </CustomSelect>
              <Cost>$100 / instance</Cost>
              <Number>1</Number>
              <TotalCost>$100 / patient</TotalCost>
            </RightItem>
            <SelectBelow>Select justification / rationale below:</SelectBelow>
            <RightItem>
              <TextField
                id="outlined-basic"
                variant="outlined"
                style={{
                  width: "667px",
                  marginLeft: "12PX",
                  height: "32px",
                  marginRight: "26PX",
                  marginTop: "-4PX",
                }}
              />
              {/* <CustomSelect
                        variant="outlined"
                        labelId="new-trial-detail-placeboControlled"
                        disableunderline="true"
                        native
                        style={{width:'261px',marginLeft:'12PX',height: '32px',marginRight:'26PX',marginTop:'8PX'}}
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </CustomSelect> */}
            </RightItem>
          </RightCard>
        </RightContent>
      </Container>
      <TitleCard>Physical Evalution</TitleCard>
      <Container>
        <LeftContent>
          <LeftTitle>Activities Selected</LeftTitle>
          <LeftCard>
            <Paper component="ul" className={classes.root}>
              {optionData.map((chip) => (
                <div>
                  {
                    <NewItem
                      style={{ marginRight: "16px", marginLeft: "-10px" }}
                    >
                      <ClearIcon
                        onClick={() => handleDisplay(chip.key)}
                        style={{
                          color: "#D52B1E",
                          width: "1.2rem",
                          marginLeft: "20px",
                          marginRight: "8px",
                          cursor: "pointer",
                          marginTop: "-2px",
                        }}
                      />
                      <Content>{chip.label}</Content>
                    </NewItem>
                  }
                </div>
              ))}
            </Paper>
          </LeftCard>
        </LeftContent>
        <RightContent>
          <RightCard>
            <RightTitle>
              <TopTitle style={{ width: "297px" }}>
                Activities Selected
              </TopTitle>
              <TopTitle style={{ width: "115px" }}>
                <div style={{ height: "12px", marginTop: "-6px" }}>
                  Approximate
                </div>{" "}
                <div>Cost (US Data)</div>
              </TopTitle>
              <TopTitle style={{ width: "172px" }}>
                <div style={{ height: "12px", marginTop: "-6px" }}>
                  Frequency of Activity
                </div>
                <div> Over Trial Duration</div>
              </TopTitle>
              <TopTitle style={{ width: "103px", marginRight: "17px" }}>
                <div style={{ height: "12px", marginTop: "-6px" }}>APPROX.</div>
                <div>TOTAL COST</div>
              </TopTitle>
            </RightTitle>
            <RightItem>
              <CustomSelect
                variant="outlined"
                labelId="new-trial-detail-placeboControlled"
                disableunderline="true"
                native
                style={{
                  width: "261px",
                  marginLeft: "12PX",
                  height: "32px",
                  marginRight: "26PX",
                  marginTop: "8PX",
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </CustomSelect>
              <Cost>$100 / instance</Cost>
              <Number>1</Number>
              <TotalCost>$100 / patient</TotalCost>
            </RightItem>
            <RightItem style={{ backgroundColor: "#F8F8F9" }}>
              <CustomSelect
                variant="outlined"
                labelId="new-trial-detail-placeboControlled"
                disableunderline="true"
                native
                style={{
                  width: "261px",
                  marginLeft: "12PX",
                  height: "32px",
                  marginRight: "26PX",
                  marginTop: "8PX",
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </CustomSelect>
              <Cost>$100 / instance</Cost>
              <Number>1</Number>
              <TotalCost>$100 / patient</TotalCost>
            </RightItem>
            <RightItem>
              <CustomSelect
                variant="outlined"
                labelId="new-trial-detail-placeboControlled"
                disableunderline="true"
                native
                style={{
                  width: "261px",
                  marginLeft: "12PX",
                  height: "32px",
                  marginRight: "26PX",
                  marginTop: "8PX",
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </CustomSelect>
              <Cost>$100 / instance</Cost>
              <Number>1</Number>
              <TotalCost>$100 / patient</TotalCost>
            </RightItem>
          </RightCard>
        </RightContent>
      </Container>
      <TitleCard>Lab Tests and Sample Collection</TitleCard>
      <Container>
        <LeftContent>
          <LeftTitle>Activities Selected</LeftTitle>
          <LeftCard>
            <Paper component="ul" className={classes.root}>
              {optionData.map((chip) => (
                <div>
                  {
                    <NewItem
                      style={{ marginRight: "16px", marginLeft: "-10px" }}
                    >
                      <ClearIcon
                        onClick={() => handleDisplay(chip.key)}
                        style={{
                          color: "#D52B1E",
                          width: "1.2rem",
                          marginLeft: "20px",
                          marginRight: "8px",
                          cursor: "pointer",
                          marginTop: "-2px",
                        }}
                      />
                      <Content>{chip.label}</Content>
                    </NewItem>
                  }
                </div>
              ))}
            </Paper>
          </LeftCard>
        </LeftContent>
        <RightContent>
          <RightCard>
            <RightTitle>
              <TopTitle style={{ width: "297px" }}>
                Activities Selected
              </TopTitle>
              <TopTitle style={{ width: "115px" }}>
                <div style={{ height: "12px", marginTop: "-6px" }}>
                  Approximate
                </div>{" "}
                <div>Cost (US Data)</div>
              </TopTitle>
              <TopTitle style={{ width: "172px" }}>
                <div style={{ height: "12px", marginTop: "-6px" }}>
                  Frequency of Activity
                </div>
                <div> Over Trial Duration</div>
              </TopTitle>
              <TopTitle style={{ width: "103px", marginRight: "17px" }}>
                <div style={{ height: "12px", marginTop: "-6px" }}>APPROX.</div>
                <div>TOTAL COST</div>
              </TopTitle>
            </RightTitle>
            <RightItem>
              <CustomSelect
                variant="outlined"
                labelId="new-trial-detail-placeboControlled"
                disableunderline="true"
                native
                style={{
                  width: "261px",
                  marginLeft: "12PX",
                  height: "32px",
                  marginRight: "26PX",
                  marginTop: "8PX",
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </CustomSelect>
              <Cost>$100 / instance</Cost>
              <Number>1</Number>
              <TotalCost>$100 / patient</TotalCost>
            </RightItem>
            <RightItem style={{ backgroundColor: "#F8F8F9" }}>
              <CustomSelect
                variant="outlined"
                labelId="new-trial-detail-placeboControlled"
                disableunderline="true"
                native
                style={{
                  width: "261px",
                  marginLeft: "12PX",
                  height: "32px",
                  marginRight: "26PX",
                  marginTop: "8PX",
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </CustomSelect>
              <Cost>$100 / instance</Cost>
              <Number>1</Number>
              <TotalCost>$100 / patient</TotalCost>
            </RightItem>
            <RightItem>
              <CustomSelect
                variant="outlined"
                labelId="new-trial-detail-placeboControlled"
                disableunderline="true"
                native
                style={{
                  width: "261px",
                  marginLeft: "12PX",
                  height: "32px",
                  marginRight: "26PX",
                  marginTop: "8PX",
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </CustomSelect>
              <Cost>$100 / instance</Cost>
              <Number>1</Number>
              <TotalCost>$100 / patient</TotalCost>
            </RightItem>
          </RightCard>
        </RightContent>
      </Container>
    </>
  );
};

const Container = styled(Grid)({
  display: "flex",
  width: "950px",
  justifyContent: "space-between",
  marginTop: "26px",
  marginLeft: "-26px",
});
const LeftCard = styled(Grid)({
  width: "250px",
});
const TopTitle = styled(Grid)({
  textTransform: "uppercase",
});
const RightCard = styled(Grid)({
  width: "702px",
});

const TitleCard = styled(Grid)({
  fontSize: "16px;",
  fontFamily: "Helvetica;",
  color: "#82786F;",
  width: "975px",
  marginTop: "42px;",
});
const LeftTitle = styled(Grid)({
  fontSize: "10px;",
  fontFamily: "Helvetica;",
  color: "rgba(0, 0, 0, 0.6);",
  letterSpacing: "1px;",
  height: "38px",
  lineHeight: "38px",
  width: "250px",
  paddingLeft: "24px",
  borderBottom: "1px solid #9E9E9E",
  textTransform: "uppercase",
});
const RightTitle = styled(Grid)({
  fontSize: "10px;",
  fontFamily: "Helvetica;",
  color: "rgba(0, 0, 0, 0.6);",
  letterSpacing: "1px;",
  height: "38px",
  lineHeight: "38px",
  paddingLeft: "24px",
  borderBottom: "1px solid #9E9E9E",
  display: "flex",
  paddingRight: "15px",
});
const CardItem = styled(Grid)({
  width: "205px;",
  height: "92px;",
  background: "rgba(255, 255, 255, 0.09);",
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14);",
  padding: "4px 0 0 18px",
});
const LeftContent = styled(Grid)({
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14);",
  borderRadius: "4px",
  marginRight: "16px",
});
const RightContent = styled(Grid)({
  boxShadow:
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14);",
  borderRadius: "4px",
});
const TotalCost = styled(Grid)({
  fontSize: "12px;",
  fontFamily: "Helvetica;",
  color: "#252525;",
  width: "118px",
  marginLeft: "-13px",
});
const Cost = styled(Grid)({
  width: "114px",
  fontSize: "12px;",
  fontFamily: "Helvetica;",
  color: "#252525;",
});
const Number = styled(Grid)({
  width: "172px",
  fontSize: "12px;",
  fontFamily: "Helvetica;",
  color: "#252525;",
});
const RightItem = styled(Grid)({
  display: "flex",
  height: "48px",
  lineHeight: "48px",
});
const SelectBelow = styled(Grid)({
  fontSize: "12px;",
  fontFamily: "Helvetica;",
  color: "#252525;",
  height: "48px",
  lineHeight: "48px",
  paddingLeft: "12px",
});
const Content = styled(Grid)({
  fontFamily: "Helvetica;",
  color: "#000000;",
  marginBottom: "3px",
  fontSize: "12px",
});
const NewItem = styled(Grid)({
  height: "48px;",
  lineHeight: "48px",
  display: "flex",
  alignItems: "center",
  fontSize: "0.875rem;",
  fontFamily: "Helvetica;",
  color: "#000000;",
  paddingLeft: "16px",
  background: "#F8F8F9",
  // marginTop:'12px',
  width: "250px",
});

export default FormCard;
