import { Router, Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';
import { min } from 'moment';
const SpotifyWebApi = require('spotify-web-api-node');

const SPOTIFY_TOKEN_URL = process.env.SPOTIFY_TOKEN_URL;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_CALL_BACK_URL_LOCAL =
    process.env.SPOTIFY_CALL_BACK_URL_LOCAL;
const spotifyApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: 'https://spotifyapitesting-2.onrender.com/callback',
});

interface RecommendationQuery {
    min_energy?: number | string;
    seed_artists?: string | string[];
    seed_genres?: string | string[];
    seed_tracks?: string | string[];
    min_popularity?: number | string;
}

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'ExpressJS, Typescript, TypeORM, Postgres' });
});

router.get('/spotify_connect', async (req, res) => {
    const body = qs.stringify({
        grant_type: 'client_credentials',
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
    });

    try {
        const result = await axios.post(SPOTIFY_TOKEN_URL, body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        spotifyApi.setAccessToken(result.data.access_token);
        res.json({ message: 'connect successfully' });
    } catch (error) {
        console.error(
            'Error fetching Spotify token:',
            error.response ? error.response.data : error.message,
        );
        res.status(400).json({
            message: 'Error fetching Spotify token',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/get_artist_album/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { limit, offset } = req.query;
        const result = await spotifyApi.getArtistAlbums(id, {
            limit,
            offset,
        });
        res.json({ result: result });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/get_album/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await spotifyApi.getAlbum(id);
        res.json({ result: result });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/list_albums', async (req, res) => {
    try {
        // Access query parameters correctly
        const ids = req.query.ids as string;

        if (!ids) {
            return res.status(400).json({
                message:
                    'Please provide a valid comma-separated list of album IDs',
            });
        }

        // Split the comma-separated string into an array
        const idsArray = ids.split(',');

        // Fetch albums from Spotify API
        const result = await spotifyApi.getAlbums(idsArray);

        // Send response with fetched albums
        res.json({ result: result.body });
    } catch (error) {
        // Handle errors
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/get_artist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await spotifyApi.getArtist(id);
        res.json({ result: result });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/list_artists', async (req, res) => {
    try {
        const ids = req.query.ids as string;

        if (!ids) {
            return res.status(400).json({
                message:
                    'Please provide a valid comma-separated list of album IDs',
            });
        }

        const idsArray = ids.split(',');

        const result = await spotifyApi.getArtists(idsArray);

        res.json({ result: result.body });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/search_tracks', async (req, res) => {
    try {
        const artist = req.query.artist as string;
        const track = req.query.track as string;

        const query = `${artist == 'true' ? 'artist:' : ''}${track}`;

        const result = await spotifyApi.searchTracks(query);

        res.json({ result: result.body });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/search_artists', async (req, res) => {
    try {
        const artist = req.query.artist as string;

        const result = await spotifyApi.searchArtists(artist);

        res.json({ result: result.body });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/search_playlists', async (req, res) => {
    try {
        const playlist = req.query.playlist as string;

        const result = await spotifyApi.searchPlaylists(playlist);

        res.json({ result: result.body });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/get_artist_top_tracks/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await spotifyApi.getArtistTopTracks(id, 'GB');
        res.json({ result: result });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/get_artist_related/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await spotifyApi.getArtistRelatedArtists(id);
        res.json({ result: result });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/get_audio_feature_or_analysis/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { audio_feature } = req.query;
        let result;
        if (audio_feature == 'true') {
            result = await spotifyApi.getAudioFeaturesForTrack(id);
        }

        result = await spotifyApi.getAudioAnalysisForTrack(id);
        res.json({ result: result });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/me', async (req, res) => {
    try {
        const result = await spotifyApi.getMe();
        res.json({ result: result });
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching Spotify API',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.get('/login', (req, res) => {
    const scopes = [
        'playlist-modify-public',
        'playlist-modify-private',
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'user-library-read',
        'user-top-read',
        'user-follow-read',
    ];
    const redirectUri = spotifyApi.createAuthorizeURL(scopes);
    res.redirect(redirectUri);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code as string;
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);

        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        res.redirect('/me');
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(400).json({
            message: 'Error getting tokens',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.post('/create_playlist', async (req, res) => {
    try {
        const { name, description } = req.body;
        const result = await spotifyApi.createPlaylist(name, {
            description: description,
            public: true,
        });
        res.json({ result: result.body });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(400).json({
            message: 'Error creating playlist',
            error: error.response ? error.response.data : error.message,
        });
    }
});

router.post(
    '/add_tracks_to_playlists/:playlist_id',
    async (req, res) => {
        try {
            const { playlist_id } = req.params;
            const tracks = req.body as string[];
            const domain = 'spotify:track:';
            const formatTracks = tracks.map((track) => {
                return `${domain}${track}`;
            });
            const result = await spotifyApi.addTracksToPlaylist(
                playlist_id,
                [...formatTracks],
            );
            res.json({ result: result.body });
        } catch (error) {
            console.error('Error creating playlist:', error);
            res.status(400).json({
                message: 'Error creating playlist',
                error: error.response
                    ? error.response.data
                    : error.message,
            });
        }
    },
);

router.get('/followed_artist', async (req, res) => {
    try {
        const { limit } = req.query;
        const result = await spotifyApi.getFollowedArtists(limit);
        res.json({ result: result.body });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(400).json({
            message: 'Error creating playlist',
            error: error.response ? error.response.data : error.message,
        });
    }
});
// Tạo router với type cho request
router.post(
    '/recommendation',
    async (
        req: Request<{}, {}, RecommendationQuery>,
        res: Response,
    ) => {
        try {
            const {
                min_energy = '0',
                seed_artists = [],
                seed_genres = [],
                seed_tracks = [],
                min_popularity = '0',
            } = req.body;

            console.log(req.body);

            const minEnergyNumber = Number(min_energy);
            const minPopularityNumber = Number(min_popularity);

            if (isNaN(minEnergyNumber) || isNaN(minPopularityNumber)) {
                return res.status(400).json({
                    message:
                        'Invalid input for min_energy or min_popularity',
                });
            }

            const seedArtistsArray = Array.isArray(seed_artists)
                ? seed_artists
                : JSON.parse(seed_artists);
            const seedGenresArray = Array.isArray(seed_genres)
                ? seed_genres
                : JSON.parse(seed_genres);
            const seedTracksArray = Array.isArray(seed_tracks)
                ? seed_tracks
                : JSON.parse(seed_tracks);

            // Gọi Spotify API for testing
            const result = await spotifyApi.getRecommendations({
                min_energy: minEnergyNumber,
                min_popularity: minPopularityNumber,
                seed_artists: seedArtistsArray,
                seed_genres: seedGenresArray,
                seed_tracks: seedTracksArray,
            });

            res.json({ result: result.body });
        } catch (error) {
            console.error('Error getting recommendations:', error);
            res.status(400).json({
                message: 'Error getting recommendations',
                error: error.response
                    ? error.response.data
                    : error.message,
            });
        }
    },
);

export default router;
