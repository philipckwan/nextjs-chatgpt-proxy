import {timeLog} from "@/lib/PCKUtils";
import {useEffect, useState} from 'react'
import {Constants} from "../lib/Constants";
import hljs from "highlight.js";
import 'highlight.js/styles/base16/solarized-dark.css';
import ReactHtmlParser from 'react-html-parser'; 

const CODE = `def print_board(board):
print("---------")
for i in range(3):
    print("|", end=" ")
    for j in range(3):
        print(board[i][j], end=" | ")
    print("\n---------")

def check_winner(board, player):
# Check rows
for i in range(3):
    if all(board[i][j] == player for j in range(3)):
        return True

# Check columns
for j in range(3):
    if all(board[i][j] == player for i in range(3)):
        return True

# Check diagonals
if board[0][0] == board[1][1] == board[2][2] == player:
    return True

if board[0][2] == board[1][1] == board[2][0] == player:
    return True

return False

def play_game():
board = [[' ' for _ in range(3)] for _ in range(3)]
current_player = 'X'
is_game_over = False

print("Welcome to Tic-Tac-Toe!")

while not is_game_over:
    print_board(board)
    print(f"Player {current_player}'s turn.")

    # Get the desired move from the player
    row = int(input("Enter the row (0-2): "))
    col = int(input("Enter the column (0-2): "))

    # Check if the move is valid
    if board[row][col] != ' ':
        print("Invalid move. Try again.")
        continue

    # Make the move
    board[row][col] = current_player

    # Check for a winner
    if check_winner(board, current_player):
        print_board(board)
        print(f"Player {current_player} wins!")
        is_game_over = True
    elif all(board[i][j] != ' ' for i in range(3) for j in range(3)):
        print_board(board)
        print("It's a tie!")
        is_game_over = True

    # Switch players
    current_player = 'O' if current_player == 'X' else 'X'

play_game()`;

const CODE2 = `
for i in range(1, 11):
    print(i)
    `;

export function CodeHighlight({code}) {

  const [codeHighlighted, setCodeHighlighted] = useState("");

  useEffect(() => {
    timeLog(`CodeHighlight.useEffect[code]: 1.0;`);
    setCodeHighlighted(ReactHtmlParser(hljs.highlightAuto(code).value));
  }, [code]);

  return(
    <>
      <div className="border-2 rounded-md text-sm">
        <pre>{codeHighlighted}</pre>
      </div>
    </>
  )
}
