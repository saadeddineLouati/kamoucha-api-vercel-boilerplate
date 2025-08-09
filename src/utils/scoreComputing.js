/**
 *
 * @param {any} post
 * @returns number
 */
function getPostScore(post) {
  let postWeight = 1;
  let initialScore = 0;
  if (post.isTrusted) {
    postWeight = 1.1;
    initialScore = 0.5;
  }

  const now = Date.now();
  const createdAt = new Date(post.createdAt).getTime();
  const daysSinceCreate = Math.floor((now - createdAt) / (24 * 60 * 60 * 1000)) || 0;
  const totalLikes = post.totalLikes || 0;
  const totalDislikes = post.totalDislikes || 0;
  const totalReports = post.totalReports || 0;
  const totalComments = post.totalComments || 0;
  const totalViews = post.totalViews || 0;

  // Customize weight values for each variable
  const likesWeight = 0.1 * postWeight;
  const dislikesWeight = -0.1 * postWeight;
  const reportsWeight = -1 * postWeight;
  const commentsWeight = 0.2 * postWeight;
  const viewsWeight = 0.05 * postWeight;
  const daysSinceCreateWeight = 0.1 * postWeight;

  // Calculate the total score using the weighted variables
  const totalScore =
    initialScore -
    daysSinceCreate * daysSinceCreateWeight +
    totalLikes * likesWeight +
    totalDislikes * dislikesWeight +
    totalReports * reportsWeight +
    totalComments * commentsWeight +
    totalViews * viewsWeight;

  return parseFloat(totalScore);
}

/**
 *
 * @param {any} user
 * @returns number
 */
function getUserScore(user) {
  if (user) {
    let userWeight = 1;
    if (user.isTrusted) userWeight = 1.5;
    const now = Date.now();
    const createdAt = new Date(user.createdAt).getTime();
    const daysSinceJoining = Math.floor((now - createdAt) / (24 * 60 * 60 * 1000)) || 0;
    const totalLikes = user.likes?.length || 0;
    const totalDislikes = user.dislikes?.length || 0;
    const totalComments = user.comments?.length || 0;
    const deals = user.deals?.length || 0;
    const frees = user.frees?.length || 0;
    const promocodes = user.promocodes?.length || 0;
    const discussions = user.discussions?.length || 0;
    const commentLikes = user.commentLikes?.length || 0;

    // Customize weight values for each variable
    const likesWeight = 0.15 * userWeight;
    const dislikesWeight = 0.15 * userWeight;
    const commentsWeight = 0.2 * userWeight;
    const dealsWeight = 0.1 * userWeight;
    const freesWeight = 0.1 * userWeight;
    const promocodesWeight = 0.1 * userWeight;
    const discussionsWeight = 0.1 * userWeight;
    const commentLikesWeight = 0.4 * userWeight;
    const daysSinceJoiningWeight = 0.1 * userWeight;

    // Calculate the total score using the weighted variables
    const totalScore =
      daysSinceJoining * daysSinceJoiningWeight +
      totalLikes * likesWeight +
      totalDislikes * dislikesWeight +
      totalComments * commentsWeight +
      deals * dealsWeight +
      frees * freesWeight +
      promocodes * promocodesWeight +
      discussions * discussionsWeight +
      commentLikes * commentLikesWeight;

    return parseFloat(totalScore);
  }
}

/**
 *
 * @param {any} user
 * @returns number
 */
function getReferralBonus(user) {
  if (user.isTrusted) return 20;
  return 10;
}

module.exports = {
  getPostScore,
  getUserScore,
  getReferralBonus,
};
