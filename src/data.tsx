import generateData from "data-generator-retail";

const data = generateData();
// compute the average note for all products
const reviews = data.reviews;
const products = data.products;
products.forEach((product) => {
  const allReviews = reviews.filter(
    (review) => review.product_id === product.id
  );
  if (allReviews.length === 0) {
    product.average_note = 0;
    return;
  }
  product.average_note =
    allReviews.reduce((avg, review) => avg + review.rating, 0) /
    allReviews.length;
});

export { data };
