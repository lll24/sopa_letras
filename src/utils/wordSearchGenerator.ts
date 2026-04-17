// Agrega estas nuevas interfaces al inicio del archivo
export interface WordPosition {
  word: string;
  positions: { row: number; col: number }[];
  direction: string;
}

export interface WordSearchData {
  grid: string[][];
  words: string[];
  wordPositions: WordPosition[]; // Nueva propiedad
}

const DIRECTIONS = [
  { row: 0, col: 1, name: "horizontal" }, // horizontal right
  { row: 1, col: 0, name: "vertical" }, // vertical down
  { row: 1, col: 1, name: "diagonal-down-right" }, // diagonal down-right
  { row: 1, col: -1, name: "diagonal-down-left" }, // diagonal down-left
];

// AQUÍ ESTÁ EL CAMBIO: Agregamos modoFacil: boolean = false
export const generateWordSearch = (words: string[], size: number = 10, modoFacil: boolean = false): WordSearchData => {
  const grid: string[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(""));

  const placedWords: string[] = [];
  const wordPositions: WordPosition[] = []; // Nueva variable para guardar posiciones

  // Try to place each word
  words.forEach((word) => {
    const upperWord = word.toUpperCase();
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (canPlaceWord(grid, upperWord, row, col, direction, size)) {
        const positions = placeWord(grid, upperWord, row, col, direction);
        placedWords.push(word);
        wordPositions.push({
          word: word,
          positions: positions,
          direction: direction.name,
        });
        placed = true;
      }
      attempts++;
    }
  });

  // AQUÍ ESTÁ EL OTRO CAMBIO: Fill empty cells with random letters o espacios en blanco
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === "") {
        // Si modoFacil es true, ponemos un espacio. Si no, una letra al azar.
        grid[i][j] = modoFacil ? " " : String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return { grid, words: placedWords, wordPositions }; // Ahora retorna wordPositions también
};

const canPlaceWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: { row: number; col: number; name: string },
  size: number,
): boolean => {
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * direction.row;
    const newCol = col + i * direction.col;

    if (
      newRow < 0 ||
      newRow >= size ||
      newCol < 0 ||
      newCol >= size ||
      (grid[newRow][newCol] !== "" && grid[newRow][newCol] !== word[i])
    ) {
      return false;
    }
  }
  return true;
};

// Modifica placeWord para que retorne las posiciones
const placeWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: { row: number; col: number; name: string },
): { row: number; col: number }[] => {
  const positions: { row: number; col: number }[] = [];

  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * direction.row;
    const newCol = col + i * direction.col;
    grid[newRow][newCol] = word[i];
    positions.push({ row: newRow, col: newCol });
  }

  return positions;
};

// Los WORD_THEMES y getRandomThemeKey se mantienen igual...
export const WORD_THEMES = {
  lenguajes: ["CPP", "TYPESCRIPT", "PYTHON", "JAVA", "RUST", "GOLANG", "SWIFT"],
  frameworks: ["REACT", "VUE", "ANGULAR", "NEXTJS", "EXPRESS", "DJANGO", "SPRING"],
  herramientas: ["GIT", "DOCKER", "WEBPACK", "VSCODE", "POSTMAN", "FIGMA", "JEST"],
  tiposDatos: ["STRING", "NUMBER", "BOOLEAN", "ARRAY", "OBJECT", "NULL", "UNDEFINED"],
  basesDatos: ["MYSQL", "POSTGRES", "MONGODB", "REDIS", "SQLITE", "CASSANDRA", "ELASTIC"],
};

export const getRandomThemeKey = () => {
  const themes = Object.keys(WORD_THEMES);
  const randomIndex = Math.floor(Math.random() * themes.length);
  return themes[randomIndex];
};