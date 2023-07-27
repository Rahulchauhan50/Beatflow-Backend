const express = require('express')
const router = express.Router();
const Data = require('../modals/userdata')
const fetchuser = require('../middleware/fetchuser')

router.get('/get-data',fetchuser,async(req,res)=>{
    try {
        const data = await Data.find({ user: req.user.id });
        res.json(data)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
   
})
router.post('/add-favsongs',fetchuser,async(req,res)=>{
    try {
        const {title, key, subtitle, adamid, background, id, coverart, uri} = req.body;

        const existingData = await Data.findOne({ user: req.user.id });
        
        if (existingData) {
            const existingSongIndex = await existingData.FavSongs.findIndex(
                (song) => song.hub.actions[1].uri === uri);

            if(existingSongIndex < 0){
            existingData.FavSongs.push({
                title,
                key,
                subtitle,
                artists: [{ adamid }],
                images: { background, coverart },
                hub: { actions: [{ id},{ uri }] }
              });
            const updatedData = await existingData.save();
            res.json({ updatedData });
        }else{
            res.json({ message:"fav song alreadt exist" });
        }
    }

        else {
            const newData = new Data({
                user: req.user.id,
                FavSongs: [
                  {
                    title,
                    key,
                    subtitle,
                    artists: [{ adamid }],
                    images: { background, coverart },
                    hub: { actions: [{ id }, { uri }] },
                  },
                ],
              });
            const savedData = await newData.save();
            res.json({ savedData });
        }
    } catch (error) {
        res.send(error)
        console.log(error)
    }
   
})
router.post('/IsfavSong',fetchuser,async(req,res)=>{
    try {
        const {uri} = req.body;
        const existingData = await Data.findOne({ user: req.user.id });

        if (existingData) {
            
            const existingSongIndex = await existingData.FavSongs.findIndex(
                (song) => song.hub.actions[1].uri === uri);

                if (existingSongIndex >= 0) {
                    res.json({result:true})
                    return
                }
                res.json({result:false})
        }
        else {
            res.json({result:false})
        }
    } catch (error) {
        res.send(error)
        console.log(error)
    }
   
})
router.post('/IsfavArtist',fetchuser,async(req,res)=>{
    try {
        const {artistId} = req.body;

        const existingData = await Data.findOne({ user: req.user.id });
    if (existingData) {
    
    const existingSongIndex = await existingData.FavArtists.findIndex((artist)=>{
         return artist.ArtistId === artistId
    })
        
        if (existingSongIndex >= 0) {
            
            res.json({result:true,artistId})
            return
        }
                res.json({result:false,artistId})
        }
        else {
            res.json({result:false,artistId})
        }
    } catch (error) {
        res.send(error)
        console.log(error)
    }
   
})
router.post('/add-favArtist',fetchuser,async(req,res)=>{
    try {
        const {title, subTitle, image, ArtistId} = req.body;

        const existingData = await Data.findOne({ user: req.user.id });

        if (existingData) {
            const existingSongIndex = await existingData.FavArtists.findIndex(
                (artist) =>artist.ArtistId === ArtistId);
                
                if(existingSongIndex < 0){
                
                existingData.FavArtists.push({title, subTitle, image, ArtistId});
                const updatedData = await existingData.save();
                res.json({ updatedData });
                }else{
                    res.json({message:"artist is already is fav list" });
                }
        }

        else {
            const newData = new Data({ user: req.user.id, FavArtists: [{ title, subTitle, image, ArtistId }] });
            const savedData = await newData.save();
            res.json({ savedData });
        }
    } catch (error) {
        res.send(error)
        console.log(error)
    }
   
})
router.post('/add-history',fetchuser,async(req,res)=>{
    try {
        const {title, key, subtitle, adamid, background, id, coverart, uri} = req.body;

        const existingData = await Data.findOne({ user: req.user.id });

        if (existingData) {
            const existingSongIndex = await existingData.histories.findIndex(
                (song) => song.hub.actions[1].uri === uri);
                
                if (existingSongIndex >= 0) {
                    existingData.histories.splice(existingSongIndex, 1);
                  }

                
                await existingData.histories.unshift({
                    title,
                    key,
                    subtitle,
                    artists: [{ adamid }],
                    images: { background, coverart },
                    hub: { actions: [{ id }, { uri }] },
                });
                
                
                if (existingData.histories.length > 30) {
                    await existingData.histories.pop(); 
                }
                

                  const updatedData = await existingData.save();
                  res.json({ updatedData });
                  
                }
                else {
                    const newData = new Data({
                user: req.user.id,
                histories: [
                  {
                    title,
                    key,
                    subtitle,
                    artists: [{ adamid }],
                    images: { background, coverart },
                    hub: { actions: [{ id }, { uri }] },
                  },
                ],
              });
            const savedData = await newData.save();
            res.json({ savedData });
        }
    } catch (error) {
        res.send(error)
        console.log(error)
    }
   
})
router.delete('/delete-favsong/:songId', fetchuser, async (req, res) => {
    try {
        const songIdToDelete = req.params.songId;
        const existingData = await Data.findOne({ user: req.user.id });
        if (!existingData) {
            return res.status(404).json({ error: "User's data not found" });
        }

        existingData.FavSongs = await existingData.FavSongs.filter(song => song.key !== songIdToDelete);
        await existingData.save();

        res.json({ message: songIdToDelete});
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
        console.log(error);
    }
});
router.delete('/delete-all-favsong', fetchuser, async (req, res) => {
    try {
        const existingData = await Data.findOne({ user: req.user.id });

        if (!existingData) {
            return res.status(404).json({ error: "User's data not found" });
        }

        existingData.FavSongs = [];
        await existingData.save();

        res.json({ message: 'All Song deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
        console.log(error);
    }
});
router.delete('/delete-artist/:artistid', fetchuser, async (req, res) => {
    try {
        const ArtistIdToDelete = req.params.artistid;
        const existingData = await Data.findOne({ user: req.user.id });

        if (!existingData) {
            return res.status(404).json({ error: "User's data not found" });
        }

        existingData.FavArtists = existingData.FavArtists.filter(artist => artist.ArtistId !== ArtistIdToDelete);
        await existingData.save();

        res.json(ArtistIdToDelete);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
        console.log(error);
    }
});
router.delete('/delete-all-artist', fetchuser, async (req, res) => {
    try {
        const existingData = await Data.findOne({ user: req.user.id });

        if (!existingData) {
            return res.status(404).json({ error: "User's data not found" });
        }

        existingData.FavArtists = [];
        await existingData.save();

        res.json({ message: 'All FavArtists deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
        console.log(error);
    }
});
router.delete('/delete-history/:songId', fetchuser, async (req, res) => {
    try {
        const songIdToDelete = req.params.songId;
        const existingData = await Data.findOne({ user: req.user.id });

        if (!existingData) {
            return res.status(404).json({ error: "User's data not found" });
        }

        existingData.histories = existingData.histories.filter(song => song.SongId !== songIdToDelete);
        await existingData.save();

        res.json({ message: 'Song deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
        console.log(error);
    }
});
router.delete('/delete-all-history', fetchuser, async (req, res) => {
    try {
        const existingData = await Data.findOne({ user: req.user.id });

        if (!existingData) {
            return res.status(404).json({ error: "User's data not found" });
        }

        existingData.histories = [];
        await existingData.save();

        res.json({ message: 'All Song deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
        console.log(error);
    }
});

module.exports = router