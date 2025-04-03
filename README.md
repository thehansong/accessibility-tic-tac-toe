# Accessibility Tic Tac Toe – AET-swe_OngYouYang
**Email**: [thehansong@gmail.com](mailto:thehansong@gmail.com)  
**LinkedIn**: [thehansong](https://www.linkedin.com/in/thehansong/)

A screen reader-friendly multiplayer Tic Tac Toe game designed for inclusive gaming.

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

---

