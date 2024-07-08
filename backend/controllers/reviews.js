import { connection } from "../index.js";

export const getReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Query to get review details and user info
    const [reviewDetails] = await connection.query(
      `
            SELECT 
                theatre_reviews.review_id,
                users.full_name,
                users.avatar,
                theatre_reviews.review AS text,
                theatre_reviews.like_count AS likes,
                theatre_reviews.rates AS rating
            FROM theatre_reviews
            INNER JOIN users ON theatre_reviews.user_id = users.id
            WHERE theatre_reviews.theatre_id = ?
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
                        theatre_review_reply.reply AS text
                    FROM theatre_review_reply
                    INNER JOIN users ON theatre_review_reply.user_id = users.id
                    WHERE theatre_review_reply.review_id = ?
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

      console.log(reviewsWithReplies);

      res.json(reviewsWithReplies);
    } else {
      res.status(201).json({ message: "Reviews not found" });
    }
  } catch (error) {
    next(error);
  }
};
