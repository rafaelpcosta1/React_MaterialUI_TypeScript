import { Button } from '@mui/material';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppThemeContext, useDrawerContext } from '../shared/contexts';

export const AppRoutes = () => {
  const { toggleTheme } = useAppThemeContext();
  const { toggleDrawerOpen, setDrawerOptions } = useDrawerContext();
  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/pagina-inicial',
        label: 'Página inicial',
      },
      {
        icon: 'menu',
        path: '/menu',
        label: 'Menu',
      }
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Button variant="contained" color="primary" onClick={toggleTheme}>Toggle Theme</Button>} />
      <Route path="/menu" element={<Button variant="contained" color="primary" onClick={toggleDrawerOpen}>Menu Lateral</Button>} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};