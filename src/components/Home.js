import {useState} from 'react';
import {Container, Box, Typography, Paper, TextField, InputAdornment, Button} from '@mui/material';
import data from '../assets/atbm.json';
import {QuestionList} from './QuestionList';
import {useNavigate} from 'react-router-dom';

const inRange = (value, min, max) => Math.max(min, Math.min(max, value));

export function Home() {
  const navigate = useNavigate();
  const [quizz, setQuizz] = useState({
    numberOfQuestions: 60,
    secondPerQuestion: 30,
  });

  return (
    <Container sx={{mt: 5}}>
      <Typography variant="h4" color="primary">
        Trắc nghiệm an toàn bảo mật 2022
      </Typography>
      <Paper sx={{px: 3, py: 2, mt: 3}} elevation={8}>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <TextField label="Số câu" type="number"
                     InputProps={{
                       endAdornment: (<InputAdornment position="end">/{data.length}</InputAdornment>),
                       step: 1,
                     }}
                     value={quizz.numberOfQuestions}
                     onChange={(event) => setQuizz((q) => ({ ...q, numberOfQuestions: inRange(event.target.value, 1, data.length)}))}
          />
          <TextField label="Số giây mỗi câu" sx={{mx: 3}}
                     InputProps={{endAdornment: (<InputAdornment position="end">giây</InputAdornment>)}}
                     value={quizz.secondPerQuestion}
                     onChange={(event) => setQuizz((q) => ({ ...q, secondPerQuestion: inRange(event.target.value, 1, 100)}))}
          />
          <Button color="primary" variant="contained" onClick={() => navigate(`/practice?s=${quizz.numberOfQuestions}&t=${quizz.secondPerQuestion}`)}>Bắt đầu làm bài</Button>
        </Box>
      </Paper>
      <QuestionList />
    </Container>
  );
}
