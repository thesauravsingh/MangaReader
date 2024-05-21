
# Manga Reader

Manga Reader is a web application that allows users to search for manga, view details, and read chapters. The application leverages the MangaDex API to fetch manga data, covers, and chapter images.

## Features

- **Search for Manga**: Users can search for manga by title.
- **View Manga Details**: View details such as the author, publish date, last update, and cover image.
- **Read Chapters**: Users can read chapters with images displayed at 80% of the screen width.

## Tech Stack

- **Express**: Node.js framework for building the server.
- **EJS**: Template engine for rendering HTML pages.
- **Axios**: HTTP client for making API requests.
- **CSS**: Styling the application.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/manga-reader.git
   cd manga-reader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the server**
   ```bash
   npm start
   ```

4. **Visit the application**
   Open your browser and go to `http://localhost:3000`.

## Project Structure

```
manga-reader/
├── public/
│   ├── images/
│   └── styles/
│       └── content.css
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── search.ejs
│   ├── detail.ejs
│   └── chapter.ejs
├── app.js
└── package.json
```

## API Usage

The application uses the MangaDex API to fetch manga details and chapters. Below are some of the key API endpoints used:

- **Search Manga**: `/manga?title=<title>`
- **Manga Details**: `/manga/<id>`
- **Manga Chapters**: `/manga/<id>/feed`
- **Chapter Images**: `/at-home/server/<chapterId>`

## Detailed Functionality

### Search

The search functionality allows users to enter a manga title and fetches a list of manga that match the search criteria.

### View Manga Details

When a user clicks on a manga title, they are redirected to a detail page where they can view the manga's author, publish date, last update, and cover image.

### Read Chapters

Users can click on a chapter to read it. The chapter images are fetched from the MangaDex API and displayed at 80% of the screen width. Navigation buttons are available at the top and bottom of the page to go to the previous or next chapter.

## Contributing

Feel free to submit issues and pull requests to help improve the project. Contributions are always welcome!

1. **Fork the repository**
2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add some feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a pull request**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [MangaDex API](https://api.mangadex.org) for providing the manga data and images.
- [Express](https://expressjs.com/) for the Node.js framework.
- [EJS](https://ejs.co/) for the template engine.
- [Axios](https://axios-http.com/) for the HTTP client.


