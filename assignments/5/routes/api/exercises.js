import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'woop woop' });
})

router.get('/new', (req, res) => {
    res.send('new exersize');
})

router
    .route('/:exerciseId')
    .get((req, res) => {
    res.send(`exercise ${req.params.exerciseId}`);
    })
    .put('/:exerciseId', (req, res) => {
    res.send(`exercise ${req.params.exerciseId}`);
    })
    .delete('/:exerciseId', (req, res) => {
    res.send(`exercise ${req.params.exerciseId}`);
    }) 
export default router;