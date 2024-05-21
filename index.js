import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
const baseURL = "https://api.mangadex.org";
const imgURL = "https://uploads.mangadex.org/covers/"
app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
    res.render("index.ejs");
})

app.get("/search",async (req,res)=>{
    try {
        const params = { title: req.query.title };
        const response = await axios.get(`${baseURL}/manga`, { params });
        
        const mangaList = await Promise.all(response.data.data.map(async manga => {
            const coverRelationship = manga.relationships.find(rel => rel.type === "cover_art");

            if (coverRelationship) {
                const coverId = coverRelationship.id;
                const coverFilenameResponse = await axios.get(`${baseURL}/cover/${coverId}`);
                const coverFilename = coverFilenameResponse.data.data.attributes.fileName;
                const coverUrl = `${imgURL}${manga.id}/${coverFilename}`;
                return {
                    id: manga.id,
                    title: manga.attributes.title.en,
                    description: manga.attributes.description.en,
                    cover: coverUrl
                };
            } else {
                return {
                    id: manga.id,
                    title: manga.attributes.title.en,
                    description: manga.attributes.description.en,
                    cover: null
                };
            }
        }));

        res.render("search.ejs", { mangaList });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.get('/title/:id/:title' , async (req, res) =>{
    console.log("starting");
    try{
        const {id} = req.params;
        const mangaResponse = await axios.get(`${baseURL}/manga/${id}`);
        const mangadata = mangaResponse.data.data;
        console.log("Manga Data");
        
        const coverRelationship = mangadata.relationships.find(rel => rel.type === 'cover_art');
        const authorRelationship = mangadata.relationships.find(rel => rel.type === 'author');
        console.log("Author and Cover Relationship Data");

        const coverId = coverRelationship ? coverRelationship.id : null;
        const authorId = coverRelationship ? authorRelationship.id : null;

        const coverFilename = coverId ? (await axios.get(`${baseURL}/cover/${coverId}`)).data.data.attributes.fileName : null;
        const authorName = authorId ? (await axios.get(`${baseURL}/author/${authorId}`)).data.data.attributes.name : 'Unknown';

        console.log("Got Author name and file name");
        console.log(authorName );

        const coverURL = coverFilename ? `${imgURL}${id}/${coverFilename}` : null;

         // Fetch all chapters with pagination
         let chapters = [];
         let offset = 0;
         const limit = 100; // Maximum number of chapters per request
         let hasMoreChapters = true;
 
         while (hasMoreChapters) {
             const chapterResponse = await axios.get(`${baseURL}/manga/${id}/feed`, { 
                 params: { 
                     translatedLanguage: ['en'],
                     order: { chapter: 'desc' },
                     limit,
                     offset
                 }
             });
 
             const fetchedChapters = chapterResponse.data.data.map(chapter => ({
                 id: chapter.id,
                 chapterNumber: chapter.attributes.chapter,
                 title: chapter.attributes.title,
             }));
 
             chapters = chapters.concat(fetchedChapters);
             offset += limit;
 
             if (fetchedChapters.length < limit) {
                 hasMoreChapters = false;
             }
         }
         console.log("Fetched Chapters:", chapters.length);

        const manga = {
            id : mangadata.id,
            title : mangadata.attributes.title.en,
            description : mangadata. attributes.description.en,
            publishedData : mangadata.attributes.createdAt,
            lastUpdate : mangadata.attributes.updatedAt,
            cover: coverURL,
            author: authorName

        }
        console.log(coverURL);
        console.log("fetched manga");

        res.render("detail.ejs", {manga, chapters});

        console.log("details loading")
    }
    catch(error) {
        res.status(404).status(error.message);
    }
})

app.get("/chapter/:id", async (req, res)=>{
    try{
        const { id } = req.params;
        const chapterResponse = await axios.get(`${baseURL}/at-home/server/${id}`);
        const { baseUrl, chapter } = chapterResponse.data;
        const { hash, data: imageFilenames } = chapter;
        const chapurl = imageFilenames.map(filename => `${baseUrl}/data/${hash}/${filename}`);
      
      console.log("got url");

      const chapterDetails = await axios.get(`${baseURL}/chapter/${id}`);
      const mangaId = chapterDetails.data.data.relationships.find(rel => rel.type === 'manga').id;
      

        let chapters = [];
        let offset = 0;
        const limit = 100; // Maximum number of chapters per request
        let hasMoreChapters = true;

        while (hasMoreChapters) {
            const chapterResponse = await axios.get(`${baseURL}/manga/${mangaId}/feed`, {
                params: {
                    translatedLanguage: ['en'],
                    order: { chapter: 'desc' },
                    limit,
                    offset
                }
            });

            const fetchedChapters = chapterResponse.data.data.map(chapter => ({
                id: chapter.id,
                chapterNumber: chapter.attributes.chapter,
                title: chapter.attributes.title,
            }));

            chapters = chapters.concat(fetchedChapters);
            offset += limit;

            if (fetchedChapters.length < limit) {
                hasMoreChapters = false;
            }
        }

        // Find the index of the current chapter
        const currentIndex = chapters.findIndex(chap => chap.id === id);
        const prevChapterId = currentIndex > 0 ? chapters[currentIndex - 1].id : null;
        const nextChapterId = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1].id : null;

        res.render("chapter.ejs", { chapurl, prevChapterId, nextChapterId });

    }
    catch(error) {
        res.status(404).status(error.message);
    }
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})