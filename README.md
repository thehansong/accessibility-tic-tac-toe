# Accessibility Tic Tac Toe – AET-swe_OngYouYang
A screen reader-friendly multiplayer Tic Tac Toe game designed for D&I gaming.

This README is best viewed directly on [GitHub](https://github.com/thehansong/accessibility-tic-tac-toe) for proper formatting and image rendering guide.

Contact:
**Name**: Ong You Yang (Hans)  
**Email**: [thehansong@gmail.com](mailto:thehansong@gmail.com)  
**LinkedIn**: [thehansong](https://www.linkedin.com/in/thehansong/)

### ⚠️ Disclaimer
Due to the tight deadline and ongoing examinations, this implementation is a functional prototype focused on core features and key accessibility elements.

---

### Hosting / Deployment Notes

This application is intended to be run **locally**, as per project scope. 

---

### Setup & Prerequisite
- **[Node.js v18 or above](https://nodejs.org/en/download/)** – Required to run the project locally

  You can check your version of Node.js with:
    ```
    node -v
    ```
- **MongoDB URI** – _No local installation needed_  
  A shared MongoDB Atlas URI is provided in the `.env.local` setup step 3 below.

---

### Steps to Run Locally
1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/accessibility-tic-tac-toe.git
    cd accessibility-tic-tac-toe
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Create a `.env.local` file in the root directory**
    <p align="center">
      <img src="https://github.com/user-attachments/assets/1d547449-5b0d-4adf-ac5b-e0eca2757e48" alt="Figure 1: .env.local location" width="500"/>
    </p>
    <p align="center"><strong>Figure 1:</strong> Location of the <code>.env.local</code> file in the root directory</p>
    
    > 📍 **Important**: This `.env.local` file <u><strong>MUST</strong></u> be created in the <u>**root directory**</u> of the project.
    
    As environment variables are not committed to the repo, you'll need to manually create a file called `.env.local` in the root directory of the project, as shown in **Figure 1** above.

    Paste the following into that file to connect to the shared MongoDB database:

    ```env
    MONGODB_URI=mongodb+srv://ticadmin:123@cluster-tictactoe.vivzojd.mongodb.net/tictactoe?retryWrites=true&w=majority&appName=cluster-TicTacToe
    ```

4. **Start the development server**

    ```bash
    npm run dev
    ```

5. **Open your web browser _(Google Chrome)_** and navigate to:

    ```
    http://localhost:3000
    ```

<p align="center">
  <img src="https://github.com/user-attachments/assets/7d1a0196-422a-4093-b94b-6d0a5f8a2240" alt="Figure 2: Main Menu Lobby screen" width="500"/>
</p>
<p align="center"><strong>Figure 2:</strong> The <strong>Main Menu Lobby</strong> screen displayed at <code>http://localhost:3000</code></p>

---

### How to Play / Test the Prototype

6. **Open two separate web browser windows instance**  
     Once you've finished the setup steps above, open the game in **two different browsers** (e.g., Chrome and Incognito mode) or in two tabs on the **SAME device**.
    ```
    http://localhost:3000
    ```

&nbsp;

7. **Join the same Game Session**  
> ⚠️ **To Note:** From the main menu, both players must **select a role** (**X** or **O**) before proceeding.  
> The game will only begin when **both players have joined the same session** with different roles selected.

<p align="center"> <img src="https://github.com/user-attachments/assets/86cebe87-5b5b-4780-961e-0b0bf499e929" alt="Figure 3: Player 1 flow – creating a game" width="500"/> </p> <p align="center"><strong>Figure 3:</strong> Player 1 selects a role and creates a game session using a custom or auto-generated Game ID</p>

- **Player 1 Flow (as seen in Figure 3):**
  - Select a role (**X** or **O**) from the dropdown.
  - Choose one of the following:
    - Enter a **custom Game ID** (e.g., `game123`) and click **"Create Game"**, or
    - Click **"Create Game"** without entering anything to auto-generate a random 6-character Game ID (e.g., `A1B2C3`).
  - The game instance starts in a **paused state**, waiting for Player 2.
  - Share the **Game ID** with Player 2.

<p align="center"> <img src="https://github.com/user-attachments/assets/d124d458-ff0f-4d4f-b686-d7fa0be64354" alt="Figure 4: Player 2 joining the game session" width="500"/> </p> <p align="center"><strong>Figure 4:</strong> Player 2 enters the shared Game ID, selects the available role, and joins the game session</p>

- **Player 2 Flow (as seen in Figure 4):**
  - Paste the shared **Game ID** into the input field on the main menu.
  - Select the **available role** (X or O). The system will automatically disable the role already taken by Player 1.
  - Click **"Join Game"**.

Once both players have joined with valid, distinct roles, the tic tac toe game will begin.

&nbsp;

<p align="center"> <img src="https://github.com/user-attachments/assets/0f878f63-7a91-4dbd-a56f-213013941db3" alt="Figure 5: In-game screen with countdown timer and current turn" width="500"/> </p> <p align="center"><strong>Figure 5:</strong> In-game screen showing the 3x3 grid, current player's turn, and countdown timer</p>

8. **Play the Game (as seen in Figure 5)**
- Players take turns marking empty cells on the 3x3 grid.
- A **15-second countdown timer** is displayed during each player's turn.
- The current turn and game state are synced between both players in real-time using a 1-second polling interval.

&nbsp;

<p align="center"> <img src="https://github.com/user-attachments/assets/ac30a5a5-eb1a-44f2-af22-700547c9da61" alt="Figure 6: End game screen with result and options" width="1000"/> </p> <p align="center"><strong>Figure 6:</strong> Game result screen showing the outcome and options to restart, return to main menu, or view game history</p>

9. **After the Game Ends (as seen in Figure 6)**
- When a player wins or the game ends in a draw:
  - A result announcement will appear showing who won or if it was a draw.
  - Players can click **"Restart Game"** button to play again using the same session GameID.
  - Or, click **"Back to Main Menu"** button to return to the Main Menu lobby and start/join another session.
  - You can also click **"Game History"** button from either the Main Menu or while in game to view a list of past games, including:
    - Player roles (X / O)
    - Move sequences
    - Final game result

---

### Assumptions & Architecture Notes
- I assumed players first select a role (**X** or **O**) from the lobby before joining a game session.
- The game only begins when **two active players** have joined the same lobby (i.e., share the same `GameID`).
- I assumed that a **time limit per move** would be required, so I implemented a **15-second countdown timer**.
- I assumed a **restart feature** would be helpful for testing or replaying, so I added a **"Restart Game"** button after each match.
- I assumed users would want to return easily, so I included a **"Back to Main Menu"** button.
- Game state is persisted using **MongoDB Atlas** and updated in real time via a **1-second polling interval**.
- Player roles are stored using **`localStorage`** to persist identity across refreshes and reloads.
- The following accessibility features were implemented:
  - Semantic HTML and ARIA roles (`grid`, `gridcell`, `aria-live`)
