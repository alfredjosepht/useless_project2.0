<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />


# [PetMoji] 🎯


## Basic Details
### Team Name: [The sternritter]


### Team Members
- Team Lead: [Alfred Joseph T] - [NSS College of Engineering,Akathethara]
- Member 2: [Akash S] - [NSS College of Engineering,Akathethara]
- Member 3: [Name] - [College]

### Project Description
[This project takes a photo of your pet’s face, uses AI to recognize its features, and matches it with the closest expression. It then generates a fun emoji and a witty, hilarious comment describing your pet’s “mood,” making every scan a laugh-filled moment.]

### The Problem (that doesn't exist)
[Pet owners often wonder what their pets might be “thinking” or “feeling,” but animals can’t express emotions in human language. There is no fun, interactive way to interpret a pet’s expressions in real-time, leaving owners guessing. An AI-powered tool that recognizes a pet’s face and humorously translates its expression into relatable emojis and witty comments can bridge this gap, providing entertainment and engagement for pet lovers.]

### The Solution (that nobody asked for)
[Develop an AI-powered application that detects and recognizes a pet’s face from an image, analyzes its facial features, and maps them to emotion categories. The system will then display a matching emoji and generate a witty, humorous comment that reflects the pet’s “mood.” This playful interpretation not only entertains pet owners but also enhances engagement through sharable, personalized pet content.]

## Technical Details
### Technologies/Components Used
For Software:
- [Typescript,CSS,HTML]
- [Next.js,Genkit AI Server]
- [React,Next.js,Axios or fetch,Genkit AI server]
- [Node.js and npm,Visual Studio Code,Git and GitHub,Linux shell]

For Hardware:
- [hardware with at least Intel i/Ryzen 3 CPU]
- [List specifications]
- [List tools required]

### Implementation
For Software:Prerequisites
Node.js (version 20 or later)
npm (usually comes with Node.js)
An API key for the Gemini API. You can get one from Google AI Studio.
# Installation
[ou'll need to provide your Gemini API key to the application.

Create a new file named .env in the root of the project.

Add the following line to the .env file, replacing <YOUR_API_KEY> with your actual key:

GEMINI_API_KEY=<YOUR_API_KEY>
npm install
npm run genkit:dev
npm run dev]

# Run
[commands]

### Project Documentation
For Software:

# Screenshots (Add at least 3)
![the first window of petmoji ai](https://drive.google.com/uc?export=view&id=1rOym6Hq3NUl6NoqdzRpOULBWqzLH2n05)

![selecting the image from storage](https://drive.google.com/uc?export=view&id=1mpId7PWgsabqhAC36dtyQkdeMAJ10jMc)

![the working of the petmoji ai](https://drive.google.com/uc?export=view&id=1btS-phQHHPiIJggQXYxM-nMBHKXCme9Z)

![it also shows the history of the images given](https://drive.google.com/uc?export=view&id=1Zq7OsCUwKkUIbVAf-55eOo9Heub1Oslc)





# Diagrams
Project Workflow: AI-Powered Pet Emotion Detector
User Uploads Pet Image

The user visits the web app and uploads a photo of their pet's face via the frontend interface (Next.js app).

Image Sent to AI Backend

The uploaded image is sent from the frontend to the Genkit AI server (backend) via an API call.

Pet Face Detection and Recognition

The AI server processes the image using a pet face detection model to locate the pet's face in the image.

The system recognizes the pet type or individual identity if applicable.

Facial Feature Analysis & Emotion Mapping

The detected pet face is analyzed for facial features and expressions.

Features are mapped to predefined emotion categories (happy, sad, playful, curious, etc.).

Generate Emoji and Mood Comment

Based on the detected emotion, the system selects a matching emoji representing the pet’s mood.

A witty, humorous comment is generated reflecting the pet’s personality and mood.

Response Sent Back to Frontend

The emoji and mood comment are sent back from the AI server to the Next.js frontend.

Display Results to User

The frontend displays the original pet image alongside the matched emoji and generated mood comment.

Users can share this personalized pet “mood” content on social media or download it.

User -> Upload Image (Next.js frontend) 
    -> Sends image -> Genkit AI Server
    -> Detect pet face & analyze emotion
    -> Generate emoji + witty comment
    -> Return results -> Frontend display
    -> User views/shares petmoji


### Project Demo
# Video
![it is the demo video of PetMoji(https://drive.google.com/uc?export=view&id=0B820HxYEF5Epc3RhcnRlcl9maWxl)

*it shows that if we uplaud the image of our pet PetMoji will give recognise the face and give expressions of the pet in form of emoji and give comments .a
It also shows the history of our activity*

# Additional Demos
[Add any extra demo materials/links]

## Team Contributions
- [Akash s] : [done the framework and frontend]
- [Alfred Joseph T]: [made backend and work with the pretrained AI ]


---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)


