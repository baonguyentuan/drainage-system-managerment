
const PI = Math.PI
const L0 = 105
export let convertDegToRad = (degree:number) => {
    return degree * PI / 180
}
export let pow = (a:number, b:number) => {
    return Math.pow(a, b)
}
export let sqrt = (a:number) => {
    return Math.sqrt(a)
}
export let sin = (a:number) => {
    return Math.sin(a)
}
export let cos = (a:number) => {
    return Math.cos(a)
}
export let tan = (a:number) => {
    return Math.tan(a)
}
const a = 6378137.0;
const f = 1 / 298.257223563;
let b = a - f * a
const w = 7292115.0 * Math.pow(10, -11);
const GM = 3986005.108;
const k0 = 0.9999
let e = sqrt((pow(a, 2) - pow(b, 2)) / pow(a, 2))
let eSub = sqrt((pow(a, 2) - pow(b, 2)) / pow(b, 2))
//B1: convert vn2000(x,y) to vn2000(b,l)
const convertVn2000xyToVn2000BL = ([xVN2000, yVN2000, zVN2000]:number[] = []) => {
    let mu = xVN2000 / (k0 * a * (1 - pow(e, 2) / 4 - 3 * pow(e, 4) / 64 - 5 * pow(e, 6) / 256))
    let a1 = (1 - sqrt(1 - pow(e, 2))) / (1 + sqrt(1 - pow(e, 2)))
    let B1 = mu + (3 * a1 / 2 - 27 * pow(a1, 3) / 32) * sin(2 * mu) + (21 * pow(a1, 2) / 16 - 55 * pow(a1, 4) / 32) * sin(4 * mu) + 151 * pow(a1, 3) * sin(6 * mu) / 96
    let N1 = a / sqrt(1 - pow(e * sin(B1), 2))
    let C1 = pow(eSub * cos(B1), 2)
    let R1 = a * (1 - pow(e, 2)) / pow(1 - pow(e * sin(B1), 2), 3 / 2)
    let D = (yVN2000 - 500000) / (k0 * N1)
    let Bvn2000 = B1 - (N1 * tan(B1) / R1) * (pow(D, 2) / 2 - pow(D, 4) * (5 + 3 * pow(tan(B1), 2) + 10 * C1 - 4 * pow(C1, 2) - 9 * pow(eSub, 2)) / 24 + pow(D, 6) * (61 + 90 * pow(tan(B1), 2) + 29 * C1 + 45 * pow(tan(B1), 4) - 3 * pow(C1, 2) - 252 * pow(eSub, 2)) / 720)
    let Lvn2000 = L0 * PI / 180 + (1 / cos(B1)) * (D - pow(D, 3) * (1 + 2 * pow(tan(B1), 2) + C1) / 6 + pow(D, 6) * (5 - 2 * C1 + 28 * pow(tan(B1), 2) - 3 * pow(C1, 2) + 8 * pow(eSub, 2) + 24 * pow(tan(B1), 4)) / 120)
    let Hvn2000 = zVN2000
    return [Bvn2000 * 180 / PI, Lvn2000 * 180 / PI, Hvn2000]

}
//B2: convert vn2000(x,y) to Vn2000(X,Y)
const convertVn2000BLToVn2000XY = ([Bvn2000, Lvn2000, Hvn2000]:number[]) => {
    Bvn2000 = convertDegToRad(Bvn2000)
    Lvn2000 = convertDegToRad(Lvn2000)
    let N = a / sqrt(1 - pow(e * sin(Bvn2000), 2))
    let Xvn2000 = (N + Hvn2000) * cos(Bvn2000) * cos(Lvn2000)
    let Yvn2000 = (N + Hvn2000) * cos(Bvn2000) * sin(Lvn2000)
    let Zvn2000 = (pow(b / a, 2) * N + Hvn2000) * sin(Bvn2000)
    return [Xvn2000, Yvn2000, Zvn2000]
}
//B3: convert vn2000(X,Y) to wgs84(X,Y)
const convertVn2000XYToWgs84XY = ([Xvn2000, Yvn2000, Zvn2000]:number[]) => {
    let deltaX0 = -191.90441429
    let deltaY0 = -39.30318279
    let deltaZ0 = -111.45032835
    let omega0 = convertDegToRad(-0.00928836 / 3600)
    let psi0 = convertDegToRad(0.01975479 / 3600)
    let epsilon0 = convertDegToRad(-0.00427372 / 3600)
    let kappa = 1.000000252906278
    let Xwgs84 = deltaX0 + kappa * (Xvn2000 + epsilon0 * Yvn2000 - psi0 * Zvn2000)
    let Ywgs84 = deltaY0 + kappa * (-epsilon0 * Xvn2000 + Yvn2000 + omega0 * Zvn2000)
    let Zwgs84 = deltaZ0 + kappa * (psi0 * Xvn2000 - omega0 * Yvn2000 + Zvn2000)
    return [Xwgs84, Ywgs84, Zwgs84]
}

//B4: convert wgs84(X,Y) to wgs84(B,L)
const convertWgs84XYToWgs84BL = ([Xwgs84, Ywgs84, Zwgs84]:number[]) => {

    let gamma = Math.atan(Zwgs84 * (1 - f + a * pow(e, 2) / ((sqrt(pow(Xwgs84, 2) + pow(Ywgs84, 2) + pow(Zwgs84, 2))))) / sqrt(pow(Xwgs84, 2) + pow(Ywgs84, 2)))
    let Bwgs84 = Math.atan((Zwgs84 * (1 - f) + a * pow(e, 2) * pow(sin(gamma), 3)) / ((1 - f) * (sqrt(pow(Xwgs84, 2) + pow(Ywgs84, 2)) - a * pow(e, 2) * pow(cos(gamma), 3))))
    let Lwgs84 = Math.atan(Ywgs84 / Xwgs84)
    if (Lwgs84 < 0) {
        Lwgs84 += PI
    } else if (Lwgs84 > 2 * PI) {
        Lwgs84 -= 2 * PI
    }
    let Hwgs84 = cos(Bwgs84) * sqrt(pow(Xwgs84, 2) + pow(Ywgs84, 2)) + Zwgs84 * sin(Bwgs84) - a * sqrt(1 - pow(e * sin(Bwgs84), 2))
    return [Bwgs84 * 180 / PI, Lwgs84 * 180 / PI, 0]

}
export const convertVn2000ToWgs84 = ([xVN2000, yVN2000, zVN2000]:number[] = []) => {
    let vn2000BL = convertVn2000xyToVn2000BL([xVN2000, yVN2000, zVN2000])
    let vn2000XY = convertVn2000BLToVn2000XY(vn2000BL)
    let wgsXY = convertVn2000XYToWgs84XY(vn2000XY)
    let wgsBL = convertWgs84XYToWgs84BL(wgsXY)
    return wgsBL;

}