const MIN_NUMBER = 1;
const MAX_NUMBER = 9;
const GRID_SIZE = 3;

export function generateHexagonMap() {
    const map = Array.from({ length: GRID_SIZE * 2 - 1 }, () =>
        Array.from({ length: GRID_SIZE * 2 - 1 }, () => Array(GRID_SIZE * 2 - 1).fill(0))
    );
    for (let q = 0; q <= GRID_SIZE * 2 - 2; q++) {
        for (let r = 0; r <= GRID_SIZE * 2 - 2; r++) {
            const s = GRID_SIZE * 2 - q - r;
            if (s < 0 || s > GRID_SIZE * 2 - 2) {
                continue;
            }
            map[q][r][s] = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
        }
    }
    return map;
}

export function sumsOfMap(map: any[][][]) {
    let allSums = {};
    for (let q = 0; q <= GRID_SIZE * 2 - 2; q++) {
        for (let r = 0; r <= GRID_SIZE * 2 - 2; r++) {
            for (let s = 0; s <= GRID_SIZE * 2 - 2; s++) {
                const sums = sumsOfNeighbors(map, q, r, s);
                if (sums.length > 0) {
                    for (let i = 0; i < sums.length; i++) {
                        if (allSums[sums[i]]) {
                            allSums[sums[i]]++;
                        } else {
                            allSums[sums[i]] = 1;
                        }
                    }
                }
            }
        }
    }
    return allSums;
}

export function sumsOfNeighbors(map: any[][][], q: number, r: number, s: number) {
    const directions = [
        [1, 0, -1],
        [0, 1, -1],
        [-1, 1, 0]
    ];
    if (map[q][r][s] === 0) {
        return 0;
    }
    const sums = [];
    for (let i = 0; i < directions.length; i++) {
        const dir = directions[i];
        if (
            q + dir[0] * 2 < 0 ||
            q + dir[0] * 2 > GRID_SIZE * 2 - 2 ||
            r + dir[1] * 2 < 0 ||
            r + dir[1] * 2 > GRID_SIZE * 2 - 2 ||
            s + dir[2] * 2 < 0 ||
            s + dir[2] * 2 > GRID_SIZE * 2 - 2
        ) {
            continue;
        }
        const n1 = map[q + dir[0]][r + dir[1]][s + dir[2]];
        const n2 = map[q + dir[0] * 2][r + dir[1] * 2][s + dir[2] * 2];
        if (n1 !== 0 && n2 !== 0) {
            sums.push(map[q][r][s] + n1 + n2);
        }
    }
    return sums;
}

// check if points are neighbors
export function checkNeighbors(points: Array<{ i: number; j: number; k: number }>) {
    const [a, b, c] = points;
    const ab = Math.abs(a.i - b.i) + Math.abs(a.j - b.j) + Math.abs(a.k - b.k);
    const bc = Math.abs(b.i - c.i) + Math.abs(b.j - c.j) + Math.abs(b.k - c.k);
    const ac = Math.abs(a.i - c.i) + Math.abs(a.j - c.j) + Math.abs(a.k - c.k);
    return (ab === 2 && bc === 2) || (ab === 2 && ac === 2) || (bc === 2 && ac === 2);
}
// check if points are on the same line. input is array of points
export function checkSameLine(points: Array<{ i: number; j: number; k: number }>) {
    const [a, b, c] = points;
    return (
        (a.i === b.i && b.i === c.i) || (a.j === b.j && b.j === c.j) || (a.k === b.k && b.k === c.k)
    );
}

export function checkSum(
    map: Array<Array<Array<number>>>,
    points: Array<{ i: number; j: number; k: number }>,
    target: number
) {
    return points.reduce((acc, point) => acc + map[point.i][point.j][point.k], 0) === target;
}
