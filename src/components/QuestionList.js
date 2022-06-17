import {useState, useMemo, useEffect, useCallback} from 'react';
import data from '../assets/atbm.json';
import {Box, Typography, Paper, TextField, Pagination} from '@mui/material';
import debounce from 'lodash.debounce';

const Question = ({question, answers, answer, uuid}) => (
  <Box sx={{mt: 3}}>
    <Typography sx={{fontWeight: 'bold'}}>Câu hỏi: {question}</Typography>
    {answers.map((a, i) => <Typography style={answer === i ? {
      color: "#b22a00",
      fontWeight: "bold",
    } : {}} key={`${uuid}-${i}`}>{a}</Typography>)}
    <small>Ref: {uuid}</small>
  </Box>
)

const pageSize = 20;

export const QuestionList = () => {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(data);
  const [page, setPage] = useState(1);

  const willShow = useMemo(() => [...filtered].splice((page - 1) * pageSize, pageSize), [filtered, page]);

  const onFilter = useCallback(debounce((search) => {
    const regex = new RegExp(search, 'i');
    setFiltered(() => data.filter(
      ({ question: q, answers, uuid }) => [q, uuid, ...answers].some((prop) => regex.test(prop))
    ));
    setPage(1);
  }, 500), []);

  useEffect(() => {
    onFilter(search);
  }, [search]);

  return (
    <Box sx={{my: 3}} style={{height: '100%'}}>
      <Typography variant="h5" color="primary">
        Các câu hỏi đang có trên hệ thống
      </Typography>
      <Paper sx={{px: 3, py: 2, mt: 3}} elevation={8}>
        <TextField label="Tìm kiếm" type="text" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} sx={{mb: 3}}/>
        Có {filtered.length} kết quả. Đang hiển thị từ {(page - 1) * pageSize + 1} đến {Math.min(page * pageSize, filtered.length)}
        <Pagination count={Math.ceil(filtered.length/pageSize)} page={page} onChange={(_, p) => setPage(p)} shape="rounded" sx={{ mt: 3 }}/>

        {willShow?.map?.((question) => (<Question key={question.uuid} {...question} />))}
      </Paper>
    </Box>
  );
}
