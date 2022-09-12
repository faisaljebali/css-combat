{
    "name": "realtime-editor",
    "version": "0.1.0",
    "private": true,
    "main": "server.js",
    "dependencies": {
      "@testing-library/jest-dom": "^5.16.2",
      "@testing-library/react": "^12.1.3",
      "@testing-library/user-event": "^13.5.0",
      "codemirror": "^5.65.2",
      "cors": "^2.8.5",
      "express": "^4.17.3",
      "node-fetch": "^3.2.10",
      "react": "^17.0.2",
      "react-avatar": "^4.0.0",
      "react-dom": "^17.0.2",
      "react-hot-toast": "^2.2.0",
      "react-router-dom": "^6.2.1",
      "react-scripts": "5.0.0",
      "socket.io": "^4.4.1",
      "socket.io-client": "^4.4.1",
      "uuid": "^8.3.2",
      "web-vitals": "^2.1.4"
    },
    "scripts": {
      "start:front": "react-scripts start",
      "start": "npm run build && npm run server:prod",
      "watch": "npm run start:front && npm run server:prod",
      "build": "react-scripts build",
      "server:dev": "nodemon server.js",
      "server:prod": "node server.js",
      "test": "react-scripts test",
      "eject": "react-scripts eject"
    },
    "eslintConfig": {
      "extends": [
        "react-app",
        "react-app/jest"
      ]
    },
    "browserslist": {
      "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
      ],
      "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ]
    },
    "devDependencies": {
      "nodemon": "^2.0.15"
    }
  }
  