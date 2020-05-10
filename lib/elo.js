const K = 32;

function getRatingDelta(p1Rating, p2Rating, result) {
  if ([0, 1].includes(result) === false) {
    return null;
  }

  const p1ChanceToWin = 1 / (1 + 10 ** ((p2Rating - p1Rating) / 400));

  return Math.round(K * (result - p1ChanceToWin));
}

function getNewRating(p1Rating, p2Rating, result) {
  return p1Rating + getRatingDelta(p1Rating, p2Rating, result);
}

export default { getRatingDelta, getNewRating };
