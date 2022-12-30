export function capitalizeExpr(expr: string) {
  return expr
    .split('-')
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join(' ');
}

export function createRating(starDivs: NodeListOf<HTMLDivElement>, rating: number) {
  for (let i = 0; i < Math.round(rating); i++) {
    starDivs[i].classList.add('checked');
  }
}