import { isPlainObject } from "./service"

export type Indexed<T = unknown> = {
  [key: string]: T;
};

function merge<L extends Indexed = Indexed, R extends Indexed = Indexed>(lhs: L, rhs: R): L & R {
  for (const p in rhs) {
    if (!Object.prototype.hasOwnProperty.call(rhs, p)) {
      continue;
    }

    try {
      const rhsVal = rhs[p];
      const lhsVal = (lhs as Indexed)[p];

      if (isPlainObject(rhsVal) && isPlainObject(lhsVal)) {
        (rhs as Indexed)[p] = merge(lhsVal as Indexed, rhsVal as Indexed);
        (lhs as Indexed)[p] = (rhs as Indexed)[p];
      } else {
        (lhs as Indexed)[p] = rhsVal;
      }
    } catch (e) {
      console.error(e);
      (lhs as Indexed)[p] = (rhs as Indexed)[p];
    }
  }

  return lhs as L & R;
}

export default merge;
