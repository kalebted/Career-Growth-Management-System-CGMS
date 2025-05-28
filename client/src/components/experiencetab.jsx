import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, List, ListItem, IconButton, Checkbox,
  FormControlLabel, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getExperiences, addExperience, deleteExperience, updateExperience } from '../utils/api';

const ExperienceTab = () => {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getExperiences();
    setExperiences(data);
  };

  const clearForm = () => {
    setForm({
      _id: null,
      title: '',
      company: '',
      location: '',
      from: '',
      to: '',
      current: false,
      description: '',
    });
  };

  const handleSubmit = async () => {
    const payload = {
      title: form.title,
      company: form.company,
      location: form.location,
      from: form.from,
      description: form.description,
      current: form.current,
    };
    if (!form.current && form.to) payload.to = form.to;

    if (form._id) {
      await updateExperience(form._id, payload);
    } else {
      await addExperience(payload);
    }

    clearForm();
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteExperience(id);
    fetchData();
  };

  const handleEdit = (exp) => {
    setForm({
      _id: exp._id,
      title: exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      from: exp.from?.slice(0, 10) || '',
      to: exp.to?.slice(0, 10) || '',
      current: exp.current || false,
      description: exp.description || '',
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Work Experience
      </Typography>

      {/* Form */}
      <Stack spacing={2} mb={3}>
        <TextField
          label="Title / Role"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextField
          label="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <TextField
          label="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <TextField
          label="From"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
        />
        {!form.current && (
          <TextField
            label="To"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.checked })}
            />
          }
          label="I currently work here"
        />
        <TextField
          label="Description"
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ width: '180px', fontWeight: 'bold' }}
        >
          {form._id ? 'Update Experience' : 'Add Experience'}
        </Button>
      </Stack>

      {/* Experience List */}
      <List>
        {experiences.map((exp) => (
          <ListItem
            key={exp._id}
            secondaryAction={
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(exp)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={() => handleDelete(exp._id)}
                >
                  Delete
                </Button>
              </Box>
            }
            sx={{ display: 'block', mb: 2, border: '1px solid #eee', borderRadius: 1, p: 2 }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {exp.title} @ {exp.company}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {exp.location} • {exp.from?.slice(0, 10)} — {exp.current ? 'Present' : exp.to?.slice(0, 10)}
            </Typography>
            {exp.description && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {exp.description}
              </Typography>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ExperienceTab;
