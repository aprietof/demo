'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

/**
 *
 * Game (how it works)
 *
 * Board: [7,5,6,5,3,5,7,3,6,7,7,4,2,2,3,7,4,7,5,3,6,7,7,5,7].length
 *
 * 1. Start at level 1
 * 2. should be able to click on tile
 * 3. when you click on it the game should check if that tile is the death tile
 * 4. if it is the death tile GAME OVER
 * 5. if is not go up one level and update the score
 *
 * Requirements:
 *
 * 1. Print the board [x]
 * 2. being able to click o any tile of the current row (level) [x]
 * 3. add some sort click handler to all the tiles -> (to know what tile we clicked) -> handleTileClick() [x]
 * - The tile location in the curren (level) [x]
 * - getting the death tile for that (level) [x]
 * - compare the current tile with the death tile (value) [x]
 * - if death tile game over [x]
 * - if is not increase the level [x]
 * - game over side effects (visual)
 * - update the score []
 *
 *
 * Process:
 *
 * board = [
 *  { id: 0, value: [{id: 0, value: 0}, {id: 1, value: 1}, {}]}, -> row
 *  { }
 * ]
 *
 */

export default function Home() {
  const tiles = [7, 5, 6, 5, 3, 5, 7, 3, 6, 7, 7, 4, 2, 2, 3, 7, 4, 7, 5, 3, 6, 7, 7, 5, 7];
  const board = tiles.map((length, rowIdx) =>
    // row
    ({
      id: rowIdx,
      value: Array.from({ length }, (_, colIdx) => ({
        id: `${rowIdx}-${colIdx}`,
        value: colIdx,
        row: rowIdx,
        length,
      })),
    }),
  );

  // State
  const [gameOver, setGameOver] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [deathTile, setDeathTile] = useState<number[] | null>(null);

  // Functions
  const handleTileClick = (e: React.MouseEvent) => {
    if (gameOver) return;

    const btn = (e.target as HTMLElement).closest('button[data-id]') as HTMLElement;

    if (!btn) return;

    const currentTileValue = parseInt(btn.dataset.value as string);
    const currentRow = parseInt(btn.dataset.row as string);
    const currentRowLength = parseInt(btn.dataset.rowLen as string);
    const currentDeathTile = getDeathTile(currentRowLength);

    // compare the current tile with the death tile (value)
    const isDeathTile = currentDeathTile === currentTileValue; // ->

    console.log(isDeathTile);

    // if death tile game over
    if (isDeathTile) {
      console.log([currentRow, currentTileValue]);
      // Game over
      setDeathTile([currentRow, currentTileValue]);
      setGameOver(true);
      return;
    }

    // if is not increase the level
    setCurrentLevel((prevLevel) => prevLevel + 1);
  };

  const getDeathTile = (rowLen: number) => {
    // call to server...
    // return Math.floor(Math.random() * rowLen);
    return 0;
  };

  return (
    <div
      className="h-full bg-black flex-col-reverse flex overflow-auto gap-4 items-center"
      onClick={handleTileClick}
    >
      {board.map((row, rowIdx) => (
        // Row
        <div
          key={row.id}
          className={cn(
            'flex gap-2 min-w-[600px] bg-gray-800 p-4 justify-center items-center rounded-sm',
            currentLevel === row.id && 'border-[2px] border-green-500',
            currentLevel === row.id && gameOver && 'border-[2px] border-red-500',
          )}
        >
          {row.value.map((col, colIdx) => {
            const isDeathCell =
              deathTile?.length === 2 && deathTile[1] === col.value && deathTile[0] === row.id;

            return (
              // Cell
              <div key={col.id} className={cn('aspect-square w-1/7 bg-gray-900 rounded-sm')}>
                <button
                  className="size-full cursor-pointer disabled:cursor-not-allowed"
                  data-id={col.id}
                  data-row-len={col.length}
                  data-row={row.id}
                  data-value={col.value}
                  disabled={gameOver}
                >
                  {gameOver && isDeathCell ? <span className="text-white">You Died</span> : null}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
