import { BOARD_SIZE, type BoardState } from '../types';

export const calculateTerritory = (board: BoardState): number[][] => {
    // Initialize 19x19 grid with 0
    const territory: number[][] = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));

    // Simple Influence Model
    // Each stone exerts influence that decays with distance.
    const decay = 0.5;
    const maxDist = 6;

    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const stone = board[y][x];
            if (stone) {
                const value = stone === 'black' ? 1 : -1;

                // Set the stone itself
                territory[y][x] = value;

                // Radiate influence
                // Optimization: limit to maxDist box
                const minY = Math.max(0, y - maxDist);
                const maxY = Math.min(BOARD_SIZE - 1, y + maxDist);
                const minX = Math.max(0, x - maxDist);
                const maxX = Math.min(BOARD_SIZE - 1, x + maxDist);

                for (let iy = minY; iy <= maxY; iy++) {
                    for (let ix = minX; ix <= maxX; ix++) {
                        if (ix === x && iy === y) continue; // Already set

                        const dist = Math.abs(ix - x) + Math.abs(iy - y); // Manhattan distance is faster and sufficient for simple mocks
                        // Or Euclidean: const dist = Math.sqrt((ix-x)**2 + (iy-y)**2);

                        // Using Manhattan for "diamond" shape influence which is okay for Go
                        if (dist <= maxDist) {
                            const influence = value * Math.pow(decay, dist);
                            // Add influence, but clamp it? Or just sum.
                            // Katrain's is probability.
                            // Let's just sum for now and normalize later if needed.
                            // Or better: use a "soft max" or similar accumulation.
                            // Simple sum is fine for visualization mock.
                            territory[iy][ix] += influence;
                        }
                    }
                }
            }
        }
    }

    // Normalize and Clamp values to -1 to 1
    // Sigmoid function to squash sums into probability-like values
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            // Check if there is a stone there
            if (board[y][x] === 'black') territory[y][x] = 1;
            else if (board[y][x] === 'white') territory[y][x] = -1;
            else {
                // Sigmoid: 1 / (1 + e^-x) -> ranges 0 to 1.
                // We want -1 to 1.
                // Tanh: (e^x - e^-x) / (e^x + e^-x) -> ranges -1 to 1.
                territory[y][x] = Math.tanh(territory[y][x]);
            }
        }
    }

    return territory;
};
