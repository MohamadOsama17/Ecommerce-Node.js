const pagenationResponse = ({ page, limit, totalDocs }) => {
  const totalPages = Math.ceil(totalDocs / limit);
  return { currentPage: page, totalPages, results: totalDocs };
}

module.exports = pagenationResponse;