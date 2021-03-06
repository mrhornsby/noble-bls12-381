import * as fc from "fast-check";
import { Fp, Fp2 } from "../src";

const NUM_RUNS = Number(process.env.RUNS_COUNT || 10); // reduce to 1 to shorten test time

describe("bls12-381 Fp", () => {
  it("Fp equality", () => {
    fc.assert(
      fc.property(fc.bigInt(1n, Fp.ORDER), num => {
        const a = new Fp(num);
        const b = new Fp(num);
        expect(a.equals(b)).toBe(true);
        expect(b.equals(a)).toBe(true);
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp non-equality", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        (num1, num2) => {
          const a = new Fp(num1);
          const b = new Fp(num2);
          expect(a.equals(b)).toBe(num1 === num2);
          expect(b.equals(a)).toBe(num1 === num2);
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp square and multiplication equality", () => {
    fc.assert(
      fc.property(fc.bigInt(1n, Fp.ORDER), num => {
        const a = new Fp(num);
        expect(a.square()).toEqual(a.multiply(a));
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp multiplication and add equality", () => {
    fc.assert(
      fc.property(fc.bigInt(1n, Fp.ORDER), num => {
        const a = new Fp(num);
        expect(a.multiply(0n)).toEqual(a.zero);
        expect(a.multiply(a.zero)).toEqual(a.zero);
        expect(a.multiply(1n)).toEqual(a);
        expect(a.multiply(a.one)).toEqual(a);
        expect(a.multiply(2n)).toEqual(a.add(a));
        expect(a.multiply(3n)).toEqual(a.add(a).add(a));
        expect(a.multiply(4n)).toEqual(
          a
            .add(a)
            .add(a)
            .add(a)
        );
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp multiplication commutatity", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        (num1, num2) => {
          const a = new Fp(num1);
          const b = new Fp(num2);
          expect(a.multiply(b)).toEqual(b.multiply(a));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp multiplication associativity", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        (num1, num2, num3) => {
          const a = new Fp(num1);
          const b = new Fp(num2);
          const c = new Fp(num3);
          expect(a.multiply(b.multiply(c))).toEqual(a.multiply(b).multiply(c));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp multiplication distributivity", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        (num1, num2, num3) => {
          const a = new Fp(num1);
          const b = new Fp(num2);
          const c = new Fp(num3);
          expect(a.multiply(b.add(c))).toEqual(
            b.multiply(a).add(c.multiply(a))
          );
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp division with one equality", () => {
    fc.assert(
      fc.property(fc.bigInt(1n, Fp.ORDER), num => {
        const a = new Fp(num);
        expect(a.div(a.one)).toEqual(a);
        expect(a.div(a)).toEqual(a.one);
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp division with zero equality", () => {
    fc.assert(
      fc.property(fc.bigInt(1n, Fp.ORDER), num => {
        const a = new Fp(num);
        expect(a.zero.div(a)).toEqual(a.zero);
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp division distributivity", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        (num1, num2, num3) => {
          const a = new Fp(num1);
          const b = new Fp(num2);
          const c = new Fp(num3);
          expect(a.add(b).div(c)).toEqual(a.div(c).add(b.div(c)));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp addition with zero equality", () => {
    fc.assert(
      fc.property(fc.bigInt(1n, Fp.ORDER), num => {
        const a = new Fp(num);
        expect(a.add(a.zero)).toEqual(a);
      }),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp addition commutatity", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        (num1, num2) => {
          const a = new Fp(num1);
          const b = new Fp(num2);
          expect(a.add(b)).toEqual(b.add(a));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp add associativity", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        (num1, num2, num3) => {
          const a = new Fp(num1);
          const b = new Fp(num2);
          const c = new Fp(num3);
          expect(a.add(b.add(c))).toEqual(a.add(b).add(c));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp minus zero equality", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        num => {
          const a = new Fp(num);
          expect(a.subtract(a.zero)).toEqual(a);
          expect(a.subtract(a)).toEqual(a.zero);
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp minus and negative equality", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        (num1, num2) => {
          const a = new Fp(num1);
          const b = new Fp(num1);
          expect(a.zero.subtract(a)).toEqual(a.negative());
          expect(a.subtract(b)).toEqual(a.add(b.negative()));
          expect(a.subtract(b)).toEqual(a.add(b.multiply(-1n)));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp negative equality", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        num => {
          const a = new Fp(num);
          expect(a.negative()).toEqual(a.zero.subtract(a));
          expect(a.negative()).toEqual(a.multiply(-1n));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp division and multiplitaction equality", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        fc.bigInt(1n, Fp.ORDER),
        (num1, num2) => {
          const a = new Fp(num1);
          const b = new Fp(num2);
          expect(a.div(b)).toEqual(a.multiply(b.invert()));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
  it("Fp pow and multiplitaction equality", () => {
    fc.assert(
      fc.property(
        fc.bigInt(1n, Fp.ORDER),
        num => {
          const a = new Fp(num);
          expect(a.pow(0n)).toEqual(a.one);
          expect(a.pow(1n)).toEqual(a);
          expect(a.pow(2n)).toEqual(a.multiply(a));
          expect(a.pow(3n)).toEqual(a.multiply(a).multiply(a));
        }
      ),
      {
        numRuns: NUM_RUNS
      }
    );
  });
});
