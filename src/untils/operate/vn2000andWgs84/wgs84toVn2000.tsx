import {
  atan,
  convertDegToRad,
  cos,
  pow,
  sin,
  sqrt,
  tan,
} from "./vn2000ToWgs84";
const PI = Math.PI;
const L0 = 105;
const a = 6378137.0;
const f = 1 / 298.257223563;
let b = a - f * a;
const w = 7292115.0 * Math.pow(10, -11);
const GM = 3986005.108;
const k0 = 0.9999;
let e = sqrt((pow(a, 2) - pow(b, 2)) / pow(a, 2));
let eSub = sqrt((pow(a, 2) - pow(b, 2)) / pow(b, 2));
const convertWgs84BLToWgs84XY = ([Bwgs84, Lwgs84, Hwgs84]: number[]) => {
  Bwgs84 = convertDegToRad(Bwgs84);
  Lwgs84 = convertDegToRad(Lwgs84);
  let N = a / sqrt(1 - pow(e * sin(Bwgs84), 2));
  let Xwgs84 = (N + Hwgs84) * cos(Bwgs84) * cos(Lwgs84);
  let Ywgs84 = (N + Hwgs84) * cos(Bwgs84) * sin(Lwgs84);
  let Zwgs84 = (pow(b / a, 2) * N + Hwgs84) * sin(Bwgs84);
  return [Xwgs84, Ywgs84, Zwgs84];
};
const convertWgs84XYToVn2000XY = ([Xwgs84, Ywgs84, Zwgs84]: number[]) => {
  let deltaX0 = -191.90441429;
  let deltaY0 = -39.30318279;
  let deltaZ0 = -111.45032835;
  let omega0 = convertDegToRad(-0.00928836 / 3600);
  let psi0 = convertDegToRad(0.01975479 / 3600);
  let epsilon0 = convertDegToRad(-0.00427372 / 3600);
  let kappa = 1.000000252906278;
  let Xvn2000 =
    -deltaX0 + (1 / kappa) * (Xwgs84 - epsilon0 * Ywgs84 + psi0 * Zwgs84);
  let Yvn2000 =
    -deltaY0 + (1 / kappa) * (epsilon0 * Xwgs84 + Ywgs84 - omega0 * Zwgs84);
  let Zvn2000 =
    -deltaZ0 + (1 / kappa) * (-psi0 * Xwgs84 + omega0 * Ywgs84 + Zwgs84);
  return [Xvn2000, Yvn2000, Zvn2000];
};
const convertVn2000XYToVn2000BL = ([Xvn2000, Yvn2000, Zvn2000]: number[]) => {
  let gama = atan(
    (Zvn2000 / sqrt(pow(Xvn2000, 2) + pow(Yvn2000, 2))) *
      (1 -
        f +
        (a * pow(e, 2)) /
          sqrt(pow(Xvn2000, 2) + pow(Yvn2000, 2) + pow(Zvn2000, 2)))
  );
  let Bvn2000 = atan(
    (Zvn2000 * (1 - f) + a * pow(e, 2) * pow(sin(gama), 3)) /
      ((1 - f) *
        (sqrt(pow(Xvn2000, 2) + pow(Yvn2000, 2)) -
          a * pow(e, 2) * pow(cos(gama), 3)))
  );

  let Lvn2000 = atan(Yvn2000 / Xvn2000);
  if (Lvn2000 < 0) {
    Lvn2000 += PI;
  } else if (Lvn2000 >= 2 * PI) {
    Lvn2000 = Lvn2000 - 2 * PI;
  }

  let Hvn2000 =
    cos(Bvn2000) * sqrt(pow(Xvn2000, 2) + pow(Yvn2000, 2)) +
    Zvn2000 * sin(Bvn2000) -
    a * sqrt(1 - pow(e, 2) * pow(sin(gama), 2));

  return [Bvn2000, Lvn2000, Hvn2000];
};
const convertVn2000XYToVn2000xy = ([Bvn2000, Lvn2000, Hvn2000]: number[]) => {
  let l = Lvn2000 - convertDegToRad(L0);
  let nuy = eSub * cos(Bvn2000);
  let N = a / sqrt(1 - pow(e * sin(Bvn2000), 2));
  let Ay1 =
    (pow(cos(Bvn2000), 2) * (1 - pow(tan(Bvn2000), 2) + pow(nuy, 2))) / 6;
  let Ax1 =
    (pow(cos(Bvn2000), 2) *
      (5 - pow(tan(Bvn2000), 2) + 9 * pow(nuy, 2) * 4 * pow(nuy, 4))) /
    12;
  let Ay2 =
    (pow(cos(Bvn2000), 4) *
      (5 -
        18 * pow(tan(Bvn2000), 2) +
        pow(tan(Bvn2000), 4) +
        14 * pow(nuy, 2) -
        58 * pow(tan(Bvn2000), 2) * pow(nuy, 2))) /
    120;
  let Ax2 =
    (pow(cos(Bvn2000), 4) *
      (61 - 58 * pow(tan(Bvn2000), 2) + pow(tan(Bvn2000), 4))) /
    360;
  let A1 = 1 + (3 * pow(e, 2)) / 4 + (45 * pow(e, 4)) / 64;
  let A2 = (3 * pow(e, 2)) / 8 + (15 * pow(e, 4)) / 32;
  let A3 = (15 * pow(e, 4)) / 256;
  let xB =
    a *
    (1 - pow(e, 2)) *
    (A1 * Bvn2000 - A2 * sin(2 * Bvn2000) + A3 * sin(4 * Bvn2000));

  let xvn2000 =
    k0 *
    (xB +
      (pow(l, 2) / 4) *
        N *
        sin(2 * Bvn2000) *
        (1 + Ax1 * pow(l, 2) + Ax2 * pow(l, 4)));

  let yvn2000 =
    k0 * l * N * cos(Bvn2000) * (1 + Ay1 * pow(l, 2) + Ay2 * pow(l, 4)) +
    500000;
  let zvn2000 = Hvn2000;

  return [xvn2000, yvn2000, zvn2000];
};
export const convertWgs84ToVn2000 = ([Bwgs84, Lwgs84, Hwgs84]: number[]) => {
  let wgs84XY = convertWgs84BLToWgs84XY([Bwgs84, Lwgs84, Hwgs84]);
  let vn2000XY = convertWgs84XYToVn2000XY(wgs84XY);

  let vn2000BL = convertVn2000XYToVn2000BL(vn2000XY);
  return convertVn2000XYToVn2000xy(vn2000BL);
};
