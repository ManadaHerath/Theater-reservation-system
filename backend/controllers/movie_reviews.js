import { connection } from "../index.js";

export const getReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Query to get review details and user info
    const [reviewDetails] = await connection.query(
      `
            SELECT 
                movie_reviews.review_id,
                users.full_name,
                users.avatar,
                movie_reviews.review AS text,
                movie_reviews.like_count AS likes,
                movie_user_rating.rates AS rating
            FROM movie_reviews
            INNER JOIN users ON movie_reviews.user_id = users.id
            LEFT JOIN movie_user_rating ON movie_reviews.movie_id = movie_user_rating.movie_id AND movie_reviews.user_id = movie_user_rating.user_id
            WHERE movie_reviews.movie_id = ?
        `,
      [id]
    );

    if (reviewDetails.length) {
      const reviewsWithReplies = await Promise.all(
        reviewDetails.map(async (review) => {
          const [replies] = await connection.query(
            `
                    SELECT 
                        users.full_name,
                        users.avatar,
                        movie_review_reply.reply AS text
                    FROM movie_review_reply
                    INNER JOIN users ON movie_review_reply.user_id = users.id
                    WHERE movie_review_reply.review_id = ?
                `,
            [review.review_id]
          );

          return {
            id: review.review_id,
            name: review.full_name,
            avatar: review.avatar,
            text: review.text,
            rating: review.rating,
            likes: review.likes,
            liked: false,
            replies: replies.map((reply) => ({
              name: reply.full_name,
              text: reply.text,
              avatar: reply.avatar,
            })),
          };
        })
      );


      res.json(reviewsWithReplies);
    } else {
      res.status(201).json({ message: "Reviews not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const PostReviewReply = async (req, res, next) => {
  try {
    const { id, reply } = req.body;
    const user = req.user;
    const dbquery =
      "INSERT INTO movie_review_reply (review_id, user_id, reply) VALUES (?, ?, ?)";

    await connection.query(dbquery, [id, req.user.id, reply]);

    res.status(201).json({ message: "Reply added" });
  } catch (error) {
    console.log("Error adding review reply:", error);
  }
};

export const updateReviewLikes = async (req, res, next) => {
  try {
    const { id } = req.body;
    const dbquery =
      "UPDATE movie_reviews SET like_count = like_count + 1 WHERE review_id = ?";

    await connection.query(dbquery, [id]);

    res.status(201).json({ message: "Review liked" });
  } catch (error) {
    console.log("Error liking review:", error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { movie_id, review } = req.body;
    const dbquery =
      "INSERT INTO movie_reviews (movie_id, user_id, review) VALUES (?, ?, ?)";

    await connection.query(dbquery, [movie_id, req.user.id, review]);

    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ message: "Error adding review" });
    console.log("Error adding review:", error);
  }
};

export const addRating = async (req, res) => {
  try {
    const { movie_id, rating } = req.body;

    const user_id = req.user.id;
    const checkQuery =
      "SELECT * FROM movie_user_rating WHERE movie_id = ? AND user_id = ?";
    const [rows] = await connection.query(checkQuery, [movie_id, user_id]);
    if (rating > 0) {
      if (rows.length > 0) {
        const updateQuery =
          "UPDATE movie_user_rating SET rates = ? WHERE movie_id = ? AND user_id = ?";
        await connection.query(updateQuery, [rating, movie_id, user_id]);
        res.status(200).json({ message: `Rating updated` });
      } else {
        const insertQuery =
          "INSERT INTO movie_user_rating (movie_id, user_id, rates) VALUES (?, ?, ?)";
        await connection.query(insertQuery, [movie_id, user_id, rating]);
        res.status(201).json({ message: `Rating added` });
      }
    }
  } catch (error) {
    console.log("Error adding/updating rating:", error);
  }
};

export const getUserRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const dbquery =
      "SELECT rates FROM movie_user_rating WHERE movie_id = ? AND user_id = ?";
    const [rows] = await connection.query(dbquery, [id, user_id]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(201).json({ message: "Rating not found" });
    }
  } catch (error) {
    console.log("Error getting user rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
