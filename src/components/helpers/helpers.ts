const firstSymbol = 0;
const secondSymbol = 1;

export function capitalizeExpr(expr: string): string {
  return expr
    .split('-')
    .map((x) => x.charAt(firstSymbol).toUpperCase() + x.slice(secondSymbol).toLowerCase())
    .join(' ');
}

export function createRating(starDivs: NodeListOf<HTMLDivElement>, rating: number): void {
  for (let i = 0; i < Math.round(rating); i++) {
    starDivs[i].classList.add('checked');
  }
}
