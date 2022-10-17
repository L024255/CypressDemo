import React from "react";
import { Grid, Typography, styled, Avatar } from "@material-ui/core";

const CommentCard: React.FC = () => {
  return (
    <CommentContainer container>
      <Record
        author="Tracy Klein"
        time="8:15AM Today"
        detail="@alex.kearns My team and I are actually working on this right now. We’d love your input on what you’re seeing the need is from the field. I’ll share the Draft project and invite you to be a collaborator."
      />
      <ReplyContainer>
        <Record
          author="Alex Kearns"
          time="8:22AM Today"
          detail="Excellent! I’d love to collaborate with you guys! Curious what other departments are interested in this material?"
        />
      </ReplyContainer>
    </CommentContainer>
  );
};

const CommentContainer = styled(Grid)({});
const ReplyContainer = styled(Grid)({
  marginLeft: "1.25rem",
  marginTop: "2.188rem",
});
interface RecordProps {
  author: string;
  time: string;
  detail: string;
}
const Record: React.FC<RecordProps> = ({ author, time, detail }) => {
  const initials = author.match(/\b\w/g) || [];
  const myinitials = (
    (initials.shift() || "") + (initials.pop() || "")
  ).toUpperCase();
  return (
    <CommentCardContainer>
      <CommentCardHeader container spacing={2}>
        <Grid item>
          <UserAvartar>{myinitials}</UserAvartar>
        </Grid>
        <Grid item>
          <UserName variant="caption">{author}</UserName>
        </Grid>
        <Grid item>
          <CommentTime>{time}</CommentTime>
        </Grid>
      </CommentCardHeader>
      <CommentContent variant="body1">{detail}</CommentContent>
    </CommentCardContainer>
  );
};
const CommentCardContainer = styled("div")({
  paddingLeft: "1.625rem",
  paddingRight: "1.625rem",
});
const CommentCardHeader = styled(Grid)({
  display: "flex",
  alignItems: "center",
});
const UserAvartar = styled(Avatar)({
  width: "1.75rem",
  height: "1.75rem",
  fontSize: "0.688rem",
  backgroundColor: "#B1059D",
  fontWeight: 500,
  color: "#FFF",
  lineHeight: "0.938rem",
});
const UserName = styled(Typography)({
  color: "#252525",
  fontSize: "0.875rem",
  fontWeight: 500,
  letterSpacing: 0,
  lineHeight: "1.188rem",
});
const CommentTime = styled(Typography)({
  color: "#82786F",
  fontSize: "0.75rem",
  letterSpacing: 0,
  lineHeight: "1rem",
});
const CommentContent = styled(Typography)({
  color: "#252525",
  fontSize: "1rem",
  letterSpacing: 0,
  lineHeight: "1.438rem",
  marginLeft: "2.5rem",
});

export default CommentCard;
