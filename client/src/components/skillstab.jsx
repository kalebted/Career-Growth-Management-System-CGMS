import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, MenuItem, List, ListItem, Typography,
  Chip, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Autocomplete from '@mui/material/Autocomplete';
import { getMySkills, addSkill, removeSkill, searchSkills } from '../utils/api';

const SkillsTab = () => {
  const [skills, setSkills] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ skill_id: null, proficiency_level: 'beginner' });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const data = await getMySkills();
    setSkills(data);
  };

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const results = await searchSkills(query);
      setOptions(results);
    } catch (err) {
      console.error('Failed to fetch skills', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!form.skill_id) return;

    const exists = skills.find(s => s.skill._id === form.skill_id);
    if (exists) {
      await removeSkill(form.skill_id);
    }

    await addSkill({
      skill_id: form.skill_id,
      proficiency_level: form.proficiency_level,
    });

    setForm({ skill_id: null, proficiency_level: 'beginner' });
    fetchSkills();
  };

  const handleDelete = async (id) => {
    await removeSkill(id);
    fetchSkills();
  };

  const handleEdit = (skill) => {
    setForm({
      skill_id: skill.skill._id,
      proficiency_level: skill.proficiency_level,
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        My Skills
      </Typography>

      <Autocomplete
        freeSolo={false}
        options={options}
        loading={loading}
        getOptionLabel={(option) => option.skill_name || ''}
        onInputChange={(e, value) => handleSearch(value)}
        onChange={(e, value) => setForm({ ...form, skill_id: value?._id || null })}
        renderInput={(params) => (
          <TextField {...params} label="Skill" placeholder="Start typing..." fullWidth />
        )}
        sx={{ mb: 2 }}
      />

      <TextField
        select
        label="Proficiency Level"
        value={form.proficiency_level}
        onChange={(e) => setForm({ ...form, proficiency_level: e.target.value })}
        sx={{ mb: 2 }}
        fullWidth
      >
        {['beginner', 'intermediate', 'expert'].map((lvl) => (
          <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
        ))}
      </TextField>

      <Button variant="contained" onClick={handleAddOrUpdate} disabled={!form.skill_id}>
        {skills.find(s => s.skill._id === form.skill_id) ? 'Update' : 'Add'}
      </Button>

      <List sx={{ mt: 3 }}>
        {skills.map((s) => (
          <ListItem
            key={s.skill._id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #eee',
              borderRadius: 1,
              p: 2,
              mb: 2,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography fontWeight="bold">
                {s.skill.skill_name}
              </Typography>
              <Chip
                label={s.proficiency_level}
                color={
                  s.proficiency_level === 'beginner' ? 'default' :
                  s.proficiency_level === 'intermediate' ? 'warning' :
                  'success'
                }
                size="small"
              />
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(s.skill._id)}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => handleEdit(s)}
              >
                Edit
              </Button>
            </Stack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SkillsTab;
