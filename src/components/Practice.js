import {useEffect, useState, useMemo, useRef} from 'react';
import {useNavigate, useLocation, Link as RLink} from 'react-router-dom';
import * as _ from 'lodash';
import data from '../assets/atbm.json';
import {
  Container,
  Paper,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Pagination,
  PaginationItem,
  Typography,
  Link
} from '@mui/material';


export const Practice = () => {
  const {search} = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeOut, setTimeOut] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const initialized = useRef();

  const onSubmit = () => {
    setSubmitted(true);
    clearInterval(initialized.current);
    initialized.current = null;
  }

  useEffect(() => {
    const query = new URLSearchParams(search)
    const numberOfQuestion = +query.get('s');
    const timePerQuestion = +query.get('t');
    if (numberOfQuestion && timePerQuestion) {
      if (!initialized.current) {
        const q = _.sampleSize(data, numberOfQuestion);
        setAnswers(new Array(q.length).fill(-1));
        setQuestions(q);

        const start = Date.now();
        let t = timePerQuestion * q.length;
        setTimeOut(t);
        initialized.current = setInterval(() => {
          if (start + t * 1000 < Date.now()) {
            onSubmit();
          } else {
            setTimeOut(Math.round(t + (start - Date.now()) / 1000));
          }
        }, 1000);
      }
    } else {
      navigate('/', {replace: true});
    }
  }, [search]);

  const _currentQuestion = useMemo(() => questions[currentQuestion], [questions, currentQuestion])
  const onSelect = (question) => (e) => {
    const _answers = [...answers];
    _answers[question] = +e.target.value;
    setAnswers(_answers);
  }

  const _renderItem = (item) => <PaginationItem {...item}
                                                sx={
                                                  item.type === "page" && (submitted
                                                      ? (answers[item.page - 1] === questions[item.page - 1].answer
                                                        ? {backgroundColor: '#a2cf6e'}
                                                        : {backgroundColor: '#f73378'})
                                                      : (answers[item.page - 1] !== -1
                                                        ? {backgroundColor: '#91ff35'}
                                                        : {})
                                                  )
                                                }/>

  const corrected = useMemo(() => answers.reduce((prev, curr, i) => prev + +(questions[i].answer === curr), 0), [questions, answers]);

  return (
    <Container sx={{mt: 5}} className="do-not-select">
      <RLink to="/"><Link>Trở về trang chủ</Link></RLink>
      <Paper sx={{px: 3, py: 2, mt: 3}} elevation={8}>
        <Box display='flex' alignItems="center" justifyContent="space-between">
          <div>Câu hỏi {currentQuestion + 1}/{questions.length}</div>
          <div>{String(Math.floor(timeOut / 60)).padStart(2, "0")}:{String(Math.floor(timeOut % 60)).padStart(2, "0")}</div>
          {submitted ? <Typography color="primary">Đúng {corrected}/{questions?.length}</Typography> :
            <Button variant='contained' onClick={onSubmit}>Kết thúc</Button>}
        </Box>
        <Box sx={{my: 4}}>
          <h4 style={{ marginBottom: 0}}>{_currentQuestion?.question}</h4>
          <small>Ref: {_currentQuestion?.uuid}</small>

          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={onSelect(currentQuestion)}
            sx={{mt: 2}}
          >
            <FormControlLabel value={0} checked={answers[currentQuestion] === 0} control={<Radio/>}
                              label={_currentQuestion?.answers?.[0]}
                              disabled={submitted}
            />
            <FormControlLabel value={1} checked={answers[currentQuestion] === 1} control={<Radio/>}
                              label={_currentQuestion?.answers?.[1]}
                              disabled={submitted}
            />
            <FormControlLabel value={2} checked={answers[currentQuestion] === 2} control={<Radio/>}
                              label={_currentQuestion?.answers?.[2]}
                              disabled={submitted}
            />
            <FormControlLabel value={3} checked={answers[currentQuestion] === 3} control={<Radio/>}
                              label={_currentQuestion?.answers?.[3]}
                              disabled={submitted}
            />
          </RadioGroup>

          {submitted && <h5>Đáp án: <span
            style={{color: _currentQuestion?.answer === answers[currentQuestion] ? '#4caf50' : '#f50057'}}>{_currentQuestion?.answers[_currentQuestion?.answer]}</span>
          </h5>}

        </Box>
        <Pagination boundaryCount={questions.length} count={questions.length} page={currentQuestion + 1}
                    onChange={(_, p) => setCurrentQuestion(p - 1)} shape="rounded" sx={{mt: 3}}
                    renderItem={_renderItem}
        />

      </Paper>
    </Container>
  );
}
