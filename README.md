# PetMoji

A web app where you upload a picture of your pet's face, and an AI identifies the pet's face and assigns a personality-matching emoji.

This is a Next.js project bootstrapped with `create-next-app` and configured for Firebase Studio.

## Running Locally

To run this project in your local development environment using Visual Studio Code, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/en) (version 20 or later)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   An API key for the Gemini API. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Set Up Environment Variables

You'll need to provide your Gemini API key to the application.

1.  Create a new file named `.env` in the root of the project.
2.  Add the following line to the `.env` file, replacing `<YOUR_API_KEY>` with your actual key:

    ```
    GEMINI_API_KEY=<YOUR_API_KEY>
    ```

### 2. Install Dependencies

Open a terminal in VS Code (`View` > `Terminal`) and run the following command to install the necessary packages:

```bash
npm install
```

### 3. Run the Development Servers

This project requires two development servers to be running simultaneously:

*   The **Genkit AI server** for handling the AI logic.
*   The **Next.js server** for the frontend application.

You can open two separate terminals in VS Code to run them.

*   **In your first terminal**, start the Genkit server:
    ```bash
    npm run genkit:dev
    ```
    Wait until you see a message indicating that the server has started.

*   **In your second terminal**, start the Next.js frontend server:
    ```bash
    npm run dev
    ```

### 4. Open the App

Once both servers are running, you can open your web browser and navigate to [http://localhost:9002](http://localhost:9002) to see the application in action.
