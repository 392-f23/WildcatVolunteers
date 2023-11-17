import "./PostPage.css"
import PostingForm from "../components/form/PostingForm";

const PostPage = ( {user} ) => {
  return (
    <div className="posting-page-div">
      <PostingForm user={user}></PostingForm>
    </div>
  );
};

export default PostPage;
